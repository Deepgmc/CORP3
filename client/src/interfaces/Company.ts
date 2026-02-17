import type { AxiosResponse } from "axios"

export interface ICompany {
    companyId: number,
    name: string,
    address: string,
}

export interface ICompanyManager extends ICompany {
    saveCompanyProfile   : (company: ICompanyForm) => boolean,
    getFullDepartmetsList: () => Promise<AxiosResponse>,
    getFullEmployeesList : () => Promise<AxiosResponse>,
    //! RELATIONS
    departments?: IDepartment[]
}

export interface ICompanyForm extends Pick<ICompany, 'companyId' | 'name' | 'address'> {}

export type ICompanySelect<T extends ICompany> = {
    value: T['companyId'],
    label: T['name'],
}

export type IDeptSelect = {
    value: number,
    label: string
}

export interface IDepartment {
    id         : number,
    companyId  : ICompany['companyId'],
    name       : string,
    description: string,
    countusers : string
}

export interface IAddDepartment extends Pick<IDepartment, 'companyId' | 'name' | 'description' | 'countusers'> {}
