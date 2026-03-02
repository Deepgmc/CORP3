import type { IUser, TSkill } from "@/interfaces/User";
import Manager from "./Manager";
import type { ICompany, IDepartment, IPosition } from "@/interfaces/Company";
import type { TResult } from "@/interfaces/Error";

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
        if(employeeData.departmentId) this.departmentId = employeeData.departmentId
        if(employeeData.positionId) this.positionId     = employeeData.positionId
        if(employeeData.avatar) this.avatar             = employeeData.avatar
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

    // const isFired = computed((): boolean => {
    //     if(user.value.fire_date > 0) return true
    //     return false
    // })

    // const isHired = computed(() => {
    //     if(isFired.value) return false
    //     if(user.value.hire_date > 0) return true
    //     return true
    // })

    // const isDirector = computed(() => {
    //         return user.value.isDirector
    //     })
}
