import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CompanyEntity } from './company.entity';
import { UsersEntity } from 'src/users/entities/user.entity';


@Entity('department')
export class DepartmentEntity {
    @PrimaryGeneratedColumn('increment', { //uuid для генерации большого ключа
        comment: 'Department autoincrement id'
    })
    readonly id: number;

    @Column()
    companyId: number;

    @Column()
    name: string;

    @Column()
    description: string;

    //! ##############   RELATIONS

    @ManyToOne(() => CompanyEntity, { cascade: true })
    @JoinColumn({
        name: 'companyId',
        referencedColumnName: 'companyId'
    })
    company: CompanyEntity;

    @OneToMany(() => UsersEntity, (users) => users.department)
    @JoinColumn({
        name: 'id',
        referencedColumnName: 'departmentId'
    })
    users: UsersEntity[]
}