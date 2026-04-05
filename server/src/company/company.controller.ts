import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCompanyDTO } from './dto/update-company.dto';
import { CompanyEntity } from './entities/company.entity';
import { DepartmentEntity } from './entities/departments.entity';
import { UsersEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { PositionsEntity } from 'src/users/entities/positions.entity';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import { IAddDepartment, ICompany } from 'src/interfaces/ICompany';
import { CompanyService } from './company.service';
import { WarehouseEntity } from 'src/warehouse/entities/warehouse.entity';
import { UnitsEntity } from 'src/warehouse/entities/units.entity';
import { DealsEntity } from 'src/deals/entities/deals.entity';

@Controller('company')
export class CompanyController {

    private readonly logger = new Logger('Company controller:')

    constructor(
        private readonly companyService: CompanyService,
        private readonly usersService: UsersService,
        private readonly warehouseService: WarehouseService,
    ) { }

    @Get('get_all')
    async findAll(): Promise<ICompany[]> {
        const companies = await this.companyService.findAll();
        return companies;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('save_company_profile')
    async saveCompanyProfile(
        @Body() updateCompanyDTO: UpdateCompanyDTO
    ): Promise<CompanyEntity | boolean> {
        return await this.companyService.saveCompanyProfile(updateCompanyDTO)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('add_new_company_department')
    async addNewCompanyDepartment(
        @Body() data: IAddDepartment
    ): Promise<number | boolean> {
        return await this.companyService.addNewCompanyDepartment(data)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('delete_company_department/:deptid')
    async deleteCompanyDepartment(
        @Param('deptid') deptid: number
    ): Promise<number | boolean> {
        return await this.companyService.deleteCompanyDepartment(Number(deptid))
    }

    @Get('get_full_departmets_list')
    async getFullDepartmentsList(
        @Query('cid') companyId: number
    ): Promise<DepartmentEntity[] | boolean> {
        return await this.companyService.getFullDepartmentsList(Number(companyId))
    }

    @Get('get_positions')
    async getPositions(
        @Query('cid') companyId: number
    ): Promise<PositionsEntity[]> {
        this.logger.warn(`Добавить ограничение на companyId в должностях ${companyId}`)
        return await this.companyService.getPositions()
    }

    @Get('get_deals')
    async getDeals(
        @Query('cid') companyId: number
    ): Promise<DealsEntity[]> {
        return await this.companyService.getAllDeals(companyId)
    }

    @Get('get_warehouse')
    async getWarehouse(
        @Query('cid') companyId: number
    ): Promise<WarehouseEntity[]> {
        return await this.warehouseService.getAllForCompany(companyId)
    }

    @Get('get_full_employees_list')
    async getFullEmployeesList(
        @Query('cid') companyId: number
    ): Promise<UsersEntity[] | boolean> {
        return await this.companyService.getFullEmployeesList(Number(companyId))
    }

    @Get('get_departments_of_company')
    async getCompanyDepartments(
        @Query('cid') companyId: number
    ): Promise<DepartmentEntity[]> {
        return await this.companyService.getCompanyDepartments(Number(companyId))
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('gv_departments')
    async saveDepartmentsOneField(
        @Body() savingData: any
    ): Promise<DepartmentEntity | boolean> {
        return await this.companyService.saveOneDepartmentsField(savingData.data)
    }

    //меняем department юзера
    @UseGuards(AuthGuard('jwt'))
    @Patch('switch_user_department_id')
    async changeUserDepartment(
        @Body() savingData: any
    ): Promise<UpdateResult | boolean> {
        return await this.usersService.changeUserDepartment(savingData)
    }



    //!DICTIONARIES
    @Get('dictionary/units')
    async getUnits(): Promise<UnitsEntity[]> {
        return await this.companyService.getFullUnits()
    }

}
