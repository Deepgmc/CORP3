<template>
    <div class="q-pa-md">
      <q-form
        @submit="onSubmit"
        @reset="onReset"
      >
        <q-input
          v-model="regUser.username"
          label="Логин *"
          :error="$v.username.$error"
          :error-message="getErrorForField('username')"
        />

        <q-input
          v-model="regUser.email"
          label="Эл. почта *"
          :error="$v.email.$error"
          :error-message="getErrorForField('email')"
        />

        <q-input
          v-model="regUser.password"
          :type="isPwd ? 'password' : 'text'"
          label="Пароль *"
          :error="$v.password.$error"
          :error-message="getErrorForField('password')"
        >
          <template #append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-input
          v-model="regUser.passwordConfirm"
          :type="isPwdConf ? 'password' : 'text'"
          label="Пароль повторно *"
          :error="$v.passwordConfirm.$error"
          :error-message="getErrorForField('passwordConfirm')"
        >
          <template #append>
            <q-icon
              :name="isPwdConf ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwdConf = !isPwdConf"
            />
          </template>
        </q-input>

        <div>
          <div class="row">
            <div class="col">
              <q-chip v-if="responseMsgText" class="q-mb-md" :color="responseMsgColor" text-color="white">
                {{ responseMsgText }}
              </q-chip>
            </div>
          </div>
          <q-btn label="Зарегистрироваться" type="submit" color="primary" />
          <q-btn label="Сбросить" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
</template>




<script setup lang="ts">
import {ref, reactive } from 'vue'
import type { TRegisterForm } from '../../../../interfaces/User'
import { getAuthRules, msgColors } from '@/composables/auth/formValidation'

const $externalResults = reactive({})
import { useVuelidate, type ErrorObject } from '@vuelidate/core'
import { AuthManager } from '@/auth/AuthManager'

const authManager = AuthManager.getInstance()

const isPwd      = ref<boolean>(true)
const isPwdConf  = ref<boolean>(true)
const responseMsgText = ref<string>('')
const responseMsgColor = ref<msgColors>(msgColors.red)

const regUser = ref<TRegisterForm>({
    username       : 'Deepgmc',
    password       : '1234567',
    passwordConfirm: '1234567',
    email          : 'test@mail.ru',
    birth          : 577396800000,
})

const rules = getAuthRules(['username', 'password', 'passwordConfirm', 'email', 'passEqual'])
const $v = useVuelidate(rules, regUser, { $externalResults: $externalResults })

async function onSubmit(): Promise<boolean> {
  resetServerErrText()
  if(!await $v.value.$validate()) return false

  //отправка данных на сервер, валидация на сервере, вывод ошибок
  try {
    const registerRes = await authManager.registerRequest(regUser.value)
    if(registerRes.error){
      responseMsgText.value = 'Unhandled error'
    }
  } catch (error: any) {
    responseMsgColor.value = msgColors.red
    if(typeof error.response !== 'undefined') responseMsgText.value = error.response.data.message[0]
    return false
  }
  responseMsgColor.value = msgColors.green
  responseMsgText.value = 'Вы успешно зарегистрировались'
  return true
}

function onReset(){
  resetForm()
}

function resetForm(){
  regUser.value.username = ''
  regUser.value.password = ''
  regUser.value.passwordConfirm = ''
  regUser.value.email = ''
  resetServerErrText()
  $v.value.$reset()
}

function resetServerErrText(){
  responseMsgText.value = ''
}

function getErrorForField(field: string) {
  return $v.value[field].$errors.map((err: ErrorObject) => {
    return err.$message.toString()
  }).join(' | ')
}

</script>

<style lang="scss">

</style>
