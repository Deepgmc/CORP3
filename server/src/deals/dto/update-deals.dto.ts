import { PartialType } from '@nestjs/mapped-types'
import { CreateDealsDto } from './create-deals.dto'

export class UpdateWarehouseDTO extends PartialType(CreateDealsDto) {}
