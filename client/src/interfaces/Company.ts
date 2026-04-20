import type { AxiosResponse } from "axios"

export interface ICompany {
    id            : number,
    name          : string,
    address       : string,
    accountBalance: number,
}

export interface ICompanyManager extends ICompany {
    saveCompanyProfile   : (company: ICompanyForm) => boolean,
    getFullDepartmetsList: () => Promise<AxiosResponse>,
    getFullEmployeesList : () => Promise<AxiosResponse>,
    //! RELATIONS
    departments?: IDepartment[]
}

export interface ICompanyForm extends Pick<ICompany, 'id' | 'name' | 'address'| 'accountBalance'> {}

export type ICompanySelect<T extends ICompany> = {
    value: T['id'],
    label: T['name'],
}


export const departmentDummy = {
    id         : 0,
    companyId  : 0,
    name       : '',
    description: '',
    countusers : ''
}
export interface IDepartment {
    id         : number,
    companyId  : ICompany['id'],
    name       : string,
    description: string,
    countusers : string
}

export type IDeptSelect = {
    value: number,
    label: string
}

export const positionDummy = {
    id: 0,
    position: ''
}

export interface IAddDepartment extends Pick<IDepartment, 'companyId' | 'name' | 'description' | 'countusers'> {}


export interface IUnit {
    id        : number,
    name      : string,
    shortName : string,
    nameCouple: string,
}
