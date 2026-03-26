import { CompanyEntity } from 'src/company/entities/company.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('warehouse')
export class WarehouseEntity {

    @PrimaryGeneratedColumn('increment', {
        comment: 'Product autoincrement id'
    })
    readonly productId: number;

    @Column()
    name: string;

    @Column()
    companyId: number;

    //! ##############   RELATIONS

    @ManyToOne(() => CompanyEntity, { cascade: true })
    @JoinColumn({
        name: 'companyId',
        referencedColumnName: 'companyId'
    })
    company: CompanyEntity;
}