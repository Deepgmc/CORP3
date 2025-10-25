import { computed } from 'vue'
import { required, helpers, minLength, maxLength, email } from '@vuelidate/validators'
import { type ValidatorFn, type ValidatorResponse } from '@vuelidate/core'
import type { TRegisterForm } from '../../../../interfaces/User'

const VLengths = {
  username: {
    min: 3,
    max: 25
  },
  password: {
    min: 6,
    max: 40
  },
  passwordConfirm: {
    min: 6,
    max: 40
  },
  email: {
    min: 4,
    max: 60
  }
} as { [key: string]: TMinMax }

type TMinMax = {
  min: number,
  max: number
}

export enum EValidations {
  required  = 'required',
  minLength = 'minLength',
  maxLength = 'maxLength',
  email     = 'email',
  passEqual = 'passEqual'
}
export enum msgColors {
  red   = 'red',
  green = 'green'
}

//передаём типы необходимых валидаций, получаем эти валидации в необходиом vuelidate виде
export function getAuthRules(fields: Array<string>, formType: string = 'register'){
  const rules: any = {}
  let thisRules: Array<EValidations>
  fields.forEach((field) => {
    thisRules = []
    switch(field) {
      case 'password':
        thisRules = [EValidations.minLength, EValidations.maxLength, EValidations.required]
        if(formType === 'register') thisRules.push(EValidations.passEqual) //проверка совпадения паролей только для формы регистрации, а не логина
        break;
      case 'passwordConfirm':
      case 'username':
        thisRules = [EValidations.minLength, EValidations.maxLength, EValidations.required]
        break;
      case 'email':
        thisRules = [EValidations.email, EValidations.required]
        break;
    }
    rules[field] = getRule(thisRules, field)
  })

  return computed(() => (rules))
}

const externalServerValidation = () => true //vuelidate bug: incorrect works with $externalData errors!

//для каждого отдельно правила собираем набор ограничений уже конкретно
export function getRule(types: Array<EValidations>, fieldName: string){
  const result: any = {externalServerValidation} //vuelidate bug: incorrect works with $externalData errors!
  types.forEach(type => {
    let min, max
    switch (type){
      case EValidations.required:
        result[type] = helpers.withMessage(`Не может быть пустым`, required)
      break;
      case EValidations.minLength:
        min = VLengths[fieldName]?.min
        if(min) result[type] = helpers.withMessage(`Длина: от ${min}`, minLength(min))
      break;
      case EValidations.maxLength:
        max = VLengths[fieldName]?.max
        if(max) result[type] = helpers.withMessage(`Длина: до ${max}`, maxLength(max))
      break;
      case EValidations.email:
        result[type] = helpers.withMessage(`Невалидный адрес`, email)
      break;
      case EValidations.passEqual:
        result[type] = helpers.withMessage(`Пароли не совпадают`, passEqual)
      break;
    }
  })
  return result
}

/**
 * Валидатор, правильно ли подтвержден пароль (при регистрации)
 * @param value проверяемое поле пароля
 * @param siblings другие поля, одно из которых подтверждение пароля
 * @returns ValidatorResponse -> type Vuelidate
 */
const passEqual: ValidatorFn = (value: TRegisterForm['password'], siblings: any): ValidatorResponse => {
  return {
    $valid: value === siblings.passwordConfirm as TRegisterForm['passwordConfirm']
  }
}
