import { Injectable } from '@nestjs/common';
import { CompanyEntity } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCompanyDTO } from './dto/update-company.dto';
import { DepartmentEntity } from './entities/departments.entity';
import { UsersEntity } from 'src/users/entities/user.entity';
import { IAddDepartment } from 'src/interfaces/ICompany';

@Injectable()
export class CompanyService {

    constructor(
        @InjectRepository(CompanyEntity)//тут под капотом делается const userRepository = MyDataSource.getRepository(User)
        private companyRepository: Repository<CompanyEntity>,

        @InjectRepository(UsersEntity)
        private usersRepository: Repository<UsersEntity>,

        @InjectRepository(DepartmentEntity)
        private deptRepository: Repository<DepartmentEntity>,
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

    async getFullDepartmentsList(companyId: number): Promise<DepartmentEntity[] | boolean> {
        if(!Number.isInteger(companyId)) throw new TypeError('Wrong company id')
        return this.deptRepository.find({where: {companyId: companyId}})
    }

    async getFullEmployeesList(companyId: number): Promise<UsersEntity[] | boolean> {
        if(!Number.isInteger(companyId)) throw new TypeError('Wrong company id')
        return this.usersRepository.find({where: {companyId: companyId}})
    }

    async addNewCompanyDepartment(newDepartment: IAddDepartment): Promise<number | boolean> {
        const newDept = this.deptRepository.create(newDepartment)
        const res = await this.deptRepository.insert(newDept)
        if(!res) throw new Error('Add department error')
        return res.raw.insertId
    }
}
