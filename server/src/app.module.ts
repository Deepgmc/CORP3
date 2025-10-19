import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import dbConfiguration from './config/db.config';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundExceptionFilter } from './HttpException.filter';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => (Object.assign({...configService.get('database')}, {autoLoadEntities: true})),
    }),
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
      load: [dbConfiguration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../client/dist'),
      serveRoot: '/',
      //exclude: ['/api*']
    }),
    AuthModule,
    UsersModule,
  ],

  controllers: [AppController],
  providers: [
    {
        provide: APP_FILTER,
        useClass: NotFoundExceptionFilter
    }
  ],
})
export class AppModule {}
