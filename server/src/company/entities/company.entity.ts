import { ICompanyEntity } from 'src/interfaces/ICompany';
import { UsersEntity } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';


@Entity('company')
export class CompanyEntity implements ICompanyEntity {

    @PrimaryGeneratedColumn('increment', {
        comment: 'Company autoincrement id'
    })
    readonly companyId: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @OneToMany(() => UsersEntity, user => user.companyId)
    users: UsersEntity[]
}