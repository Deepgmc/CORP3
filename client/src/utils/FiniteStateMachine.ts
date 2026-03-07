import logParameter from "@/decorators/logFSMStates";
import Manager from "../entities/Manager";

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

        this.changeStateTo(initState).dispatch('initState')
    }

    @logParameter
    dispatch (actionName: string) {
        const thisActions = this.transitions[this.state.name]
        if(typeof thisActions === 'undefined' || typeof thisActions[actionName] === 'undefined'){
            return
        }
        thisActions[actionName].call(this)

    }

    @logParameter
    changeStateTo(newState: TState) {
        this.state = newState
        return this
    }
};


export interface ITransition {
    [key: string]: {
        [key: string]: () => any
    }
}

export type TState = {
    name: string,
    isActive: (...args: any[]) => boolean
}
