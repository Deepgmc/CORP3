import { WarehouseEntity } from "src/warehouse/entities/warehouse.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('dealsProducts')
export class DealsEntity {

    @PrimaryGeneratedColumn('increment', {
        comment: 'DP autoincrement id'
    })
    readonly dpId: number;

    @Column()
    productId: number;

    @Column()
    dealId: number;

    //! ##############   RELATIONS

    @ManyToOne(() => DealsEntity, { cascade: true })
    @JoinColumn({
        name: 'dealId',
        referencedColumnName: 'dealId'
    })
    deal: DealsEntity;

    @ManyToOne(() => WarehouseEntity, { cascade: true })
    @JoinColumn({
        name: 'productId',
        referencedColumnName: 'id'
    })
    product: WarehouseEntity;
}