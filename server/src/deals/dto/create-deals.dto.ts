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
    partnerCompanyId: number

    constructor() {}

}