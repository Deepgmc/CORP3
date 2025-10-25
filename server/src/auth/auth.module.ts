import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from '../config/auth.config';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

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
export class AuthModule { }
