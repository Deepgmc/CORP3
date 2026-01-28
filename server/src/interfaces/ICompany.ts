export interface ICompany {
    companyId: number,
    name     : string,
    address  : string,
}

export type ICompanyEntity = ICompany


export interface IDepartment {
    id         : number,
    companyId  : ICompany['companyId'],
    name       : string,
    description: string
}

export interface IAddDepartment extends Pick<IDepartment, 'companyId' | 'name' | 'description'> {}