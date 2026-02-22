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
        if (!company.companyId || company.companyId < 1) {
            throw new Error('Invalid user object')
        }
        return this.companyRepository.save(company)
    }

    async getFullDepartmentsList(companyId: number): Promise<DepartmentEntity[] | boolean> {
        if(!Number.isInteger(companyId)) throw new TypeError('Wrong company id')

        // сумма юзеров рабочая
        //const a = await this.deptRepository
        // .createQueryBuilder('departments')
        // .select('dept', 'users')
        // .from(DepartmentEntity, 'dept')
        // .leftJoinAndSelect('users', 'users', 'dept.id = users.departmentId')
        // .where('dept.companyId = :companyId', {companyId})
        // .getMany()



        //рабочая сумма юзеров в департаментах
        const a = await this.deptRepository
        .createQueryBuilder('d')
        .leftJoinAndSelect('d.users', 'users')
        .select('d.id', 'id')
        .addSelect('d.companyId', 'companyId')
        .addSelect('d.name', 'name')
        .addSelect('d.description', 'description')
        .addSelect('COUNT(users.userId)', 'countusers')
        .where('d.companyId = :companyId', {companyId})
        .groupBy('d.id')
        .getRawMany()
        return a

        //старый общий запрос
        //return this.deptRepository.find({where: {companyId: companyId}})
    }

    async getCompanyDepartments(companyId: number) {
        return this.deptRepository.find({where: {companyId: companyId}})
    }

    async getFullEmployeesList(companyId: number): Promise<UsersEntity[] | boolean> {
        if(!Number.isInteger(companyId)) { throw new TypeError('Wrong company id') }
        return this.usersRepository.find({
            where: {companyId: companyId},
            relations: ['skills']
        })
    }

    async addNewCompanyDepartment(newDepartment: IAddDepartment): Promise<number | boolean> {
        const newDept = this.deptRepository.create(newDepartment)
        const res = await this.deptRepository.insert(newDept)
        if(!res) throw new Error('Ошибка добавления департамента')
        return res.raw.insertId
    }

    async deleteCompanyDepartment(departmentId: number): Promise<boolean> {
        if(!Number.isInteger(departmentId)) { throw new TypeError('Wrong department id') }

        //перед удалением департамента проверить есть ли на нём юзеры. Если есть, то удалять нельзя
        const usersCount = await this.usersRepository.count({where: {departmentId}})

        if(usersCount === 0) {
            const res = await this.deptRepository.delete({id: departmentId})
            if(!res.affected) throw new Error('Ошибка удаления департамента')
            return true
        }
        return false
    }

    //редактируем одно поле департамента
    async saveOneDepartmentsField(savingData : {
        fieldName: string,
        itemId   : string,
        val      : string
    }){
        return await this.deptRepository.save({
            'id': Number(savingData.itemId),
            [savingData.fieldName]: savingData.val
        })
    }
}
