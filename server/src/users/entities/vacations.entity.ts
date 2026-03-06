import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UsersEntity } from './user.entity';


@Entity('vacations')
export class VacationsEntity {
    @PrimaryGeneratedColumn('increment', { //uuid для генерации большого ключа
        comment: 'Vacations autoincrement id'
    })
    readonly id: number;

    @Column({
        type: 'bigint',
    })
    date_from: number;

    @Column({
        type: 'bigint',
    })
    date_to: number;

    @Column({
        default: false,
        type: Boolean
    })
    ill: boolean;

    //! ##############   RELATIONS

    @ManyToOne(() => UsersEntity, (user) => user.vacations)
    @JoinColumn({
        name: 'vacationUserId',
        referencedColumnName: 'userId'
    })
    user: UsersEntity
}