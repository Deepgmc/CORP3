import { Body, Controller, Get, Post, UseGuards, UsePipes, Request } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PasswordValidationPipe } from '../pipes/password.pipe';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

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
        console.log('createUserDto:', createUserDto)
        await this.authService.registerNewUser(createUserDto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('check_token')
    checkAuth() {
        console.log('Check_token after guards')
        return { logined: true }
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
        return this.authService.loginJwt(req.user)
    }
}
