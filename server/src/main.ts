// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { Logger } from '@nestjs/common';
// import { RequestMethod } from '@nestjs/common';
// import { NestExpressApplication } from '@nestjs/platform-express';

// async function bootstrap() {
//   //const app = await NestFactory.create(AppModule);

//   const app = await NestFactory.create<NestExpressApplication>(AppModule, {
//     abortOnError: true,
//   });

//   app.setGlobalPrefix('api', {
//     exclude: [{ path: '/', method: RequestMethod.GET }],
//   });


//   const port = process.env.LISTEN_PORT ?? 0;
//   await app.listen(port);
//   const logger = new Logger(`INIT END. Server started at port: ${port}`);
//   logger.error('####################################');
// }
// bootstrap();



import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConsoleLogger } from '@nestjs/common';
import { RequestMethod } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: true,
    logger: new ConsoleLogger({
      colors: true,
      prefix: 'Umb',
    }),
  });

  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  const configSwagger = new DocumentBuilder()
    .setTitle('CORP api documentation')
    .setDescription('Документация апи-части сервиса')
    .addServer('http://localhost:3050')
    .build()
  const document = SwaggerModule.createDocument(app, configSwagger)
  SwaggerModule.setup('/api/docs', app, document)


  const port = process.env.LISTEN_PORT ?? 0;
  await app.listen(port);
  const logger = new Logger(`INIT END. Server started at port: ${port}`);
  logger.error('####################################');
}
bootstrap();
