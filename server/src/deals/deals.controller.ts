import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealsDto } from './dto/create-deals.dto';

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
        @Body() newDealDTO: CreateDealsDto
    ): Promise<any> {
        console.log('newDealDTO:', newDealDTO)

        /**
        ВАЛИДАЦИЯ СОХРАНЕНИЕ СДЕЛКИ ТУТ
        */
    }
}
