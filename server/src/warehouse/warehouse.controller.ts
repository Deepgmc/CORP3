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
        const products = await this.warehouseService.getAll();
        return products;
    }

    //сохраняем товар на склад
    @Post('products/save_model')
    async vacationSaveModel (
        @Body() productDTO: CreateWarehouseDto
    ): Promise<CreateWarehouseDto | boolean> {
        return await this.warehouseService.saveNewProduct(productDTO)
    }

    //удаляем товар
    @Delete('products/delete/:id')
    async vacationDelete (
        @Param('id') id: number
    ): Promise<DeleteResult> {
        return await this.warehouseService.deleteProduct(id)
    }
}
