import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WarehouseEntity } from './entities/warehouse.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';

@Injectable()
export class WarehouseService {
    constructor(
        @InjectRepository(WarehouseEntity)
        private warehouseRepository: Repository<WarehouseEntity>,
    ) { }

    async getAll(): Promise<WarehouseEntity[]> {
        return await this.warehouseRepository.find()
    }

    async saveNewProduct(newProduct: CreateWarehouseDto): Promise<CreateWarehouseDto> {
        return await this.warehouseRepository.save(newProduct)
    }

    async deleteProduct(id: number): Promise<DeleteResult> {
        const parsedId = Number(id)
        if(!Number.isInteger(parsedId)) throw new TypeError('Неверно передан id')
        return await this.warehouseRepository.delete({id: parsedId})
    }

    async getAllForCompany(companyId: number): Promise<WarehouseEntity[]> {
        return this.warehouseRepository.findBy({companyId})
    }
}
