import { Body, Controller, Get, Post, UseGuards, UsePipes, Request } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PasswordValidationPipe } from '../pipes/password.pipe';
import { AuthService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) { }

    /**
    * Регистрация нового пользователя
    *
    * @decorator Nestjs Body
      @postParam Принимает объект CreateUserDto из поста
    * @returns Is created success
    */
    @Post('register')
    @UsePipes(PasswordValidationPipe)
    async register(
        @Body() createUserDto: CreateUserDto
    ): Promise<any> {
        await this.authService.registerNewUser(createUserDto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('check_token')
    checkAuth(
        @Request() req
    ) {
        return { error: false, logined: true, userId: req.user.userId }
    }

    /**
     * Возвращает одного юзера со всеми возможными связанными данными
     * @param req User id
     * @returns IUser
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('get_user_data')
    async getUserData(
        @Request() req
    ) {
        const res = await this.userService.getFullUserData('userId', req.user.userId)
        return res
    }

    /**
     * Изменение профиля юзера
     * @param updateUserDto UpdateUserDto
     * @returns IUser
     */
    @UseGuards(AuthGuard('jwt'))
    @Post('save_user_profile')
    async saveUserProfile(
        @Body() updateUserDto: UpdateUserDto
    ) {
        const res = await this.userService.saveProfileData(updateUserDto)
        return res
    }

    /**
     * Удаление одного навыка из списка юзера
     * @param skillId TSkill['id']
     * @returns boolean
     */
    @UseGuards(AuthGuard('jwt'))
    @Post('remove_user_skill')
    async removeUserSkill(
        @Body() req: any
    ) {
        const res = await this.userService.removeUserSkill(req.skillId)
        return res
    }

    /**
     * Добавление ноыого навыка юзеру
     * @param skillText TSkill['skill']
     * @param userId TSkill['skillUserId']
     * @returns addedSkillId: number
     */
    @UseGuards(AuthGuard('jwt'))
    @Post('add_user_skill')
    async addUserSkill(
        @Body() req: any
    ) {
        return await this.userService.addUserSkill(req.skillText, req.userId)
    }

    /**
     *
     * @param req username + password
     * @returns
     */
    @UseGuards(AuthGuard('local'))
    @Post('login')
    login(
        @Request() req
    ) {
        /**
        Адрес login - принимает в посте логин и пароль, юзает гвард LocalAuthGuard
        (который наследован от пасспорт-гварда AuthGuard('local'), который тягает local-auth.guard.ts)
        Он в свою очередь ищет юзера, проверяет логин пароль и возвращает в паспорт юзера
        А тот уже в конце запихивает этот объект юзера в реквест и делает еще всякую магию, наверное
        */
        try {
            const res = this.authService.loginJwt(req.user)
            return res
        } catch {
            return 'auth.controller login error'
        }

    }
}
