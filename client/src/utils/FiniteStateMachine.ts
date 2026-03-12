import logParameter from "@/decorators/logFSMStates";
import Manager from "../entities/Manager";
import type { employeeStateNames } from "@/entities/Employee";

export class FiniteStateMachine extends Manager {
    public state: TState
    protected transitions: ITransition

    constructor(
        initState  : TState,
        transitions: ITransition,
    ) {
        super()
        this.state = initState
        this.transitions = transitions

        this.changeStateTo(initState).dispatch('initState', true) //initialize state
    }

    @logParameter
    dispatch (actionName: string, isInitialization = false) {
        const thisActions = this.transitions[this.state.name]
        if(typeof thisActions === 'undefined' || typeof thisActions[actionName] === 'undefined'){
            return
        }
        thisActions[actionName].call(this, isInitialization)

    }

    @logParameter
    changeStateTo(newState: TState) {
        this.state = newState
        return this
    }
};


export interface ITransition {
    [key: string]: {
        [key: string]: (isInitialization: boolean) => any
    }
}

export type TState = {
    name    : string,
    label   : string,
    isActive: (...args: any[]) => boolean,
    icon    : string,
    color   : string,
    transitions: TStateTransition[]
}

export type TStateTransition = {
    name  : employeeStateNames,
    action: string,
}
