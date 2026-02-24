import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IAddDepartment, ICompany } from 'src/interfaces/ICompany';
import { CompanyService } from './company.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCompanyDTO } from './dto/update-company.dto';
import { CompanyEntity } from './entities/company.entity';
import { DepartmentEntity } from './entities/departments.entity';
import { UsersEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { PositionsEntity } from 'src/users/entities/positions.entity';

@Controller('company')
export class CompanyController {

    private readonly logger = new Logger('USERS SERVICE')

    constructor(
        private readonly companyService: CompanyService,
        private usersService: UsersService,
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

    @Get('get_full_departmets_list/:companyId')
    async getFullDepartmentsList(
        @Param('companyId') companyId: string
    ): Promise<DepartmentEntity[] | boolean> {
        return await this.companyService.getFullDepartmentsList(companyId)
    }

    @Get('get_positions')
    async getPositions(): Promise<PositionsEntity[]> {
        return await this.companyService.getPositions()
    }

    @Get('get_full_employees_list/:companyId')
    async getFullEmployeesList(
        @Param('companyId') companyId: string
    ): Promise<UsersEntity[] | boolean> {
        return await this.companyService.getFullEmployeesList(companyId)
    }

    @Get('get_departments_of_company/:companyId')
    async getCompanyDepartments(
        @Param('companyId') companyId: number
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
    async changeUserDepartment (
        @Body() savingData: any
    ): Promise<UsersEntity | boolean> {
        const usersRes = await this.usersService.changeUserDepartment(savingData)
        return usersRes
    }
}
