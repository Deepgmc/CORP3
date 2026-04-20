export interface ICompany {
    id            : number,
    name          : string,
    address       : string,
    accountBalance: number
}

export type ICompanyEntity = ICompany


export interface IDepartment {
    id         : number,
    companyId  : ICompany['id'],
    name       : string,
    description: string
}

export interface IAddDepartment extends Pick<IDepartment, 'id' | 'name' | 'description'> {}