<template>
    <div class="q-pa-md">
      <q-form
        @submit="onSubmit"
        @reset="onReset"
      >
        <q-input
          v-model="loginUser.username"
          label="Логин *"
          :error="$v.username.$error"
          :error-message="getErrorForField('username')"
        />

        <q-input
          v-model="loginUser.password"
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

        <div>
          <div class="row">
            <div class="col">
              <q-chip v-if="responseMsgText" class="q-mb-md" :color="responseMsgColor" text-color="white">
                {{ responseMsgText }}
              </q-chip>
            </div>
          </div>
          <q-btn label="Войти" type="submit" color="primary" />
          <q-btn label="Сбросить" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
</template>


<script setup lang="ts">

import {ref, reactive } from 'vue'
import { AuthManager } from '@/auth/AuthManager'
import type { ILoginUser } from '@/interfaces/User'
import { getAuthRules, msgColors } from '@/composables/auth/formValidation'

const authManager = AuthManager.getInstance()

const $externalResults = reactive({})
import { useVuelidate, type ErrorObject } from '@vuelidate/core'
import { useRouter } from 'vue-router'

const isPwd = ref<boolean>(true)

const loginUser = ref<ILoginUser>({
    username: 'Deepgmc',
    password: '1234567'
})
const responseMsgText = ref<string>('')
const responseMsgColor = ref<msgColors>(msgColors.red)

const router = useRouter()

//определяем правила валидации для разных полей
const rules = getAuthRules(['username', 'password'], 'login')
const $v = useVuelidate(rules, loginUser, { $externalResults: $externalResults })

async function onSubmit(){
  try {
    const loginRes = await authManager.loginRequest(loginUser.value)
    if(loginRes.error){
      responseMsgColor.value = msgColors.red
      responseMsgText.value = loginRes.message ? loginRes.message : ''
    } else {
      responseMsgColor.value = msgColors.green
      responseMsgText.value = 'Вход завершен успешно'
      authManager.setRouteAfterLogin(router)
    }
  } catch (e: any){
    console.log('onSubmit error:', e)
  }











  // try {
  //   const loginRes = await authManager.loginRequest(loginUser.value)
  //
  //   if(loginRes.error){
  //     responseMsgText.value = loginRes.error.message
  //     return false
  //   }
  //   responseMsgColor.value = msgColors.green
  //   responseMsgText.value = 'Вы успешно вошли в систему'
  //   return true
  // } catch (error: any) {
  //   responseMsgColor.value = msgColors.red
  //   if(typeof error.response !== 'undefined') responseMsgText.value = error.response.data.message[0]
  //   return false
  // }
}


function onReset(){
  resetForm()
}

function resetForm(){
  loginUser.value.username = ''
  loginUser.value.password = ''
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
