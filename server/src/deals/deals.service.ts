import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DealsEntity } from './entities/deals.entity';
import { In, Repository } from 'typeorm';
import { INewDeal, TdeferredWarehouseTransfer } from 'src/interfaces/Deal';
import { WarehouseEntity } from 'src/warehouse/entities/warehouse.entity';
import { Deals_productsEntity } from './entities/deals_products.entity';

@Injectable()
export class DealsService {
    constructor(

        @InjectRepository(DealsEntity)
        private dealsRepository: Repository<DealsEntity>,

        @InjectRepository(WarehouseEntity)
        private warehouseRepository: Repository<WarehouseEntity>,

        @InjectRepository(Deals_productsEntity)
        private Deals_productsRepository: Repository<Deals_productsEntity>,

    ) { }

    async findAll(): Promise<DealsEntity[]> {
        return await this.dealsRepository.find()
    }

    async processDeal(deal: INewDeal): Promise<number | false> {
        const ownerWarehouseIDs = deal.deferredWarehouseTransfer.map((item) => {
            return item.id
        })
        const ownerWarehouse = await this.warehouseRepository.find({where: { id: In(ownerWarehouseIDs) }})

        //проверяем, действительно ли хватает отгружаемых товаров у поставщика-продавца
        if(!this.checkWarehouseProductsExists(ownerWarehouse, deal.deferredWarehouseTransfer)) {
            throw new BadRequestException({error: 'BadRequestException', type: 'Wrong WH', message: 'Товары на складе не соответствуют запросу'})
        }

        //добавим товары на склад покупателя
        deal.deferredWarehouseTransfer.forEach(async (product) => {
            await this.warehouseRepository.findOne({where: {id: product.id}})
                .then(async (foundProduct) => {
                    if(foundProduct) {
                        const newPartnerProduct = await this.createWarehouseProduct({...foundProduct, count: product.count}, deal.partnerCompanyId)
                        await this.warehouseRepository.insert(newPartnerProduct)
                        this.warehouseRepository.update (
                            foundProduct.id,
                            {...foundProduct, count: foundProduct.count - product.count}
                        );
                    };
            })
        });

        //и создадим сделку
        return await this.createNewDeal(deal)
    }

    public async createNewDeal(deal: INewDeal): Promise<number> {
        const { deferredWarehouseTransfer, ...newDeal } = deal;
        const createdDeal = this.dealsRepository.create(newDeal)
        await this.dealsRepository.insert(createdDeal)

        //создадим связь продуктов со сделкой
        this.createDealsProducts(deferredWarehouseTransfer, createdDeal)
        return createdDeal.dealId
    }

    private createDealsProducts(deferredWarehouseTransfer: TdeferredWarehouseTransfer, createdDeal: DealsEntity): void {
        deferredWarehouseTransfer.forEach(async (product) => {
            const createdDP = this.Deals_productsRepository.create({
                dealId   : createdDeal.dealId,
                productId: product.id,
                count    : product.count
            })
            await this.Deals_productsRepository.insert(createdDP)
        })
    }

    private async createWarehouseProduct(product: WarehouseEntity, companyId: number): Promise<WarehouseEntity> {
        return this.warehouseRepository.create({
            name     : product.name,
            companyId: companyId,
            status   : 'in_deal',
            price    : product.price,
            count    : product.count,
            unitId   : product.unitId
        });
    }

    // проверка на наличие продуктов products на складе warehouse
    checkWarehouseProductsExists(warehouse: WarehouseEntity[], products: { id: number, count: number }[]): boolean {
        let isWHOk = true
        products.forEach((product) => {
            warehouse.forEach((warehouseProduct) => {
                if (warehouseProduct.id === product.id) {
                    if (warehouseProduct.count < product.count) {
                        isWHOk = false
                        return false
                    }
                }
            })
        })
        return isWHOk
    }
}
