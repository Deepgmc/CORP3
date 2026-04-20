import type { ICompany } from './Company';

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
    count    : number | undefined
}

export interface INewProduct extends Required<Omit<IProduct, 'id'>> {}

export const productDummy = {
    name     : '',
    companyId: null,
    status   : productStatesNames.inStock,
    price    : undefined,
    unitId   : undefined,
    count    : undefined
}
