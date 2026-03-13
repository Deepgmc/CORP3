import type { IVacation, TMedicalLabel, TUserId } from "@/interfaces/User";
import { labelVacationIsMedical } from "@/utils/constants/main";

export class Vacation implements IVacation {
    public readonly id!       : number
    public readonly dateFrom! : number
    public readonly dateTo   !: number
    public readonly isMedical!: boolean
    public readonly userId   !: TUserId

    constructor(rawVacation: IVacation) {
        Object.assign(this, rawVacation)
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

    get vacationStatus(){
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
}
