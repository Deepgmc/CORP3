import { Controller, Get, Logger } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';

@Controller('warehouse')
export class WarehouseController {

    private readonly logger = new Logger('Warehouse controller:')

    constructor (
        private readonly warehouseService: WarehouseService,
    ) { }

    @Get('get_all')
    async findAll(): Promise<any> {
        const products = await this.warehouseService.findAll();
        this.logger.debug('find all products')
        return products;
    }
}
