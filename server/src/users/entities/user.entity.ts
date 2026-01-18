import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, JoinTable } from 'typeorm';


@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn('increment', { //uuid для генерации большого ключа
    comment: 'User autoincrement id'
  })
  readonly userId: number;

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

  @Column()
  @JoinTable(
    { name: 'company', joinColumn: { name: 'companyId' } }
  )
  companyId: number;

  @Column({
    default: false
  })
  isDirector: boolean;
}