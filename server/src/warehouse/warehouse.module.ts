import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { WarehouseEntity } from './entities/warehouse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    controllers: [WarehouseController],
    providers: [WarehouseService],
    imports: [
        TypeOrmModule.forFeature([
            WarehouseEntity,
        ]),
    ],
})
export class WarehouseModule { }
