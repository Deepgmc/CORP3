import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { IUser } from '../interfaces/IUser'
import { UsersEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async registerNewUser(user: CreateUserDto): Promise<any> {
    user.password = await this.getPasswordHash(user.password)
    const creationResult = await this.usersService.create(user)
    if (!creationResult) throw new BadRequestException(['Невозможно создать с таким логином/почтой'])

    //! ПРИМЕР QueryBuilder
    // const alias = 'users'
    // const q = this.usersRepository.createQueryBuilder()
    // q.andWhere(${alias}.userId in (:...userIds), {userIds: params.userIds})


    // return await this.postRepository.createQueryBuilder("post")
    // .innerJoinAndSelect("post.images", "image")
    // .where("user_id = :userId", {userId: id})
    // .getMany();
  }

  async getPasswordHash(password: string): Promise<string> {
    return new Promise((resolve) => {
      bcrypt.hash(password, 5, function (err, hash) {
        resolve(hash)
      });
    })
  }

  async validateAndGetUser(username: string, password: string): Promise<any> {
    const user = await this.getAndCheckUser(username)
    return new Promise((resolve) => {
      bcrypt.compare(password, user.password, function (err, compareResult) {
        if (compareResult) {
          // @ts-ignore с ума сходит тс. то переменная неиспользуемая, то delete не нравится. Тут надо именно так
          delete user.password //или так - отбрасываем password: const { password, ...result } = user
          resolve(user)
        }
        resolve(null)
      });
    })
  }

  /**
     * Function for jwt passport strategy login system
     * @param user
     * @returns jwt access token
     */
  loginJwt(user: IUser) {
    const payload = {
      username    : user.username,
      sub         : user.userId,
      loginJwtData: 'auth.service.ts -> loginJwt()'
    }
    try {
      const access_token = this.jwtService.sign(payload)

      return {
        access_token: access_token,
        user: user,
        additional_data2: 'in loginJWT() at auth.service.ts'
      }
    } catch {
      return 'auth.service loginJwt error'
    }
  }

  async getAndCheckUser(username: string): Promise<UsersEntity> {
    const user = await this.usersService.findOneWithPassword('username', username)
    if (!user) throw new UnauthorizedException('Not found such user')
    return user
  }

}
