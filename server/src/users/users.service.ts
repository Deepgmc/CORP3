import { Injectable, NotFoundException } from '@nestjs/common'
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import * as fs from 'node:fs'
const SaveBase64 = require('node-base64-to-image')
import { InjectRepository } from '@nestjs/typeorm'
import { UsersEntity } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto';
import { SkillsEntity } from './entities/skills.entity';
import { IUser, TSavingSalary, TSkill } from 'src/interfaces/IUser';
import { DepartmentEntity } from 'src/company/entities/departments.entity';
import { PositionsEntity } from './entities/positions.entity';
import { CreateVacationDTO } from './dto/create-vacation.dto';
import { VacationsEntity } from './entities/vacations.entity';

const avatarFolderPath = '/home/deep/work/CORP3/server/avatars'

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UsersEntity)//тут под капотом делается const userRepository = MyDataSource.getRepository(User)
        private usersRepository: Repository<UsersEntity>,

        @InjectRepository(SkillsEntity)
        private skillsRepository: Repository<SkillsEntity>,

        @InjectRepository(DepartmentEntity)
        private deptRepository: Repository<DepartmentEntity>,

        @InjectRepository(PositionsEntity)
        private deptPositions: Repository<PositionsEntity>,

        @InjectRepository(VacationsEntity)
        private vacationsRepository: Repository<VacationsEntity>,
    ) { }

    async getFullUserData(field: string, value: string | number): Promise<any> {
        return await this.findOne('userId', value)
    }

    getUserAvatar(userId: IUser['userId']): string {
        if(!userId) return ''
        const imgPath = `${avatarFolderPath}/${userId}/avatar.jpeg`
        if(fs.existsSync(imgPath)){
            const img = fs.readFileSync(imgPath)
            return 'data:image/png;base64,' + Buffer.from(img).toString('base64')
        }
        return ''
    }

    saveAvatar(updateUserDto: UpdateUserDto) {
        const imgPath = `${avatarFolderPath}/${updateUserDto.userId}`
        const imgName = 'avatar.jpeg'
        try {
            if(!fs.existsSync(imgPath)){
                fs.mkdirSync(imgPath)
            }
            SaveBase64(updateUserDto.avatar, `${imgPath}/${imgName}`, 'png')
        } catch (e) {
            console.log('Error saving avatar:', e)
        }

        delete updateUserDto.avatar
        return updateUserDto
    }

    async create(createUserDto: CreateUserDto): Promise<CreateUserDto | boolean> {
        if (
            //check if already have such login/email
            await this.usersRepository.existsBy([{ 'username': createUserDto.username }, { 'email': createUserDto.email }])
        ) {
            return false
        }
        createUserDto.reg_date = Date.now() // единственное место, где дата регистрации выставляется
        return await this.usersRepository.save(createUserDto)
    }

    /**
     *  !!! UNSAFE !!!
     * Searches the unique user with the unique id or login or email
     * @param field userId, username, email
     * @param value id or string
     * @returns
     */
    async findOneWithPassword(field: string, value: string | number): Promise<UsersEntity | null> {
        try {
            return await this.usersRepository.findOne({
                select: ['userId', 'username', 'password'],
                where: {
                    [field]: value
                },
            })
        } catch (e) {
            console.log('ERR:', e)
            throw new NotFoundException()
        }
    }

    /**
     * Searches the unique user with the unique id or login or email
     * @param field userId, username, email
     * @param value id or string
     * @returns
     */
    async findOne(field: string, value: string | number): Promise<UsersEntity | null> {
        try {
            const searchObject = {
                where: { [field]: value },
                relations: ['company', 'skills', 'department', 'position', 'vacations'],
            }
            return await this.usersRepository.findOne(searchObject)
        } catch (e) {
            console.log('users.service findOne error:', e)
            return null
        }
    }

    /**
     *   !!! UNSAFE !!!
     * Just all users without conditions
     * @returns IUser[]
     */
    async findAll(): Promise<UsersEntity[]> {
        return await this.usersRepository.find()
    }

    /**
     * Сохраняем профиль юзера из /profile
     * @param user UpdateUserDTO
     */
    async saveProfileData(user: UpdateUserDto) {
        if (!user.userId || user.userId < 1) {
            throw new Error('Invalid user object')
        }
        await this.usersRepository.save(user)
    }

    async removeUserSkill(skillId: TSkill['id']) {
        if(!Number.isInteger(skillId)) throw new TypeError('Wrong skill id')
        return this.skillsRepository.delete(skillId)
    }

    async addUserSkill(skillText: string, userId: TSkill['skillUserId']) {
        if(!Number.isInteger(userId)) throw new TypeError('Wrong user id')
        const newSkill = this.skillsRepository.create({
            skillUserId: userId,
            skill: skillText,
        })
        const res = await this.skillsRepository.insert(newSkill)
        if(!res) throw new Error('Add user skill error')
        return res.raw.insertId
    }

    //редактируем одно поле юзера
    async saveOneUserField(savingData : {
        fieldName: string,
        itemId   : string,
        val      : string
    }): Promise<UpdateResult> {
        const id = parseInt(savingData.itemId)
        if(!Number.isInteger(id)){
            throw new TypeError('Id не число')
        }
        const res = await this.usersRepository.update(
            {
                userId: id
            }, {
                [savingData.fieldName]: savingData.val
            }
        )
        return res
    }

    async changeUserDepartment(savingData: {
        userId        : string,
        departmentFrom: string,
        departmentTo  : string
    }) {
        return await this.saveOneUserField({
            fieldName: 'departmentId',
            itemId   : savingData.userId,
            val      : savingData.departmentTo
        })
    }

    async changeUserPosition(savingData: {
        userId       : string,
        newPositionId: string
    }) {
        return await this.saveOneUserField({
            fieldName: 'positionId',
            itemId   : savingData.userId,
            val      : savingData.newPositionId
        })
    }

    async hireEmployee(userId: string) {
        const res = await this.saveOneUserField({
            fieldName: 'hire_date',
            itemId   : userId,
            val      : String(Date.now())
        })
        if(res.affected === undefined || res.affected < 1){
            throw new Error('Статус найма на работу не был обновлён')
        }
        return await this.saveOneUserField({
            fieldName: 'fire_date',
            itemId   : userId,
            val      : '0'
        })
    }

    async fireEmployee(userId: string) {
        const res = await this.saveOneUserField({
            fieldName: 'fire_date',
            itemId   : userId,
            val      : String(Date.now())
        })
        if(res.affected === undefined || res.affected < 1){
            throw new Error('Статус увольнения не был обновлён')
        }
        return await this.saveOneUserField({
            fieldName: 'hire_date',
            itemId   : userId,
            val      : '0'
        })
    }

    async saveNewVacation(newVacation: CreateVacationDTO): Promise<CreateVacationDTO> {
        return await this.vacationsRepository.save(newVacation)
    }

    async deleteVacation(id: number): Promise<DeleteResult> {
        const parsedId = Number(id)
        if(!Number.isInteger(parsedId)) throw new TypeError('Неверно передан id')
        return await this.vacationsRepository.delete({id: parsedId})
    }

    async setNewEmployeeSalary(savingData: TSavingSalary) {
        return await this.saveOneUserField({
            fieldName: 'salaryAmount',
            itemId   : savingData.userId,
            val      : savingData.salary
        })
    }
}
