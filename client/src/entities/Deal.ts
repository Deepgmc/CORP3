import { reactive, type Reactive } from "vue";
import type { dealCreationStep, IDeal, IDealModel } from "@/interfaces/ProductsDeals";
import Manager from "./Manager";
import type { ICompany } from "@/interfaces/Company";
import type { Employee } from "./Employee";
import type Product from "./warehouse/Product";

export class Deal extends Manager implements IDeal {

    _apiModule = 'deals'

    dealId ?: number

    partnerId           ?: number //ид контрагента-человека
    partnerCompanyId    ?: number //ид контрагента-компании
    selectedPartner     ?: ICompany //выбранная компания контрагента
    selectedPartnerOwner?: Employee //выбранный сотрудник контрагента

    reg_date     ?: string = new Date().toLocaleDateString()
    shipment_date?: string
    discount      : number = 0
    isNeedDocument: boolean = false

    public deferredWarehouse: Reactive<Product[]> = reactive<Product[]>([])

    readonly steps: dealCreationStep[] = [
        {
            id       : 'partnerSelection',
            order    : 1,
            label    : 'Выбор контрагента',
            isSuccess: false,
        },
        {
            id       : 'productSelection',
            order    : 2,
            label    : 'Выбор товара',
            isSuccess: false
        },
        {
            id       : 'taxLawSelection',
            order    : 3,
            label    : 'Документы, финансовые вопросы',
            isSuccess: false
        },
    ];

    //ищем щаг по порядковому номеру или id
    public getStep(id: string): dealCreationStep | undefined
    public getStep(order: number): dealCreationStep | undefined
    public getStep(type: number | string): dealCreationStep | undefined {
        let foundStep: dealCreationStep | undefined = undefined
        this.steps.forEach((step: dealCreationStep) => {
            if(typeof type === 'number'){
                if(step.order === type) {
                    foundStep = step
                    return
                }
            } else if(typeof type === 'string'){
                if(step.id === type) {
                    foundStep = step
                    return
                }
            } else { throw TypeError('Unhandled') }
        })
        return foundStep || this.steps[0]
    }

    //компания инициатор сделки (текущий пользователь)
    readonly ownerId         : number
    readonly ownerCompanyId  : number

    constructor(ownerId: number, ownerCompanyId: number) {
        super()
        this.ownerId = ownerId
        this.ownerCompanyId = ownerCompanyId

        this.initNetwork(this._apiModule)
    }

    pushToDeferredWarehouse(newProduct: Product) {
        const alreadyDeferredProductIndex = this.deferredWarehouse.findIndex((product) => product.id === newProduct.id)
        // если этот товар еще не добавляли, то добавим его в массив к отгрузке
        if(alreadyDeferredProductIndex === -1) {
            this.deferredWarehouse.push(newProduct)
            return true
        }
        // если этот товар уже добавляли - просто добавим количество
        if(typeof this.deferredWarehouse[alreadyDeferredProductIndex] !== 'undefined') {
            this.deferredWarehouse[alreadyDeferredProductIndex].count += +newProduct.count
            return true
        }
        return false
    }

    /** удаляет из сделки добавленный к отгрузке товар, возвращает количество */
    removeDeferredProduct(id: number): number | false {
        const productIndex = this.deferredWarehouse.findIndex((product) => product.id === id)
        const removingProductQuantity = this.deferredWarehouse[productIndex]?.count
        if(productIndex === -1 || !removingProductQuantity) return false
        this.deferredWarehouse.splice(productIndex, 1)
        return removingProductQuantity
    }

    resetPartnerCompany(){
        const partnerStep = this.getStep('partnerSelection')
        if(partnerStep) {
            this.partnerCompanyId     = undefined
            this.partnerId            = undefined
            this.selectedPartner      = undefined
            this.selectedPartnerOwner = undefined
            partnerStep.isSuccess     = false
        }
    }

    setPartnerSelectedSuccess(selectedPartner: ICompany, selectedPartnerOwner: Employee) {
        const partnerStep = this.getStep('partnerSelection')
        if(partnerStep) {
            this.selectedPartner = selectedPartner
            this.selectedPartnerOwner = selectedPartnerOwner
            partnerStep.isSuccess = true
        }
    }

    checkWarehouseSelectedSuccess(): boolean {
        if(this.isShipmentDateSuccess() && this.isDeferredWarehouseFilled()) {
            this.setWarehouseSelectedStatus()
            return true
        }
        this.setWarehouseSelectedStatus(true)
        return false
    }

    /**
     * Ставим статус заполнения шага "склад"
     * @param isFail передаём, если статус надо выставить в "склад заполнен неверно"
     */
    private setWarehouseSelectedStatus(isFail = false): void {
        const warehouseStep = this.getStep('productSelection')
        if(warehouseStep) {
            warehouseStep.isSuccess = isFail ? false : true
        }
    }

    private isDeferredWarehouseFilled(): boolean {
        return this.deferredWarehouse.length > 0
    }

    public setNewShipmentDate(newDate: string): void {
        this.shipment_date = newDate
    }

    isShipmentDateSuccess(): boolean {
        return !!this.shipment_date && this.shipment_date.length > 3
    }

    public deferredTransactionAmount(): number {
        return this.deferredWarehouse.reduce((acc, item) => {
            if(!item.unitId || !item.price) return acc
            return acc + item.getCost()
        }, 0)
    }

    public isDealSuccess(): boolean {
        return this.steps.every((step) => step.isSuccess)
    }

    public successTaxStep(discount: number, isNeedDocument: boolean): boolean {
        this.discount = discount
        this.isNeedDocument = isNeedDocument
        const thisStep = this.getStep('taxLawSelection');
        if (thisStep) {
            thisStep.isSuccess = true;
        }
        return true
    }

    protected getModel(): IDealModel {
        return {
            dealId           : this.dealId,
            reg_date         : this.reg_date,
            shipment_date    : this.shipment_date,
            discount         : this.discount,
            isNeedDocument   : this.isNeedDocument,

            partnerId        : this.partnerId,
            partnerCompanyId : this.partnerCompanyId,
            ownerId          : this.ownerId,
            ownerCompanyId   : this.ownerCompanyId,

            deferredWarehouseTransfer: this.deferredWarehouse.map((product) => {
                return {id: product.id, count: product.count}
            }),
        }
    }

    async save() {
        try {
            const res = await this._postData('save_deal')(this.getModel())
            console.log('res:', res)
        } catch (e) {
            console.log('e:', e)
        }
    }
}
