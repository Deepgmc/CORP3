import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from '../config/auth.config';
import { JwtStrategy } from './jwt.strategy';
//import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
    controllers: [AuthController],
    providers: [
        { provide: AuthService, useClass: AuthService },
        LocalStrategy,
        JwtStrategy
    ],
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            //global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '6h' }
        }),
    ],
    exports: [
        AuthService
    ],
})
export class AuthModule { }
