import Manager from "./Manager";

export class FiniteStateMachine extends Manager {

    state = 'init'
    transitions: ITransition
    allStates  : string[]

    constructor(
        initState  : string,
        transitions: ITransition,
        allStates  : string[]
    ) {
        super()
        this.state = initState
        this.transitions = transitions
        this.allStates   = allStates
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
}

export interface ITransition {
    [key: string]: {
        [key: string]: () => any
    }
}
