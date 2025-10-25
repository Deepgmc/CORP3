import { IsString, IsNotEmpty, IsPositive, Length, IsEmail, IsOptional } from 'class-validator'

import { IUsersCreateDTO } from '../../interfaces/IUser'
import { dtoValidationMessageHandler } from '../../validation/dtoMsgHandler'
import { ApiProperty } from '@nestjs/swagger'

const dtoMsg = new dtoValidationMessageHandler('User')

/**
 * Game users DTO. Used during registration
 */
export class CreateUserDto implements IUsersCreateDTO {

    //used by app.useGlobalPipes(new ValidationPipe({
    // validators:
    // https://github.com/typestack/class-validator?tab=readme-ov-file#validation-messages
    /**
    @IsOptional()
    @IsPositive()
    @Max(1000)
    @IsInt()
    @IsEmail()
    @IsNumberString()
    @IsNotEmpty()
    @IsString()
    @Length(10, 20)
    @IsDate()
     */

    @ApiProperty({
        description: 'Имя пользователя',
        required: true,
        type: String
    })
    @IsNotEmpty({message: dtoMsg.getMessage('notempty')})
    @IsString({message: dtoMsg.getMessage('string')})
    @Length(2, 20, {message: dtoMsg.getMessage('length')})
    username: string

    @ApiProperty({
        description: 'Почта пользователя',
        required: true,
        type: String
    })
    @IsString()
    @IsEmail({ignore_max_length: true}, {message: dtoMsg.getMessage('email')})
    email: string

    @IsPositive({message: dtoMsg.getMessage('positive')})
    @IsString({message: dtoMsg.getMessage('string')})
    birth: string

    @IsString({message: dtoMsg.getMessage('string')})
    @Length(3, 25, {message: dtoMsg.getMessage('length')})
    password: string

    // @IsString({message: ''})
    // passwordConfirm: string

    @IsOptional()
    reg_date: Date

    constructor() {}

}