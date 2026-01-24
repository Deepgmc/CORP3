import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/user.entity'
import { SkillsEntity } from './entities/skills.entity';

@Module({
    controllers: [UsersController],
    providers: [
        UsersService,
    ],
    imports: [
        TypeOrmModule.forFeature([
            UsersEntity,
            SkillsEntity
        ]),
    ],
    exports: [UsersService],
})
export class UsersModule {}