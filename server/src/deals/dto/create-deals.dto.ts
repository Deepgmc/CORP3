import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDealsDto {

    @ApiProperty({
        description: 'ID сделки',
        required: true,
        type: Number
    })
    @IsNotEmpty()
    dealId: number

    @ApiProperty({
        description: 'Владелец сделки',
        required: true,
        type: Number
    })
    @IsNotEmpty()
    @IsNumber()
    ownerId: number

    @ApiProperty({
        description: 'Компания - контрагент сделки',
        required: true,
        type: Number
    })
    @IsNotEmpty()
    @IsNumber()
    partnerId: number

    @ApiProperty({
        description: 'Дата подписания сделки',
        required   : true,
        type       : Number,
    })
    @IsNumber()
    @IsNotEmpty()
    reg_date: number

    @ApiProperty({
        description: 'Дата подписания сделки',
        required   : true,
        type       : Number,
    })
    @IsNumber()
    @IsNotEmpty()
    shipment_date: number

    @ApiProperty({
        description: 'Скидка по договорённости',
        required: false,
        type: Number,
        default: 0
    })
    @IsNumber()
    discount: number

    constructor() {}

}