import { CompanyEntity } from 'src/company/entities/company.entity';
import { UsersEntity } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('deals')
export class DealsEntity {

    @PrimaryGeneratedColumn('increment', {
        comment: 'Product autoincrement id'
    })
    readonly dealId: number;

    @Column()
    ownerId: number;

    @Column()
    partnerCompanyId: number;

    //! ##############   RELATIONS

    @ManyToOne(() => UsersEntity, { cascade: true })
    @JoinColumn({
        name: 'ownerId',
        referencedColumnName: 'userId'
    })
    owner: UsersEntity;

    @ManyToOne(() => CompanyEntity, { cascade: true })
    @JoinColumn({
        name: 'partnerCompanyId',
        referencedColumnName: 'companyId'
    })
    partner: CompanyEntity;
}