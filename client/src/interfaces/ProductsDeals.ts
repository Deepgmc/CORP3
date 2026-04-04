import type { ICompany } from './Company';

export const enum productStatesNames {
    inStock = 'inStock',
    selled  = 'selled',
    deleted = 'deleted'
}

export interface IProduct {
    id       : number,
    companyId: ICompany['companyId'] | null,
    name     : string,
    status   : productStatesNames,
    price    : number,
    unitId   : number
}

export interface INewProduct extends Required<Omit<IProduct, 'id'>> {}

export const productDummy = {
    name     : '',
    companyId: null,
    status   : productStatesNames.inStock,
    price    : 0,
    unitId   : 0
}
