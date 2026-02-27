import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UsersEntity } from './user.entity';


@Entity('positions')
export class PositionsEntity {
    @PrimaryGeneratedColumn('increment', { //uuid для генерации большого ключа
        comment: 'Position autoincrement id'
    })
    readonly id: number;

    @Column()
    position: string;

    //! ##############   RELATIONS

    @OneToMany(() => UsersEntity, (users) => users.department)
    @JoinColumn({
        name: 'id',
        referencedColumnName: 'positionId'
    })
    users: UsersEntity[]
}