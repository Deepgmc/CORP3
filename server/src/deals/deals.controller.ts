import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { DealsService } from './deals.service';
import { INewDeal } from 'src/interfaces/Deal';

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

    @Post('save_deal')
    async saveDeal(
        @Body() newDeal: INewDeal,
    ): Promise<any> {
        return this.dealsService.processDeal(newDeal)
    }
}
