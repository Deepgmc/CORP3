import { CompanyEntity } from 'src/company/entities/company.entity';
import { SkillsEntity } from './skills.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { DepartmentEntity } from 'src/company/entities/departments.entity';


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

    @Column({
        type: 'bigint',
    })
    birth: number;

    @Column({
        type: 'bigint',
    })
    reg_date: number;

    @Column()
    companyId: number;

    @Column({ default: false })
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

    //! ##############   RELATIONS

    @ManyToOne(() => CompanyEntity, { cascade: true })
    @JoinColumn({ name: 'companyId' })
    company: CompanyEntity;

    @OneToMany(() => SkillsEntity, (skills) => skills.user)
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'skillUserId'
    })
    skills: SkillsEntity[];

    @ManyToOne(() => DepartmentEntity)
    @JoinColumn({
        name: 'departmentId',
        referencedColumnName: 'id'
    })
    department: DepartmentEntity;
}