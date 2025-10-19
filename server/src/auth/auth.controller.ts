import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PasswordValidationPipe } from '../pipes/password.pipe';
// import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    //constructor(private readonly authService: AuthService) { }
    constructor() { }

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
        const date = new Date(); console.log('Register POST request accepted', `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`)
        console.log('createUserDto:', createUserDto)
        //await this.authService.registerNewUser(createUserDto)
    }

    //@UseGuards(AuthGuard('jwt'))
    // @Get('check_token')
    // checkAuth() {
    //     return {logined: true}
    // }

    //@UseGuards(AuthGuard('local'))
    // @Post('login')
    // login(@Request() req) {
    //     /**
    //     Адрес login - принимает в посте логин и пароль, юзает гвард LocalAuthGuard
    //     (который наследован от пасспорт-гварда AuthGuard('local'), который тягает local-auth.guard.ts)
    //     Он в свою очередь ищет юзера, проверяет логин пароль и возвращает в паспорт юзера
    //     А тот уже в конце запихивает этот объект юзера в реквест и делает еще всякую магию, наверное
    //     */
    //     return this.authService.loginJwt(req.user)
    // }
}
