import { Body, Controller, Delete, Get, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { IAddDepartment, ICompany } from 'src/interfaces/ICompany';
import { CompanyService } from './company.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCompanyDTO } from './dto/update-company.dto';
import { CompanyEntity } from './entities/company.entity';
import { DepartmentEntity } from './entities/departments.entity';
import { UsersEntity } from 'src/users/entities/user.entity';

@Controller('company')
export class CompanyController {

    private readonly logger = new Logger('USERS SERVICE')

    constructor(
        private readonly companyService: CompanyService
    ) { }

    @Get('get_all')
    async findAll(): Promise<ICompany[]> {
        const companies = await this.companyService.findAll();
        this.logger.debug('Find all company call')
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

    @Post('get_full_departmets_list')
    async getFullDepartmentsList(
        @Body() data: {companyId: number}
    ): Promise<DepartmentEntity[] | boolean> {
        return await this.companyService.getFullDepartmentsList(data.companyId)
    }

    @Get('get_departments_of_company/:companyId')
    async getCompanyDepartments(
        @Param('companyId') companyId: number
    ): Promise<DepartmentEntity[]> {
        return await this.companyService.getCompanyDepartments(Number(companyId))
    }

    @Post('get_full_employees_list')
    async getFullEmployeesList(
        @Body() data: {companyId: number}
    ): Promise<UsersEntity[] | boolean> {
        return await this.companyService.getFullEmployeesList(data.companyId)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('gv_departments')
    async saveDepartmentsOneField(
        @Body() savingData: any
    ): Promise<DepartmentEntity | boolean> {
        return await this.companyService.saveOneDepartmentsField(savingData.data)
    }
}
