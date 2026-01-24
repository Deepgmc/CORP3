import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { ICompany } from 'src/interfaces/ICompany';
import { CompanyService } from './company.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCompanyDTO } from './dto/update-company.dto';
import { CompanyEntity } from './entities/company.entity';

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
}
