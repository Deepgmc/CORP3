export default function logParameter(
    callerClass: any,
    methodName: string,
    descriptor: PropertyDescriptor
) {
    const original = descriptor.value
    descriptor.value = function (...args: any[]) {
        if(false){
            if(methodName === 'dispatch'){
                console.log(`Dispatching action: "${args[0]}" at state "${this.state}"`)
                const thisActions = this.transitions[this.state]
                if(typeof thisActions === 'undefined' || typeof thisActions[args[0]] === 'undefined'){
                    console.log(`%c!!! Not found transition: "${args[0]}" at state "${this.state}"`, 'background:rgb(94, 146, 34); color: #bada55; padding: 2px;')
                    return
                }
            } else if(methodName === 'changeStateTo'){
                console.log(`Change state from "${this.state}" to "${args[0]}"`)
            }
        }
        return original.apply(this, [...args])
    }
}
