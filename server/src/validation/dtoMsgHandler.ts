import { ValidationArguments } from 'class-validator';

export class dtoValidationMessageHandler {

    private validateSection: string

    args: ValidationArguments
    message: string[] = []

    constructor(validateSection: string) {
        this.validateSection = validateSection
    }

    /**
     * Forms the message while DTO model checking
     * @param type type of checking field
     * @returns string message (directly to the client)
     */
    getMessage(type: string): any {
        return (args: ValidationArguments): string => {
            this.args = args
            this.message = []

            this.message.push(args.property.replace(/^\w/, s => s.toUpperCase()))

            this.message.push(this[`${type}Message`]())

            return this.message.join(' ')
        }
    }

    lengthMessage(): string {
        return `length must be ${this.args.constraints[0]} - ${this.args.constraints[1]}`
    }
    maxMessage(): string {
        return `maximum ${this.args.constraints[0]}`
    }
    minMessage(): string {
        return `minimum ${this.args.constraints[0]}`
    }
    emailMessage(): string {
        return 'is incorrect'
    }
    positiveMessage(): string {
        return 'must be positive'
    }
    notemptyMessage(): string {
        return 'is empty'
    }
    stringMessage(): string {
        return 'is not a string'
    }
    numberMessage(): string {
        return 'is not a number'
    }
}