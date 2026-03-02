import type { IUser, TSkill } from "@/interfaces/User";
import Manager from "./Manager";
import type { ICompany, IDepartment, IPosition } from "@/interfaces/Company";
import type { TResult } from "@/interfaces/Error";
import { computed } from "vue";
import { Rbac } from "./Rbac";

export class Employee extends Manager implements Partial<IUser> {

    protected  _apiModule: string   = 'users'

    public     userId    : number   = 0
    public     username  : string   = ''
    public     firstName : string   = ''
    public     lastName  : string   = ''
    public     birth     : number   = 0
    public     reg_date  : number   = 0
    public     hire_date : number   = 0
    public     fire_date : number   = 0
    public     email     : string   = ''
    public     bio       : string   = ''
    public     gender    : number   = 1 | 0
    public     phone     : string   = ''
    public     departmentId: number = 0
    public     positionId  : number = 0
    public     isDirector  : boolean= false
    public     avatar      : string = ''
    company    : ICompany | null    = null
    skills     : TSkill[]           = []
    department : IDepartment | null = null
    position   : IPosition | null   = null

    constructor(employeeData: IUser) {
        super()
        this._postData   = this._post(this._apiModule)
        this._getData    = this._get(this._apiModule)
        this._deleteData = this._delete(this._apiModule)
        this._patchData  = this._patch(this._apiModule)
        this.userId                                     = employeeData.userId
        this.username                                   = employeeData.username
        this.lastName                                   = employeeData.lastName
        this.firstName                                  = employeeData.firstName
        this.birth                                      = employeeData.birth
        this.reg_date                                   = employeeData.reg_date
        this.hire_date                                  = employeeData.hire_date
        this.fire_date                                  = employeeData.fire_date
        this.email                                      = employeeData.email
        this.bio                                        = employeeData.bio
        this.gender                                     = employeeData.gender
        this.phone                                      = employeeData.phone
        this.isDirector                                 = employeeData.isDirector
         if(employeeData.avatar) this.avatar            = employeeData.avatar
        if(employeeData.departmentId) this.departmentId = employeeData.departmentId
        if(employeeData.positionId) this.positionId     = employeeData.positionId

        if(employeeData.company) this.company       = employeeData.company
        if(employeeData.skills) this.skills         = employeeData.skills
        if(employeeData.department) this.department = employeeData.department
        if(employeeData.position) this.position     = employeeData.position

    }

    public async changeEmployeePosition(newPositionId: IPosition['id'], userId: IUser['userId']): Promise<TResult> {
        if(!Number.isInteger(newPositionId) || !Number.isInteger(userId)) return { error: true, errorMessage: 'Передан неверный id' }
        const res = await this._patchData('change_user_position')({
            userId,
            newPositionId,
        })
        if(res.data.affected !== 0) {
            return { error: false, res: true }
        }
        return { error: true, errorMessage: 'Не обновлено ни одной записи' }
    }

    /** Еще не назначен на должность, не нанят и не работал */
    public isNewEmployee(): boolean {
        return !this.isHired() && !this.isFired()
    }

    /** Работал раньше но был уволен */
    public isFired(): boolean {
        if(this.fire_date > 0) return true
        return false
    }

    /** Сейчас работает */
    public isHired (): boolean {
        if(this.isFired()) return false
        console.log('%c hire/ fire:', 'color:rgb(182, 86, 158);', this.hire_date,this.fire_date)
        if(this.hire_date > 0 && this.fire_date === 0) return true
        return false
    }

    public isManager() {
        return computed(() => {
            if(Rbac.getInstance().checkIsAdmin(this.userId)){
                return true
            }
            return !!this.isDirector
        })
    }
}
