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
}

export interface INewProduct extends Required<Omit<IProduct, 'id'>> {}
