import { departmentDummy, positionDummy, type IAddDepartment, type ICompany, type ICompanyForm, type IDepartment, type IUnit } from "@/interfaces/Company";
import type { IPosition, IUser } from "@/interfaces/User";
import type { AxiosResponse } from "axios";
import { useOrganizationStore } from "@/stores/organizationStore";
import { isSuccessRequest } from "@/utils/helpers/network";
import { Employee } from "./Employee";
import type { TResult } from "@/interfaces/Error";
import Manager from "./Manager";
import type { Vacation } from "./Vacation";
import type { IDeal, IProduct } from "@/interfaces/ProductsDeals";
import Dictionary from "@/utils/Dictionary";
import { useDictStore } from "@/stores/dictStore";

/**
 * Инстанс компании создаётся при первой загрузке самого юзера - в UserManager -> LoadUserData
 */
export default class Company extends Manager implements ICompany {

    static instance: Company | null = null

    protected _apiModule: string = 'company'

    _store: ReturnType<typeof useOrganizationStore>

    static getInstance (
        companyData?: ICompany
    ): Company {
        if (Company.instance) {
            return Company.instance
        }
        if (typeof companyData === 'undefined') {
            throw new TypeError('No Company instance created. Create with .getInstance + parameters')
        }
        return new Company (
            companyData.id,
            companyData.name,
            companyData.address,
            companyData.accountBalance
        )
    }

    private constructor (
        id            : number,
        name          : string,
        address       : string,
        accountBalance: number
    ) {
        if (Company.instance) throw new TypeError('Instance creation only with .getInstance()')
        super()

        this.initNetwork(this._apiModule)

        this._store = useOrganizationStore()
        this._store.setCompany({ id, name, address, accountBalance })

        if(id > 0) {
            this.loadAdditionalCompanyData()
            this.loadDictionaries()
            Company.instance = this
        }

    }

    /**
        загружаем связанные данные компании - департаменты, сотрудников и пр.
    */
    public async loadAdditionalCompanyData() {
        Promise.all([
            this.getFullDepartmentsList(),
            this.getFullEmployeesList(),
            this.getFullPositionsList(),
            this.getWarehouse(),
            this.getDeals(),
        ])
            .then((res: any) => {
                const [
                    departments,
                    employees,
                    positions,
                    warehouse,
                    deals
                ]:
                    [IDepartment[], Employee[], IPosition[], IProduct[], IDeal[]]
                 = res;

                this._store.departments = departments
                this._store.setEmployees(employees)
                this._store.positions = positions
                this._store.warehouse = warehouse
                this._store.deals = deals
            })
    };

    /**
        загружаем словари статичных данных
    */
    public async loadDictionaries() {
        const dictStore = useDictStore()
        //const unitDictionaryObj = await new Dictionary<IUnit>('units')
        const unitDictionary = await new Dictionary<IUnit>('units').initData()
        const companiesDictionary = await new Dictionary<ICompany>('companies').initData()

        dictStore.setDictionary<IUnit>(unitDictionary, 'units')
        dictStore.setDictionary<ICompany>(companiesDictionary, 'companies')
    }

    get id() {
        return this._store.company.id
    }
    get name() {
        return this._store.company.name
    }
    get address() {
        return this._store.company.address
    }
    get accountBalance() {
        return this._store.company.accountBalance
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
    get warehouse(): IProduct[] {
        return this._store.warehouse
    }
    get deals(): IDeal[] {
        return this._store.deals
    }

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
        const deptFullList = await this._getData(`get_full_departmets_list?cid=${this.id}`)()
        return deptFullList.data
    }

    /**
     * Получаем список работников, без проверок, без авторизации
     * @returns IUser[]
     */
    async getFullEmployeesList(): Promise<AxiosResponse> {
        const employeeList = await this._getData(`get_full_employees_list?cid=${this.id}`)()
        return employeeList.data
    }

    /**
     * Получаем список должностей, без проверок, без авторизации
     * @returns IPosition[]
     */
    async getFullPositionsList(): Promise<AxiosResponse> {
        const employeeList = await this._getData(`get_positions?cid=${this.id}`)()
        return employeeList.data
    }

    /**
     * Получаем сделки компании с контрагентами
     * @returns IPosition[]
     */
    async getDeals(): Promise<AxiosResponse> {
        const deals = await this._getData(`get_deals?cid=${this.id}`)()
        return deals.data
    }

    /**
     * Получаем товары на складе
     * @returns IPosition[]
     */
    async getWarehouse(): Promise<AxiosResponse> {
        const warehouse = await this._getData(`get_warehouse?cid=${this.id}`)()
        return warehouse.data
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

    async changeEmployeePosition(newPositionId: IPosition['id'], userId: IUser['userId']): Promise<TResult<any>> {
        const employee = this.employees.find((emp: Employee) => emp.userId === userId)
        if(employee){
            const res = await employee.changeEmployeePosition(newPositionId, userId)
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

    addNewEmployeeVacation (vacation: Vacation): boolean {
        const thisEmp = this.getEmployeeById(vacation.userId)
        if(thisEmp !== null){
            return thisEmp.addNewVacation(vacation)
        }
        return false
    }

    getVacationById(userId: number, vacationId: number): Vacation | null {
        return this._store.getVacationById(userId, vacationId)
    }

    deleteVacation(vacation: Vacation): boolean {
        const foundEmployee = this.getEmployeeById(vacation.userId)
        if(foundEmployee){
            return foundEmployee.deleteVacation(vacation)
        }
        return false
    }

    addNewProduct(product: IProduct): boolean {
        return this._store.addNewProduct(product)
    }

    deleteProduct(product: IProduct): boolean {
        console.log('NO DELETE IMPLEMENTATION:', product)
        return false
        //return this._store.deleteProduct(product)
    }

    isMyCompany(checkingId: number){
        return this.id === checkingId
    }

    async loadCompanyOwnerUser(companyId: number): Promise<Employee | undefined> {
        const res = await this._getData(`get_company_owner?cid=${companyId}`)({})
        if(isSuccessRequest(res)) {
            return new Employee(res.data)
        }
        return undefined
    }
}
