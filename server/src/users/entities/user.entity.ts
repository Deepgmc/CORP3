import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { IUser } from '../../interfaces/IUser'


@Entity('users')
export class UsersEntity implements IUser {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    birth: number;

    @Column()
    password: string;

    @CreateDateColumn({
        type: 'timestamp',
        precision: 0,
        default: () => 'CURRENT_TIMESTAMP'/* onUpdate: 'CURRENT_TIMESTAMP' */
    })
    reg_date: Date;

    /**
    Map coordinates, inventorym, map settings to player and so no
    */
    @Column({
        type: 'text'
    })
    game_settings: string;

}