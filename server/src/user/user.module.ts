import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';

import { UserController } from './user.controller';
import { AuthService } from './user.service';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from '../config/auth.config';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
    controllers: [UserController],
    providers: [
        { provide: AuthService, useClass: AuthService },
        LocalStrategy,
        JwtStrategy
    ],
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    secret: jwtConstants.secret,
                    signOptions: { expiresIn: configService.get('customVars.loginSessionKeepAlive') },
                }
            },
        }),
    ],
    exports: [
        AuthService
    ],
})
export class UserModule { }
