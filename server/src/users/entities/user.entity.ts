// import { IUser } from 'src/interfaces/IUser';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';


@Entity('users')
export class UsersEntity {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    birth: string;

    @CreateDateColumn({
        type: 'timestamp',
        precision: 0,
        default: () => 'CURRENT_TIMESTAMP'/* onUpdate: 'CURRENT_TIMESTAMP' */
    })
    reg_date: Date;
}