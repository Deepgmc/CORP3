import { ICompanyEntity } from 'src/interfaces/ICompany';
import { UsersEntity } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DepartmentEntity } from './departments.entity';


@Entity('company')
export class CompanyEntity implements ICompanyEntity {

    @PrimaryGeneratedColumn('increment', {
        comment: 'Company autoincrement id'
    })
    readonly id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column({
        type: 'integer',
        default: 0
    })
    accountBalance: number;

    //! ##############   RELATIONS

    @OneToMany(() => UsersEntity, user => user.companyId)
    users: UsersEntity[]

    @OneToMany(() => DepartmentEntity, dep => dep.companyId)
    departments: DepartmentEntity[]
}