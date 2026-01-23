import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator'

import { dtoValidationMessageHandler } from '../../validation/dtoMsgHandler'

const dtoMsg = new dtoValidationMessageHandler('User')

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsNotEmpty({message: dtoMsg.getMessage('notempty')})
    @IsNumber()
    @IsPositive()
    userId: number
}
