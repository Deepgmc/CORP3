import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/user.entity'
import { SkillsEntity } from './entities/skills.entity';
import { DepartmentEntity } from 'src/company/entities/departments.entity';
import { PositionsEntity } from './entities/positions.entity';
import { VacationsEntity } from './entities/vacations.entity';

@Module({
    controllers: [UsersController],
    providers: [
        UsersService,
    ],
    imports: [
        TypeOrmModule.forFeature([
            UsersEntity,
            SkillsEntity,
            VacationsEntity,
            DepartmentEntity,
            PositionsEntity
        ]),
    ],
    exports: [UsersService],
})
export class UsersModule {}