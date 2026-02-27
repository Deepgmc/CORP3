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

import * as bodyParser from 'body-parser';

async function bootstrap() {
    //const app = await NestFactory.create(AppModule);

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        abortOnError: true,
        logger: new ConsoleLogger({
            colors: true,
            prefix: 'Umb',
            compact: true
        }),
    });

    //для загрузки фото аватаров нужен расширенный объем
    app.use(bodyParser.json({limit: '30mb'}));
    app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));

    /**
    Переносим всё под раздел api
    Регистрация идёт на /auth без /api потому что там не нужна авторизация
    Всё что не нужно можно добавить в исключения
    */
    app.setGlobalPrefix('api', {
        exclude: [
            { path: '/', method: RequestMethod.GET },
            //{ path: '/company/get_all', method: RequestMethod.GET },
        ],
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
