import { Module } from '@nestjs/common';
import { DealsController } from './deals.controller';
import { DealsEntity } from './entities/deals.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealsService } from './deals.service';
import { WarehouseEntity } from 'src/warehouse/entities/warehouse.entity';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import { Deals_productsEntity } from './entities/deals_products.entity';

@Module({
    controllers: [DealsController],
    providers: [DealsService],
    imports: [
        WarehouseModule,
        TypeOrmModule.forFeature([
            DealsEntity,
            WarehouseEntity,
            Deals_productsEntity,
        ]),
    ],
    exports: [DealsService]
})
export class DealsModule { }
