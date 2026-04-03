import { IsString, IsNotEmpty, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateWarehouseDto {

    @ApiProperty({
        description: 'ID товара',
        required: true,
        type: Number
    })
    @IsNotEmpty()
    id: number

    @ApiProperty({
        description: 'Название товара',
        required: true,
        type: String
    })
    @IsNotEmpty({message: 'Не пустое название'})
    @IsString({message: 'Название - строка'})
    @Length(2, 60, {message: 'Неверная длина названия'})
    name: string

    @ApiProperty({
        description: 'Статус товара',
        required: true,
        type: String
    })
    @IsNotEmpty({message: 'Не пустое название'})
    @IsString({message: 'Название - строка'})
    @Length(1, 20, {message: 'Неверная длина названия'})
    status: string

    constructor() {}

}