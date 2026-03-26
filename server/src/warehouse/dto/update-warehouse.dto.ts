import { PartialType } from '@nestjs/mapped-types'
import { CreateWarehouseDto } from './create-warehouse.dto'

export class UpdateWarehouseDTO extends PartialType(CreateWarehouseDto) {}
