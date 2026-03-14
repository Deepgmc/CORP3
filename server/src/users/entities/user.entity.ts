import { CompanyEntity } from 'src/company/entities/company.entity';
import { SkillsEntity } from './skills.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { DepartmentEntity } from 'src/company/entities/departments.entity';
import { PositionsEntity } from './positions.entity';
import { VacationsEntity } from './vacations.entity';


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
    @Column({ select: false })
    password: string;

    @Column({//д.р.
        type: 'bigint',
        default: 0,
    })
    birth: number;

    @Column({//регистрация в системе
        type: 'bigint',
    })
    reg_date: number;

    @Column({//приём на работу
        type: 'bigint',
        default: 0,
    })
    hire_date: number;

    @Column({//увольнение
        type: 'bigint',
        default: 0,
    })
    fire_date: number;

    @Column()
    companyId: number;

    @Column({
        default: false
    })
    isDirector: boolean;

    @Column({
        type: 'tinyint',
        default: 1
    })
    gender: number;

    @Column({
        type: 'text'
    })
    bio: string;

    @Column({ default: '' })
    firstName: string;

    @Column({ default: '' })
    lastName: string;

    @Column({ default: '' })
    phone: string;

    @Column({
        type: 'integer',
        default: null
    })
    departmentId: number;

    @Column({
        type: 'integer',
        default: null
    })
    positionId: number;

//! #################################   RELATIONS

    @ManyToOne(() => CompanyEntity, { cascade: true })
    @JoinColumn({ name: 'companyId' })
    company: CompanyEntity;
//################################################################
    @OneToMany(() => SkillsEntity, (skills) => skills.user)
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'skillUserId'
    })
    skills: SkillsEntity[];
//################################################################
    @OneToMany(() => VacationsEntity, (vacations) => vacations.user)
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'vacationUserId'
    })
    vacations: VacationsEntity[];
//################################################################
    @ManyToOne(() => DepartmentEntity)
    @JoinColumn({
        name: 'departmentId',
        referencedColumnName: 'id'
    })
    department: DepartmentEntity;
//################################################################
    @ManyToOne(() => PositionsEntity)
    @JoinColumn({
        name: 'positionId',
        referencedColumnName: 'id'
    })
    position: PositionsEntity;
//################################################################
}