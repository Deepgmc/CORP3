import { Body, Controller, Get, Logger, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserId } from './userId.decorator'
import { IUser } from 'src/interfaces/IUser';
import { AuthGuard } from '@nestjs/passport';
import { UpdateResult } from 'typeorm';
import { CreateVacationDTO } from './dto/create-vacation.dto';

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
    ): Promise<UpdateResult | boolean> {
        return await this.usersService.saveOneUserField(savingData.data)
    }

    @Get('get_employee_avatar/:userId')
    async getEmployeeData(
        @Param('userId') userId: number
    ) {
        let avatar = ''
        try {
            avatar = this.usersService.getUserAvatar(userId)
        } catch {
            console.log('Ошибка чтения файла аватара userId:', userId)
        }
        return {avatar: avatar}
    }

    //меняем должность юзера
    @UseGuards(AuthGuard('jwt'))
    @Patch('change_user_position')
    async changeUserPosition (
        @Body() savingData: {
            userId       : string,
            newPositionId: string
        }
    ): Promise<UpdateResult | boolean> {
        return await this.usersService.changeUserPosition(savingData)
    }

    //нанимаем сотрудника
    @UseGuards(AuthGuard('jwt'))
    @Patch('hire_employee')
    async hireEmployee (
        @Body() user: {userId: string}
    ): Promise<UpdateResult | boolean> {
        return await this.usersService.hireEmployee(user.userId)
    }

    //увольняем сотрудника
    @UseGuards(AuthGuard('jwt'))
    @Patch('fire_employee')
    async fireEmployee (
        @Body() user: {userId: string}
    ): Promise<UpdateResult | boolean> {
        return await this.usersService.fireEmployee(user.userId)
    }

    //сохраняем отпуск
    @Post('vacation/save_model')
    async vacationSaveModel (
        @Body() vacationDTO: CreateVacationDTO
    ): Promise<CreateVacationDTO | boolean> {
        return await this.usersService.saveNewVacation(vacationDTO)
    }
}