import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './entities/company.entity'
import { DepartmentEntity } from './entities/departments.entity';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [
    TypeOrmModule.forFeature([
        CompanyEntity,
        DepartmentEntity
    ]),
  ],
  exports: [ CompanyService ]
})
export class CompanyModule {}
