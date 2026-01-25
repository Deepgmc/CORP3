import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from './user.entity';


@Entity('skills')
export class SkillsEntity {
    @PrimaryGeneratedColumn('increment', { //uuid для генерации большого ключа
        comment: 'Skill autoincrement id'
    })
    readonly id: number;

    @Column()
    skillUserId: number;

    @Column()
    skill: string;

    //! ##############   RELATIONS

    @ManyToOne(() => UsersEntity, (user) => user.skills)
    @JoinColumn({
        name: 'skillUserId',
        referencedColumnName: 'userId'
    })
    user: UsersEntity
}