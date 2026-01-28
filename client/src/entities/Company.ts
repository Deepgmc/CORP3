import type { IAddDepartment, ICompany, ICompanyForm } from "@/interfaces/Company";
import type { IUser } from "@/interfaces/User";
import Manager from "./Manager";
import type { AxiosResponse } from "axios";
import { useCompanyStore } from "@/stores/companyStore";
import { RESPONSE_STATUS_CODES } from "@/constants";

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

    _store: any

    user: IUser

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

    private constructor (
        companyId: number,
        name: string,
        address: string,
        user: IUser
    ){
        if (Company.instance) throw new TypeError('Instance creation only with .getInstance()')
        super()
        this.user = user

        this._postData = this._post(this._apiModule)
        this._getData = this._get(this._apiModule)

        this._store = useCompanyStore()
        this._store.setCompany({companyId, name, address})
        this.getFullDepartmentsList()
    }

    get companyId() {
        return this._store.company.companyId
    }
    get name() {
        return this._store.company.name
    }
    get address() {
        return this._store.company.address
    }
    get departments() {
        return this._store.departments
    }

    async saveCompanyProfile(company: ICompanyForm): Promise<boolean> {
        console.log('Saving company:', company)
        const res: AxiosResponse = await this._postData('save_company_profile')(company)
        if(res.status === RESPONSE_STATUS_CODES.CREATED || res.status === RESPONSE_STATUS_CODES.SUCCESS) {
            return this._store.setCompany(company)
        }
        return false
    }

    /**
     * Получаем список департаментов, без проверок, без авторизации
     * @returns IDepartment[]
     */
    async getFullDepartmentsList(): Promise<AxiosResponse> {
        const deptFullList = await this._postData('get_full_departmets_list')({companyId: this.companyId}, false)
        this._store.setDepartments(deptFullList.data)
        return deptFullList.data
    }

    /**
     * Получаем список работников, без проверок, без авторизации
     * @returns IUser[]
     */
    async getFullEmployeesList(): Promise<AxiosResponse> {
        return await this._postData('get_full_employees_list')({companyId: this.companyId}, false)
    }

    /**
     * Добавляем новый департамент в компанию
     * @returns AxiosResponse
     */
    async addNewDepartment(newDepartment: IAddDepartment): Promise<AxiosResponse | boolean> {
        const res = await this._postData('add_new_company_department')(newDepartment)
        if(res.status === RESPONSE_STATUS_CODES.CREATED || res.status === RESPONSE_STATUS_CODES.SUCCESS){
            const newDeptId = res.data as number
            this._store.addNewDepartment({
                id: newDeptId,
                ...newDepartment
            })
        }
        return false
    }
}
