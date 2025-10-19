import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

/**
 * Validation pipe, checks whether password is equal to passwordConfirmation
 */
@Injectable()
export class PasswordValidationPipe implements PipeTransform {
  transform(value: any, /*metadata: ArgumentMetadata*/) {
    if(value.password !== value.passwordConfirm) throw new BadRequestException(['Пароли не совпадают'])
    return value
  }
}