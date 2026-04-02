import { Body, Controller, Delete, Get, Logger, Param, Post } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { DeleteResult } from 'typeorm';

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

    //сохраняем отпуск
    @Post('products/save_model')
    async vacationSaveModel (
        @Body() vacationDTO: CreateWarehouseDto
    ): Promise<CreateWarehouseDto | boolean> {
        return await this.warehouseService.saveNewProduct(vacationDTO)
    }

    //удаляем отпуск
    @Delete('products/delete/:id')
    async vacationDelete (
        @Param('id') id: number
    ): Promise<DeleteResult> {
        return await this.warehouseService.deleteProduct(id)
    }
}
