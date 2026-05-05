import type { Reactive } from 'vue';
import type { ICompany } from './Company';
import type Product from '@/entities/warehouse/Product';
import type { Employee } from '@/entities/Employee';

/**
* DEALS
* */
export interface IDeal {
    dealId          ?: number,
    partnerId       ?: number,
    partnerCompanyId?: number,
    reg_date        ?: string,
    shipment_date   ?: string,
    discount         : number,
    isNeedDocument   : boolean,
    ownerId          : number,
    ownerCompanyId   : number,

    deferredWarehouse: Reactive<Product[]>,

    selectedPartner     ?: ICompany,
    selectedPartnerOwner?: Employee,

    pushToDeferredWarehouse      : (newProduct: Product) => boolean,
    removeDeferredProduct        : (id: number) => number | false,
    deferredTransactionAmount    : () => number,
    isDealSuccess                : () => boolean,
    isShipmentDateSuccess        : () => boolean,
    checkWarehouseSelectedSuccess: () => boolean,
    setNewShipmentDate           : (newDate: string) => void,
}

export interface IDealModel extends Omit<IDeal, 'pushToDeferredWarehouse' | 'removeDeferredProduct' | 'deferredTransactionAmount' | 'isDealSuccess' | 'selectedPartner' | 'selectedPartnerOwner' | 'isShipmentDateSuccess' | 'checkWarehouseSelectedSuccess' | 'setNewShipmentDate' | 'deferredWarehouse'> {
    deferredWarehouseTransfer: {
        id: number,
        count: number
    }[]
}

export interface dealCreationStep {
    readonly id  : string,
        order    : number,
        label    : string,
        isSuccess: boolean
}


/**
* PRODUCTS
* */
export const enum productStatesNames {
    inStock = 'inStock',
    selled  = 'selled',
    deleted = 'deleted'
}

export interface IProduct {
    id       : number,
    companyId: ICompany['id'] | null,
    name     : string,
    status   : productStatesNames,
    price    : number | undefined,
    unitId   : number | undefined,
    count    : number
}

export interface INewProduct extends Partial<IProduct> {}

export const productDummy = {
    name     : '',
    companyId: null,
    status   : productStatesNames.inStock,
    price    : undefined,
    unitId   : undefined,
    count    : undefined
}
