import type { IUser, TSkill } from "@/interfaces/User";
import type { ICompany, IDepartment, IPosition } from "@/interfaces/Company";
import type { TResult } from "@/interfaces/Error";
import { computed } from "vue";
import { Rbac } from "./Rbac";
import Manager from "./Manager";

export interface ITransition {
    [key: string]: {
        [key: string]: () => any
    }
}
export class Employee extends Manager {

    protected _apiModule: string = 'users'

    //private allStates = ['init', 'hired', 'fired']

    public     userId       : number    = 0
    public     username     : string    = ''
    public     firstName    : string    = ''
    public     lastName     : string    = ''
    public     birth        : number    = 0
    public     reg_date     : number    = 0
    public     hire_date    : number    = 0
    public     fire_date    : number    = 0
    public     email        : string    = ''
    public     bio          : string    = ''
    public     gender       : number    = 1 | 0
    public     phone        : string    = ''
    public     departmentId : number    = 0
    public     positionId   : number    = 0
    public     companyId    : number    = 0
    public     isDirector   : boolean   = false
    public     avatar       : string    = ''
    company     : ICompany | null       = null
    skills      : TSkill[]              = []
    department  : IDepartment | null    = null
    position    : IPosition | null      = null

    state = 'init'
    transitions: ITransition

    constructor(incomeIUser: IUser, isDummy: boolean = false) {
        super()

        Object.assign(this, incomeIUser)
        this.initNetwork(this._apiModule)

        const transitions = {
            init: {
                hire: () => {
                    this.changeStateTo('hired')
                    console.log('Hiring! State: ', this.state)
                    //this.hire_date = Date.now()
                }
            },
            hired: {
                fire: () => {
                    this.changeStateTo('fired')
                    this.dispatch('fire')
                }
            },
            fired: {
                fire: () => {
                    this.fire_date = 0
                    console.log('Firing! State: ', this.state)
                }
            }
        }

        let initState = 'init'

        if(!isDummy){
            if(isNewEmployee.call(incomeIUser)) {
                initState = 'init'
            } else if(isHired.call(incomeIUser)){
                initState = 'hired'
            } else if(isFired.call(incomeIUser)){
                initState = 'fired'
            }

            console.log('initState:', initState)
        }

        this.state = initState
        this.transitions = transitions
    }

    dispatch (actionName: string) {
        const thisActions = this.transitions[this.state]
        if(typeof thisActions !== 'undefined' && typeof thisActions[actionName] !== 'undefined'){
            const action = thisActions[actionName]
            if (action) {
                action.call(this)
            }
        } else {
            console.log(`Transition ${actionName} undefined`)
        }
    }

    changeStateTo (newState: string) {
        this.state = newState
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

    public isManager() {
        return computed(() => {
            if(Rbac.getInstance().checkIsAdmin(this.userId)){
                return true
            }
            return !!this.isDirector
        })
    }

    /** Еще не назначен на должность, не нанят и не работал */
    isNewEmployee(): boolean {
        return !isHired() && !isFired()
    }

    /** Работал раньше но был уволен */
    isFired(): boolean {
        if(+this.fire_date > 0) return true
        return false
    }

    /** Сейчас работает */
    isHired (): boolean {
        //if(isFired.call(this)) return false
        if(+this.hire_date > 0 && +this.fire_date === 0) return true
        return false
    }
}


/** Еще не назначен на должность, не нанят и не работал */
function isNewEmployee(): boolean {
    return !isHired.call(this) && !isFired.call(this)
}

/** Работал раньше но был уволен */
function isFired(): boolean {
    if(+this.fire_date > 0) return true
    return false
}

/** Сейчас работает */
function isHired (): boolean {
    //if(isFired.call(this)) return false
    if(+this.hire_date > 0 && +this.fire_date === 0) return true
    return false
}






// this.userId                                     = employeeData.userId
        // this.username                                   = employeeData.username
        // this.lastName                                   = employeeData.lastName
        // this.firstName                                  = employeeData.firstName
        // this.birth                                      = employeeData.birth
        // this.reg_date                                   = employeeData.reg_date
        // this.hire_date                                  = employeeData.hire_date
        // this.fire_date                                  = employeeData.fire_date
        // this.email                                      = employeeData.email
        // this.bio                                        = employeeData.bio
        // this.gender                                     = employeeData.gender
        // this.phone                                      = employeeData.phone
        // this.isDirector                                 = employeeData.isDirector
        //  if(employeeData.avatar) this.avatar            = employeeData.avatar
        // if(employeeData.departmentId) this.departmentId = employeeData.departmentId
        // if(employeeData.positionId) this.positionId     = employeeData.positionId

        // if(employeeData.company) this.company       = employeeData.company
        // if(employeeData.skills) this.skills         = employeeData.skills
        // if(employeeData.department) this.department = employeeData.department
        // if(employeeData.position) this.position     = employeeData.position
