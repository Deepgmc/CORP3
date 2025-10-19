import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';

let counter = 1;

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService) {
        console.warn('LoggerMiddleware <constructor>. Counter:', counter++);
    }
    use(req: Request, res: Response, next: NextFunction) {
        console.log(req.method, req.url, 'LoggerMiddleware <body>. Counter: ' + counter++);
        next();
    }
}