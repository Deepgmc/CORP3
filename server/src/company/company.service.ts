import { Injectable } from '@nestjs/common';
import { CompanyEntity } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCompanyDTO } from './dto/update-company.dto';

@Injectable()
export class CompanyService {

    constructor(
        @InjectRepository(CompanyEntity)//тут под капотом делается const userRepository = MyDataSource.getRepository(User)
        private companyRepository: Repository<CompanyEntity>,
    ) { }

    /**
    * Just all users without conditions
    * @returns users array
    */
    async findAll(): Promise<CompanyEntity[]> {
        return await this.companyRepository.find()
    }

    async saveCompanyProfile(company: UpdateCompanyDTO): Promise<CompanyEntity | boolean> {
        console.log('Saving company profile:', company)
        if (!company.companyId || company.companyId < 1) {
            throw new Error('Invalid user object')
        }
        return this.companyRepository.save(company)
    }
}
