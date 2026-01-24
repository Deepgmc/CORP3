import type { ICompany, ICompanyForm } from "@/interfaces/Company";
import type { IUser } from "@/interfaces/User";
import Manager from "./Manager";

type TCompanyData = {
    companyId: number,
    name     : string,
    address  : string,
    user     : IUser
}

/**
 * Инстанс компании создаётся при первой загрузке самого юзера - в AuthManager -> LoadUserData
 */
export default class Company extends Manager implements ICompany {

    static instance: Company | null = null

    protected _apiModule: string = 'company'

    static getInstance (
        companyData?: TCompanyData
    ): Company {
        if (Company.instance) {
            return Company.instance
        }
        if(typeof companyData === 'undefined'){
            throw new TypeError('No Company instance created. Create with .getInstance + parameters')
        }
        return new Company(companyData.companyId, companyData.name, companyData.address, companyData.user)
    }

    private constructor(
        public readonly companyId: number,
        public name              : string,
        public address           : string,
        public user              : IUser
    ){
        if (Company.instance) throw new TypeError('Instance creation only with .getInstance()')
        super()
        this._postData = this._post(this._apiModule)
        this._getData = this._get(this._apiModule)
    }

    saveCompanyProfile(company: ICompanyForm): boolean {
        console.log('Saving company:', company)
        return this._postData('save_company_profile')(company)
    }
}
