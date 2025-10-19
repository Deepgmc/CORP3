import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import dbConfiguration from './config/db.config';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundExceptionFilter } from './HttpException.filter';
import { TestModule } from './test/test.module';

@Module({
  imports: [
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
    TestModule,
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
