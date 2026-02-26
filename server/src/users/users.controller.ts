import { Body, Controller, Get, Logger, Param, Post, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserId } from './userId.decorator'
import { IUser } from 'src/interfaces/IUser';
import { AuthGuard } from '@nestjs/passport';
import { UsersEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {

    private readonly logger = new Logger('USERS SERVICE')

    constructor(
        private readonly usersService: UsersService,
    ){}

    @Get()
    async findAll(): Promise<IUser[]> {
        return await this.usersService.findAll();
    }

    @Get(':id')
    //? @UserId decorator can be replaced by default ParseIntPipe
    async findOne(@UserId() id: number): Promise<IUser | null> {
        const user = await this.usersService.findOne('userId', id)
        this.logger.debug('Find one user:')
        this.logger.debug(user)
        return user
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('gv_user_field')
    async saveDepartmentsOneField(
        @Body() savingData: any
    ): Promise<UsersEntity | boolean> {
        return await this.usersService.saveOneUserField(savingData.data)
    }

    @Get('get_employee_data/:userId')
    async getEmployeeData(
        @Param('userId') userId: number
    ) {
        let avatar = ''
        try {
            avatar = this.usersService.getUserAvatar(userId)
        } catch {
            console.log('Ошибка чтения файла аватара userId:', userId)
        }
        const res = await this.usersService.findOne('userId', userId)
        return {user: res, avatar: avatar}
    }
}