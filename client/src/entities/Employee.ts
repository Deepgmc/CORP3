import type { IPosition, IUser, TMedicalLabel, TSkill } from "@/interfaces/User";
import type { ICompany, IDepartment } from "@/interfaces/Company";
import type { TResult } from "@/interfaces/Error";
import { computed } from "vue";
import { Rbac } from "./Rbac";
import { FiniteStateMachine, type TState } from "@/utils/FiniteStateMachine";
import { Vacation } from "./Vacation";
import { labelVacationIsMedical } from "@/utils/constants/main";

export interface ITransition {
    [key: string]: {
        [key: string]: () => any
    }
}

export const enum employeeStateNames {
    INIT  = 'init',
    HIRED = 'hired',
    FIRED = 'fired'
}

export const employeeStates: Record<employeeStateNames, TState> = {
    [employeeStateNames.INIT]: {
        name       : employeeStateNames.INIT,
        isActive   : isNewEmployee,
        label      : 'Новый сотрудник',
        icon       : 'fiber_new',
        color      : 'primary',
        transitions: [{
            name: employeeStateNames.HIRED,
            action: 'hire'
        }],
    },
    [employeeStateNames.HIRED]: {
        name       : employeeStateNames.HIRED,
        isActive   : isHired,
        label      : 'Работает',
        icon       : 'done',
        color      : 'positive',
        transitions: [{
            name: employeeStateNames.FIRED,
            action: 'fire'
        }],
    },
    [employeeStateNames.FIRED]: {
        name       : employeeStateNames.FIRED,
        isActive   : isFired,
        label      : 'Уволен',
        icon       : 'close',
        color      : 'negative',
        transitions: [{
            name: employeeStateNames.HIRED,
            action: 'hire'
        }],
    }
};

export class Employee extends FiniteStateMachine implements IUser {

    protected _apiModule: string = 'users'

    public     id           : number    = 0
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
    vacations   : Vacation[]            = []

    static getVacationIsMedicalText(value: boolean): string {
        const val: TMedicalLabel | undefined = labelVacationIsMedical[Number(value)]
        if(val !== undefined) return val.label
        return ''
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(incomeIUser: IUser, _isDummy: boolean = false) {

        const FSMTransitions: ITransition = {
            init: {//новый, зареганный, привязан к компании при регистрации, но еще не сотрудник по сути
                initState: function() {},
                hire: async function(isInitialization = false) {
                    this.changeStateTo(employeeStates[employeeStateNames.HIRED]).dispatch('initState', isInitialization)
                }
            },
            hired: {//нанят на работу, полноценный сотрудник, имеет должность, департамент и т.п.
                initState: async function(isInitialization = false) {
                    this.hire_date = Date.now()
                    this.fire_date = 0
                    if(isInitialization) return

                    const hireRes = await this.hireEmployee()
                    if(hireRes.error) {
                        console.warn(`Статус найма на работу ${this.userId} не был изменён`)
                    }
                },
                fire: async function(isInitialization = false) {
                    this.changeStateTo(employeeStates[employeeStateNames.FIRED]).dispatch('initState', isInitialization)
                },
            },
            fired: {//уволен. по сути тоже что init, привязан к компании, но имеет статус уволен
                initState: async function(isInitialization = false) {
                    this.hire_date = 0
                    this.fire_date = Date.now()
                    if(isInitialization) return

                    const fireRes = await this.fireEmployee()
                    if(fireRes.error) {
                        console.warn(`Статус увольнения ${this.userId} не был изменён`)
                    }
                },
                hire: function(isInitialization = false) {
                    this.changeStateTo(employeeStates[employeeStateNames.HIRED]).dispatch('initState', isInitialization)
                }
            },
        }
        const initState: TState = getInitState(incomeIUser)
        if(initState === null) throw new TypeError(`Не определён начальный статус сотрудника: ${incomeIUser.userId}`)
        super(initState, FSMTransitions)

        const desearelizedUser = this.deserializeIncomeUser(incomeIUser)
        Object.assign(this, desearelizedUser)
        this.initNetwork(this._apiModule)
    }

    private deserializeIncomeUser(incomeUser: IUser): IUser {
        incomeUser.vacations = incomeUser.vacations
            .map(vac => {
                return new Vacation(vac)
            })
            .sort()
        return incomeUser
    }

    public async hireEmployee(): Promise<TResult> {
        const res = await this._patchData('hire_employee')({ userId: this.userId })
        if(res.data.affected !== 0) {
            return { error: false, res: true }
        }
        return { error: true, errorMessage: 'Не обновлено ни одной записи' }
    }

    public async fireEmployee(): Promise<TResult> {
        const res = await this._patchData('fire_employee')({ userId: this.userId })
        if(res.data.affected !== 0) {
            return { error: false, res: true }
        }
        return { error: true, errorMessage: 'Не обновлено ни одной записи' }
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

    public isNewEmployee(): boolean {
        return isNewEmployee.call(this)
    }
    public isHired(): boolean {
        return isHired.call(this)
    }
    public isFired(): boolean {
        return isFired.call(this)
    }

    public addNewVacation(vacation: Vacation): boolean {
        this.vacations.push(vacation)
        return true
    }

    public deleteVacation(vacation: Vacation): boolean {
        const deletingIndex = this.vacations.findIndex(vac => vac.id === vacation.id)
        if(deletingIndex){
            this.vacations = this.vacations.splice(deletingIndex, 1)
            return true
        }
        return false
    }
};

function getInitState(incomeIUser: IUser): TState {
    return Object.entries(employeeStates).reduce((acc: TState, [, state]) => {
        if(state.isActive.call(incomeIUser)) acc = state
        return acc
    }, Object.assign({}, employeeStates[employeeStateNames.INIT]) )
}

/** Еще не назначен на должность, не нанят и не работал */
function isNewEmployee(): boolean {
    return !isHired.call(this) && !isFired.call(this)
}

/** Сейчас работает */
function isHired (): boolean {
    return +this.hire_date > 0 && +this.fire_date === 0
}

/** Работал раньше но был уволен */
function isFired(): boolean {
    return +this.fire_date > 0
}
