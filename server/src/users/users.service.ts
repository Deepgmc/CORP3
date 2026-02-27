import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm';
import * as fs from 'node:fs'
const SaveBase64 = require('node-base64-to-image')
import { InjectRepository } from '@nestjs/typeorm'
import { UsersEntity } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto';
import { SkillsEntity } from './entities/skills.entity';
import { IUser, TSkill } from 'src/interfaces/IUser';
import { DepartmentEntity } from 'src/company/entities/departments.entity';

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
                relations: ['company', 'skills', 'department', 'position'],
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
    }){
        return await this.usersRepository.save({
            'userId': Number(savingData.itemId),
            [savingData.fieldName]: savingData.val
        })
    }

    async changeUserDepartment(savingData: {
        userId        : string,
        departmentFrom: string,
        departmentTo  : string
    }) {
        return this.saveOneUserField({
            fieldName: 'departmentId',
            itemId   : savingData.userId,
            val      : savingData.departmentTo
        })
    }
}
