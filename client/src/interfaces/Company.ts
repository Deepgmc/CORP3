export interface ICompany {
    companyId: number,
    name: string,
    address: string,

    saveCompanyProfile: (company: ICompanyForm) => boolean
}

export interface ICompanyForm extends Pick<ICompany, 'companyId' | 'name' | 'address'> {}

export type ICompanySelect<T extends ICompany> = {
    value: T['companyId'],
    label: T['name'],
}
