import { IsNotEmpty, IsNumber } from 'class-validator'
import { IVacationCreateDTO } from '../../interfaces/IUser'
import { dtoValidationMessageHandler } from '../../validation/dtoMsgHandler'
import { ApiProperty } from '@nestjs/swagger'

const dtoMsg = new dtoValidationMessageHandler('User')

export class CreateVacationDTO implements IVacationCreateDTO {

    @IsNotEmpty({message: dtoMsg.getMessage('notempty')})
    @IsNumber()
    dateFrom: number

    @IsNotEmpty({message: dtoMsg.getMessage('notempty')})
    @IsNumber()
    dateTo: number

    @ApiProperty({
        description: 'Тип отпуска',
        required   : true,
        type       : Boolean
    })
    isMedical         : boolean

     @ApiProperty({
        description: 'Idпользователя',
        required   : true,
        type       : Number
    })
    @IsNotEmpty({message: dtoMsg.getMessage('notempty')})
    @IsNumber()
    userId: number

    constructor() {}

}