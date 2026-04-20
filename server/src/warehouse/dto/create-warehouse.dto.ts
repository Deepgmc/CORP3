import { IsString, IsNotEmpty, Length, IsNumber } from 'class-validator'
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
        description: 'Компания',
        required: true,
        type: Number
    })
    @IsNotEmpty({message: 'Не пустое'})
    @IsNumber()
    companyId: number

    @ApiProperty({
        description: 'Ед. измерения товара',
        required: true,
        type: Number
    })
    @IsNotEmpty({message: 'Не пустое'})
    @IsNumber()
    unitId: number

    @ApiProperty({
        description: 'Статус товара',
        required: true,
        type: String
    })
    @IsNotEmpty({message: 'Не пустое название'})
    @IsString({message: 'Название - строка'})
    @Length(1, 20, {message: 'Неверная длина названия'})
    status: string

    @ApiProperty({
        description: 'Цена за 1 ед.',
        required: true,
        type: Number
    })
    @IsNotEmpty({message: 'Не пустое'})
    @IsNumber()
    price: number

    @ApiProperty({
        description: 'Количество',
        required: true,
        type: Number
    })
    @IsNotEmpty({message: 'Не пустое'})
    @IsNumber()
    count: number

    constructor() {}

}