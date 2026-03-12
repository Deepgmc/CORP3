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
    dateFrom: number;

    @Column({
        type: 'bigint',
    })
    dateTo: number;

    @Column({
        default: false,
        type: Boolean
    })
    isMedical: boolean;

    //! ##############   RELATIONS

    @ManyToOne(() => UsersEntity, (user) => user.vacations)
    @JoinColumn({
        name: 'vacationUserId',
        referencedColumnName: 'userId'
    })
    user: UsersEntity
}