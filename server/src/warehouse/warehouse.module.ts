import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { WarehouseEntity } from './entities/warehouse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitsEntity } from './entities/units.entity';

@Module({
    controllers: [WarehouseController],
    providers: [WarehouseService],
    imports: [
        TypeOrmModule.forFeature([
            WarehouseEntity,
            UnitsEntity
        ]),
    ],
    exports: [WarehouseService]
})
export class WarehouseModule { }
