import { Controller, Get, Logger } from '@nestjs/common';
import { ICompany } from 'src/interfaces/ICompany';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {

  private readonly logger = new Logger('USERS SERVICE')

  constructor(
    private readonly companyService: CompanyService
  ) {}

  @Get('get_all')
  async findAll(): Promise<ICompany[]> {
    const companies = await this.companyService.findAll();
    this.logger.debug('Find all company call')
    return companies;
  }
}
