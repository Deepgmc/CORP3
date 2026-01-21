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
import { getAuthRules } from '@/composables/auth/formValidation'

const authManager = AuthManager.getInstance()

const $externalResults = reactive({})
import { useVuelidate, type ErrorObject } from '@vuelidate/core'
import { useRouter } from 'vue-router'
import { useNotify } from '@/composables/notifyQuasar'
import { notifyTypes } from '@/composables/notifyQuasar'


const isPwd = ref<boolean>(true)

const loginUser = ref<ILoginUser>({
    username: 'Deepgmc',
    password: '1234567'
})

const router = useRouter()
const notify = useNotify()

//определяем правила валидации для разных полей
const rules = getAuthRules(['username', 'password'], 'login')
const $v = useVuelidate(rules, loginUser, { $externalResults: $externalResults })

async function onSubmit(){
  try {
    const loginRes = await authManager.loginRequest(loginUser.value)
    if(loginRes.error){
      if(loginRes.message) notify.run(loginRes.message, notifyTypes.err)
    } else {
      notify.run('Вход завершен успешно', notifyTypes.succ)
      authManager.setRouteAfterLogin(router)
    }
  } catch (e: any){
    notify.run(e.response.data.message[0], notifyTypes.err)
  }
}

function onReset(){
  resetForm()
}

function resetForm(){
  loginUser.value.username = ''
  loginUser.value.password = ''
  $v.value.$reset()
}

function getErrorForField(field: string) {
  return $v.value[field].$errors.map((err: ErrorObject) => {
    return err.$message.toString()
  }).join(' | ')
}

</script>
