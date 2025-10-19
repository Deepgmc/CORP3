import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
   (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      //проба декоратора, который просто кастит к инту
      return Number.parseInt(request.params.id);
   },
);