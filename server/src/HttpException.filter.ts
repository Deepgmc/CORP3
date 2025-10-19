import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from "@nestjs/common";
import { resolve } from "path";

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    response.sendFile(resolve(__dirname, '../src/err.html'))
  }
}