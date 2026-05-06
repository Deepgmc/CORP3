import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('deals_products')
export class Deals_productsEntity {

    @PrimaryGeneratedColumn('increment', {
        comment: 'DP autoincrement id'
    })
    readonly id: number;

    @Column()
    dealId: number;

    @Column()
    productId: number;

    @Column()
    count: number;

    //! ##############   RELATIONS

    // @ManyToOne(() => DealsEntity, { cascade: true })
    // @JoinColumn({
    //     name: 'id',
    //     referencedColumnName: 'dealId'
    // })
    // deal: DealsEntity;

    // @ManyToOne(() => WarehouseEntity, { cascade: true })
    // @JoinColumn({
    //     name: 'productId',
    //     referencedColumnName: 'id'
    // })
    // product: WarehouseEntity;
}