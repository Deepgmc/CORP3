import { ICompanyEntity } from 'src/interfaces/ICompany';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


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
}