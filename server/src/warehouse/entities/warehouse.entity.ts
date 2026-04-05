import { CompanyEntity } from 'src/company/entities/company.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UnitsEntity } from './units.entity';


@Entity('warehouse')
export class WarehouseEntity {

    @PrimaryGeneratedColumn('increment', {
        comment: 'Product autoincrement id'
    })
    readonly id: number;

    @Column()
    name: string;

    @Column()
    unitId: number;//основная ед измерения товара (трубы в метрах, сахар в килограммах)

    @Column()
    companyId: number;

    @Column()
    status: string;

    @Column()
    price: number;

    @Column()
    count: number;

    //! ##############   RELATIONS

    @ManyToOne(() => CompanyEntity, { cascade: true })
    @JoinColumn({
        name: 'companyId',
        referencedColumnName: 'companyId'
    })
    company: CompanyEntity;

    @ManyToOne(() => UnitsEntity, { cascade: true })
    @JoinColumn({
        name: 'unitId',
        referencedColumnName: 'id'
    })
    unit: UnitsEntity;
}