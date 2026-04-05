import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './entities/company.entity'
import { DepartmentEntity } from './entities/departments.entity';
import { UsersEntity } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { PositionsEntity } from 'src/users/entities/positions.entity';
import { WarehouseEntity } from 'src/warehouse/entities/warehouse.entity';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import { UnitsEntity } from 'src/warehouse/entities/units.entity';
import { DealsEntity } from 'src/deals/entities/deals.entity';

@Module({
    controllers: [CompanyController],
    providers: [CompanyService],
    imports: [
        UsersModule,
        WarehouseModule,
        TypeOrmModule.forFeature([
            CompanyEntity,
            DepartmentEntity,
            UsersEntity,
            PositionsEntity,
            WarehouseEntity,
            UnitsEntity,
            DealsEntity
        ]),
    ],
    exports: [CompanyService]
})
export class CompanyModule { }
