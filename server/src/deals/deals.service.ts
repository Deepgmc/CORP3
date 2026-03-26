import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DealsEntity } from './entities/deals.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DealsService {
    constructor(
        @InjectRepository(DealsEntity)
        private dealsRepository: Repository<DealsEntity>,
    ) { }

    async findAll(): Promise<DealsEntity[]> {
        return await this.dealsRepository.find()
    }
}
