import type { IUser } from "./User"

export interface ICompany {
    companyId: number,
    name: string,
    address: string,

    user?: IUser //relation
}

export type ICompanySelect<T extends ICompany> = {
    value: T['companyId'],
    label: T['name'],
    //[K in keyof T]: {label: K, value: T[K]}
}
