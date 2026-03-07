export default function logParameter(
    callerClass: any,
    methodName: string,
    descriptor: PropertyDescriptor
) {
    const original = descriptor.value
    descriptor.value = function (...args: any[]) {
        if(true){
            if(methodName === 'dispatch'){
                console.log(`Dispatching action: "${args[0]}" at state "${this.state.name}"`)
                const thisActions = this.transitions[this.state.name]
                if(typeof thisActions === 'undefined' || typeof thisActions[args[0]] === 'undefined'){
                    console.log(`%c!!! Not found transition: "${args[0]}" at state "${this.state.name}"`, 'background:rgb(94, 146, 34); color: #bada55; padding: 2px;')
                    return
                }
            } else if(methodName === 'changeStateTo'){
                console.log(`Change state from "${this.state.name}" to "${args[0].name}"`)
            }
        }
        return original.apply(this, [...args])
    }
}
