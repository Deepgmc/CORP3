import type { dealCreationStep, IDeal } from "@/interfaces/ProductsDeals";
import Manager from "./Manager";

export class Deal extends Manager implements IDeal {

    dealId           ?: number
    partnerId        ?: number
    partnerCompanyId ?: number = 0
    reg_date         ?: number
    shipment_date    ?: number
    discount          : number = 0

    readonly steps: dealCreationStep[] = [
        {
            id       : 'partnerSelection',
            order    : 1,
            label    : 'Выбор контрагента',
            isSuccess: false,
        },
        {
            id       : 'productSelection',
            order    : 2,
            label    : 'Выбор товара',
            isSuccess: false
        },
    ]

    //readonly creationSteps: Set<dealCreationStep> = new Set<dealCreationStep>(this.stepsRaw)

    //ищем щаг по порядковому номеру или id
    public getStep(id: string): dealCreationStep | undefined
    public getStep(order: number): dealCreationStep | undefined
    public getStep(type: number | string): dealCreationStep | undefined {
        let foundStep: dealCreationStep | undefined = undefined
        this.steps.forEach((step: dealCreationStep) => {
            if(typeof type === 'number'){
                if(step.order === type) {
                    foundStep = step
                    return
                }
            } else if(typeof type === 'string'){
                if(step.id === type) {
                    foundStep = step
                    return
                }
            } else { throw TypeError('Unhandled') }
        })
        return foundStep || this.steps[0]
    }

    //компания инициатор сделки (текущий пользователь)
    readonly ownerId         : number
    readonly ownerCompanyId  : number

    constructor(ownerId: number, ownerCompanyId: number) {
        super()
        this.ownerId = ownerId
        this.ownerCompanyId = ownerCompanyId
    }

    resetPartnerCompany(){
        const partnerStep = this.getStep('partnerSelection')
        if(partnerStep) {
            this.partnerCompanyId = 0
            this.partnerId = 0
            partnerStep.isSuccess = false
        }
    }

    setPartnerSelectedSuccess(){
        const partnerStep = this.getStep('partnerSelection')
        if(partnerStep) {
            partnerStep.isSuccess = true
        }
    }
}
