import { Injectable } from '@nestjs/common';
import { CompanyEntity } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyService {

  constructor(
    @InjectRepository(CompanyEntity)//тут под капотом делается const userRepository = MyDataSource.getRepository(User)
    private usersRepository: Repository<CompanyEntity>,
  ) {}

  /**
  * Just all users without conditions
  * @returns users array
  */
  async findAll(): Promise<CompanyEntity[]> {
    return await this.usersRepository.find()
  }
}
