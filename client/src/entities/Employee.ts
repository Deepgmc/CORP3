import type { IUser, TSkill } from "@/interfaces/User";
import type { ICompany, IDepartment, IPosition } from "@/interfaces/Company";
import type { TResult } from "@/interfaces/Error";
import { computed } from "vue";
import { Rbac } from "./Rbac";
import { FiniteStateMachine } from "@/utils/FiniteStateMachine";

export interface ITransition {
    [key: string]: {
        [key: string]: () => any
    }
}
export class Employee extends FiniteStateMachine {

    protected _apiModule: string = 'users'

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

    constructor(incomeIUser: IUser, isDummy: boolean = false) {
        let initState = 'init'
        const transitions: ITransition = {
            init: {//новый, зареганный, привязан к компании при регистрации, но еще не сотрудник по сути
                initState: function() {
                    //console.log(`initState@init`)
                },
                hire: function() {
                    this.changeStateTo('hired').dispatch('initState')
                }
            },
            hired: {//нанят на работу, полноценный сотрудник, имеет должность, департамент и т.п.
                initState: function() {
                    //console.log(`initState@hired`)
                    this.hire_date = Date.now()
                },
                fire: function() {
                    this.changeStateTo('fired').dispatch('initState')
                },
            },
            fired: {//уволен. по сути тоже что init, привязан к компании, но имеет статус уволен
                initState: function() {
                    //console.log(`initState@fired`)
                    this.hire_date = 0
                    this.fire_date = Date.now()
                },
                back: function() {
                    this.changeStateTo('hired').dispatch('initState')
                    this.fire_date = 0
                }
            },
        }
        if(!isDummy){
            initState = getInitState(incomeIUser)
        }
        super(initState, transitions)

        Object.assign(this, incomeIUser)
        this.initNetwork(this._apiModule)
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
};

function getInitState(incomeIUser: IUser): string{
    if(isNewEmployee.call(incomeIUser)){
        return 'init'
    } else if(isHired.call(incomeIUser)){
        return 'hired'
    } else if(isFired.call(incomeIUser)){
        return 'fired'
    }
    return 'init'
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
    if(+this.hire_date > 0 && +this.fire_date === 0) return true
    return false
}
