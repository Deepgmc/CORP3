import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'
import { UsersEntity } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UsersEntity)//тут под капотом делается const userRepository = MyDataSource.getRepository(User)
        private usersRepository: Repository<UsersEntity>,
    ) { }

    async getFullUserData(field: string, value: string | number): Promise<any> {
        const user = await this.findOne('userId', value)
        return user
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
       !!! UNSAFE !!!
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
                relations: ['company'],
            }
            return await this.usersRepository.findOne(searchObject)
        } catch (e) {
            console.log('ERR:', e)
            throw new NotFoundException()
        }
    }

    /**
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
        this.usersRepository.save(user)
    }
}
