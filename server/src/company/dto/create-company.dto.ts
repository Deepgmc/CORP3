import { IsString, IsNotEmpty, Length } from 'class-validator'

import { ICompany } from '../../interfaces/ICompany'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCompanyDto implements ICompany {

    @ApiProperty({
        description: 'ID компании',
        required: true,
        type: Number
    })
    @IsNotEmpty()
    companyId: number

    @ApiProperty({
        description: 'Название компании',
        required: true,
        type: String
    })
    @IsNotEmpty({message: 'Не пустое название'})
    @IsString({message: 'Название - строка'})
    @Length(2, 40, {message: 'Неверная длина названия'})
    name: string

    @ApiProperty({
        description: 'Адрес компании',
        required: true,
        type: String
    })
    @IsNotEmpty({message: 'Не пустое'})
    @IsString({message: 'Строка'})
    @Length(2, 70, {message: 'Неверная длина адреса'})
    address: string

    constructor() {}

}