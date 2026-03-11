import { departmentDummy, positionDummy, type IAddDepartment, type ICompany, type ICompanyForm, type IDepartment, type IPosition } from "@/interfaces/Company";
import type { IUser } from "@/interfaces/User";
import type { AxiosResponse } from "axios";
import { useCompanyStore } from "@/stores/companyStore";
import { isSuccessRequest } from "@/utils/helpers/network";
import type { Employee } from "./Employee";
import type { TResult } from "@/interfaces/Error";
import Manager from "./Manager";

type TCompanyData = {
    companyId: number,
    name: string,
    address: string,
}

/**
 * Инстанс компании создаётся при первой загрузке самого юзера - в UserManager -> LoadUserData
 */
export default class Company extends Manager implements ICompany {

    static instance: Company | null = null

    protected _apiModule: string = 'company'

    //_store: any
    _store: ReturnType<typeof useCompanyStore>


    static getInstance(
        companyData?: TCompanyData
    ): Company {
        if (Company.instance) {
            return Company.instance
        }
        if (typeof companyData === 'undefined') {
            throw new TypeError('No Company instance created. Create with .getInstance + parameters')
        }
        return new Company(companyData.companyId, companyData.name, companyData.address)
    }

    private constructor (
        companyId: number,
        name     : string,
        address  : string,
    ) {
        if (Company.instance) throw new TypeError('Instance creation only with .getInstance()')
        super()

        this.initNetwork(this._apiModule)

        this._store = useCompanyStore()
        this._store.setCompany({ companyId, name, address })

        //загружаем связанные данные компании - департаменты и сотрудников
        Promise.all([
            this.getFullDepartmentsList(),
            this.getFullEmployeesList(),
            this.getFullPositionsList()
        ])
            .then((res: any) => {
                const [
                    departments,
                    employees,
                    positions
                ]:
                    [IDepartment[], Employee[], IPosition[]]
                 = res;

                this._store.setDepartments(departments)
                this._store.setEmployees(employees)
                this._store.setPositions(positions)
            })
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

    get departments(): IDepartment[] {
        return this._store.departments
    }
    get employees(): Employee[] {
        //@ts-ignore
        return this._store.employees
    }
    get positions(): IPosition[] {
        return this._store.positions
    }

    // get departments() {
    //     return this._store.getDepartments
    // }
    // get employees() {
    //     return this._store.getEmployees
    // }
    // get positions() {
    //     return this._store.getPositions
    // }

    async saveCompanyProfile(company: ICompanyForm): Promise<boolean> {
        const res: AxiosResponse = await this._postData('save_company_profile')(company)
        if (isSuccessRequest(res)) {
            return this._store.setCompany(company)
        }
        return false
    }

    /**
     * Получаем список департаментов, без проверок, без авторизации
     * @returns IDepartment[]
     */
    async getFullDepartmentsList(): Promise<AxiosResponse> {
        const deptFullList = await this._getData(`get_full_departmets_list/${this.companyId}`)({}, false)
        return deptFullList.data
    }

    /**
     * Получаем список работников, без проверок, без авторизации
     * @returns IUser[]
     */
    async getFullEmployeesList(): Promise<AxiosResponse> {
        const employeeList = await this._getData(`get_full_employees_list/${this.companyId}`)({}, false)
        return employeeList.data
    }

    /**
     * Получаем список должностей, без проверок, без авторизации
     * @returns IPosition[]
     */
    async getFullPositionsList(): Promise<AxiosResponse> {
        const employeeList = await this._getData('get_positions')({}, false)
        return employeeList.data
    }

    /**
     * Добавляем новый департамент в компанию
     * @returns AxiosResponse
     */
    async addNewDepartment(newDepartment: IAddDepartment): Promise<AxiosResponse | boolean> {
        const res = await this._postData('add_new_company_department')(newDepartment)
        if (isSuccessRequest(res)) {
            this._store.addNewDepartment({
                id: res.data,
                ...newDepartment
            })
        }
        return false
    }

    /**
     * Открепляем от компании и удаляем департамент
     * @returns AxiosResponse
     */
    async deleteDepartment(departmentId: number): Promise<boolean> {
        const res = await this._deleteData(`delete_company_department/${departmentId}`)()
        if (isSuccessRequest(res)) {
            if (!res.data) return false
            return this._store.deleteDepartment(departmentId)
        }
        return false
    }

    /**
     * Меняем департамент работника
        меняем данные в БД, потом перезагружаем массив работников целиком (для реактивности)
     * @param user IUser
     * @param departmentFrom из какого департамента вытащили
     * @param departmentTo в какой департамент назначаем
     */
    public async switchUserDepartmets(user: IUser, departmentFrom: number, departmentTo: number) {
        await this._patchData('switch_user_department_id')({
            userId: user.userId,
            departmentFrom,
            departmentTo
        }, true)
        this._store.changeUserDepartment(user.userId, departmentFrom, departmentTo)
    }

    async changeEmployeePosition(newPositionId: IPosition['id'], userId: IUser['userId']): Promise<TResult> {
        const employee = this.employees.find((emp: Employee) => emp.userId === userId)
        if(employee){
            const res: TResult = await employee.changeEmployeePosition(newPositionId, userId)
            if(!res.error){
                this._store.changeEmployeePosition(newPositionId, userId)
            }
            return res
        }
        return {error: true, errorMessage: 'Unhandled error'}
    }

    public getEmployeeById(id: number): Employee | null {
        const foundEmployee = this.employees.find(emp => emp.userId === id)
        if(foundEmployee) return foundEmployee
        return null
    }

    getDepartmentById(departmentId: number): IDepartment {
        const foundDepartment: IDepartment | undefined = this.departments.find((dept: IDepartment) => dept.id === departmentId)
        return typeof foundDepartment === 'undefined' ? departmentDummy : foundDepartment
    }

    getPositionById(positionId: number): IPosition {
        const foundPosition = this.positions.find((pos: IPosition) => pos.id === positionId)
        return typeof foundPosition === 'undefined' ? positionDummy : foundPosition
    }
}
