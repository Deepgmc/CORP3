export const enum productStatesNames {
    inStock = 'inStock',
    selled  = 'selled',
    deleted = 'deleted'
}

export interface IProduct {
    id    : number | null,
    name  : string,
    status: productStatesNames
}

export interface INewProduct extends Required<Omit<IProduct, 'id'>> {}
