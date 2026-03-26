import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundExceptionFilter } from './HttpException.filter';
import dbConfiguration from './config/db.config';
import customVariables from './config/custom.config';
import { UserModule } from './user/user.module';
import { UsersModule } from './users/users.module';
import { CompanyModule } from './company/company.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { DealsModule } from './deals/deals.module';

@Module({
  imports: [

    UserModule,
    UsersModule,
    CompanyModule,
    WarehouseModule,
    DealsModule,

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => (
        {...configService.get('database')}
      ),
    }),

    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
      load: [dbConfiguration, customVariables],
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../client/dist'),
      serveRoot: '/',
      //exclude: ['/api*']
    }),
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter
    }
  ],
})
export class AppModule {}
