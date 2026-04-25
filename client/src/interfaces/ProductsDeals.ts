import type { ComputedRef, Reactive } from 'vue';
import type { ICompany } from './Company';
import type Product from '@/entities/warehouse/Product';

/**
* DEALS
* */
export interface IDeal {
    dealId           ?: number,
    partnerId        ?: number,
    partnerCompanyId ?: number,
    reg_date         ?: number,
    shipment_date    ?: number,
    discount          : number,
    ownerId           : number,
    ownerCompanyId    : number,

    deferredWarehouse: Reactive<Product[]>,
    pushToDeferredWarehouse: (newProduct: Product) => boolean,
    removeDeferredProduct: (id: number) => number | false,

    deferredTransactionAmount: ComputedRef<number>,
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

export interface INewProduct extends Required<IProduct> {}

export const productDummy = {
    name     : '',
    companyId: null,
    status   : productStatesNames.inStock,
    price    : undefined,
    unitId   : undefined,
    count    : undefined
}
