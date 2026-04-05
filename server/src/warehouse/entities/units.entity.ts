
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('units')
export class UnitsEntity {

    @PrimaryGeneratedColumn('increment', {
        comment: 'Units autoincrement id'
    })
    readonly id: number;

    @Column()
    name: string;

    @Column()
    nameCouple: string;

    @Column()
    shortName: string;

}