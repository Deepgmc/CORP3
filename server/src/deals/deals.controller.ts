import { Controller, Get, Logger } from '@nestjs/common';
import { DealsService } from './deals.service';

@Controller('deals')
export class DealsController {

    private readonly logger = new Logger('Deals controller:')

    constructor (
        private readonly dealsService: DealsService,
    ) { }

    @Get('get_all')
    async findAll(): Promise<any> {
        const deals = await this.dealsService.findAll();
        this.logger.debug('find all deals')
        return deals;
    }
}
