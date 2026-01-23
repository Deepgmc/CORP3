import { CompanyEntity } from 'src/company/entities/company.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';


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

  /*
    убираем пароль из обычных запросов типа findOne
    чтобы добавить - нужно юзать addSelect
  */
  @Column({select: false})
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
  companyId: number;

  @ManyToOne(() => CompanyEntity, { cascade: true })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity


  @Column({default: false})
  isDirector: boolean;

  @Column({default: false})
  gender: boolean;

  @Column({default: ''})
  bio: string;

  @Column({default: ''})
  firstName: string;

  @Column({default: ''})
  lastName: string;

  @Column({default: ''})
  phone: string;
}