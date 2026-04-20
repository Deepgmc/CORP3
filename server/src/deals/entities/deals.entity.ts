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
    ownerCompanyId: number;

    @Column()
    partnerId: number;
    @Column()
    partnerCompanyId: number;

    @Column({//регистрация сделки
        type: 'bigint',
    })
    reg_date: number;

    @Column({//дата отгрузки
        type: 'bigint',
    })
    shipment_date: number;

    @Column()
    discount: number;

    //! ##############   RELATIONS

    @ManyToOne(() => UsersEntity, { cascade: true })
    @JoinColumn({
        name: 'ownerId',
        referencedColumnName: 'userId'
    })
    owner: UsersEntity;

    @ManyToOne(() => UsersEntity, { cascade: true })
    @JoinColumn({
        name: 'partnerId',
        referencedColumnName: 'userId'
    })
    partner: UsersEntity;

    @ManyToOne(() => CompanyEntity, { cascade: true })
    @JoinColumn({
        name: 'ownerCompanyId',
        referencedColumnName: 'id'
    })
    ownerCompany: CompanyEntity;

    @ManyToOne(() => CompanyEntity, { cascade: true })
    @JoinColumn({
        name: 'partnerCompanyId',
        referencedColumnName: 'id'
    })
    partnerCompany: CompanyEntity;
}