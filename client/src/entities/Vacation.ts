import type { IVacation, TMedicalLabel, TUserId } from "@/interfaces/User";
import { labelVacationIsMedical } from "@/utils/constants/main";
import Manager from "./Manager";
import { Rbac } from "./Rbac";
import type { TResult } from "@/interfaces/Error";
import { UNKNOWN_ERROR } from "@/utils/constants/texts";

export class Vacation extends Manager implements IVacation {

    _apiModule = 'users/vacation'

    public  id!                 : number
    public  dateFrom !          : number
    public  dateTo   !          : number
    public  isMedical!          : boolean
    public  readonly userId    !: TUserId
    private $um                 : Rbac

    constructor(rawVacation: IVacation) {
        super()
        Object.assign(this, rawVacation)
        this.initNetwork(this._apiModule)
        this.$um = Rbac.getInstance()
    }

    public getVacationIsMedicalText() {
        const val: TMedicalLabel | undefined = labelVacationIsMedical[Number(this.isMedical)]
        if(val !== undefined) return val.label
        return ''
    }

    get range(): number {
        return this.dateTo - this.dateFrom
    }

    get rangeDays(): number {
        return Math.round(this.range / 1000 / 60 /60 / 24)
    }

    get vacationStatusText(){
        if(this.isCurrentlyActive()) return 'Активен'
        else if(this.isPast()) return 'Прошедший'
        else return 'Будущий'
    }

    public isCurrentlyActive() {
        const now = Date.now()
        return this.dateFrom < now && this.dateTo > now
    }
    public isPast(){
        return this.dateTo < Date.now()
    }
    public isFuture(){
        return this.dateFrom > Date.now()
    }

    protected getModel(): IVacation {
        return {
            dateFrom : this.dateFrom,
            dateTo   : this.dateTo,
            isMedical: this.isMedical,
            userId   : this.userId,
            id       : this.id
        }
    }

    async saveModel(): Promise<TResult> {
        const modelSaveRes = await super.saveModel()
        if(!modelSaveRes.error) {
            this.id = modelSaveRes.res.id
            return { error: false, res: this.$um.company.addNewEmployeeVacation(this) }
        }
        return { error: true, errorMessage: UNKNOWN_ERROR }
    }

    async delete(): Promise<boolean> {
        if(await super.delete(this.id)) {
            return this.$um.company.deleteVacation(this)
        }
        return false
    }
}
