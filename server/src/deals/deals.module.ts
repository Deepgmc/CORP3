import { Module } from '@nestjs/common';
import { DealsController } from './deals.controller';
import { DealsEntity } from './entities/deals.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealsService } from './deals.service';

@Module({
    controllers: [DealsController],
    providers: [DealsService],
    imports: [
        TypeOrmModule.forFeature([
            DealsEntity,
        ]),
    ],
})
export class DealsModule { }
