import { Controller, Get, Logger } from '@nestjs/common';

//import { UsersService } from './users.service';
//import { UserId } from './userId.decorator'

@Controller('users')
export class UsersController {

    private readonly logger = new Logger('USERS SERVICE')

    constructor(
        // private readonly usersService: UsersService,
    ){}

    @Get()
    async findAll() {
        //return await this.usersService.findAll();
    }

    // @Get(':id')
    // //? @UserId decorator can be replaced by default ParseIntPipe
    // async findOne(@UserId() id: number): Promise<IUserEntity | null> {
    //     const user = await this.usersService.findOne('userId', id)
    //     this.logger.debug('Find one user:')
    //     this.logger.debug(user)
    //     return user
    // }
}