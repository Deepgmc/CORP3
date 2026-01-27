import type { AxiosResponse } from "axios"

export interface ICompany {
    companyId: number,
    name: string,
    address: string,

    saveCompanyProfile: (company: ICompanyForm) => boolean,
    getFullDepartmetsList: () => Promise<AxiosResponse>,
    getFullEmployeesList: () => Promise<AxiosResponse>,

    //! RELATIONS
    departments?: IDepartment[]
}

export interface ICompanyForm extends Pick<ICompany, 'companyId' | 'name' | 'address'> {}

export interface IDepartment {
    id         : number,
    companyId  : ICompany['companyId'],
    name       : string,
    description: string
}

export type ICompanySelect<T extends ICompany> = {
    value: T['companyId'],
    label: T['name'],
}
