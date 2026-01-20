import { Body, Controller, Get, Post, UseGuards, UsePipes, Request } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PasswordValidationPipe } from '../pipes/password.pipe';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
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
    console.log('createUserDto:', createUserDto)
    await this.authService.registerNewUser(createUserDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('check_token')
  checkAuth(
    @Request() req
  ) {
    return { error: false, logined: true, userId: req.user.userId }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get_user_data')
  async getUserData(
    @Request() req
  ) {
    const res = await this.userService.findOne('userId', req.user.userId)
    return res
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
