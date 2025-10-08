import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import dbConfiguration from './config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
      load: [dbConfiguration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../client/dist'),
      // serveRoot: '/',
      // exclude: ['/users*', '/companies*'],
      // exclude: ['/api/{*test}'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
