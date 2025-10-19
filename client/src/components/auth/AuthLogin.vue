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
          :error-message="usernameErrM"
        />

        <q-input
          v-model="loginUser.password"
          :type="isPwd ? 'password' : 'text'"
          label="Пароль *"
          :error="$v.password.$error"
          :error-message="passwordErrM"
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
import type { ILoginUser } from '../../../../interfaces/User'
import { getAuthRules } from '@/composables/auth/formValidation'

const $externalResults = reactive({})
import { useVuelidate, type ErrorObject } from '@vuelidate/core'

const isPwd = ref<boolean>(true)

const loginUser = reactive<ILoginUser>({
    username: 'Se',
    password: '1234'
})


//определяем правила валидации для разных полей
const rules = getAuthRules(['username', 'password'])
/**

ПОКА ОСТАВИТЬ ДЛЯ НАГЛЯДНОСТИ

const rules = computed(() => ({
  username: {
    required: helpers.withMessage(`Не может быть пустым`, required),
    minLength: helpers.withMessage(`Минимум ${requiredNameLength.value}`, minLength(requiredNameLength.value))
  },
  password: {
    required: helpers.withMessage(`Не может быть пустым`, required),
    minLength: helpers.withMessage(`Минимум ${requiredPasswordLength.value}`, minLength(requiredPasswordLength.value))
  },
}))
*/
const $v = useVuelidate(rules, loginUser, { $externalResults: $externalResults })

const usernameErrM = ref<string>('')
const passwordErrM = ref<string>('')

async function onSubmit(){
  //валидация на клиенте
  const result = await $v.value.$validate()
  usernameErrM.value = collectMessages.call($v.value.username)
  passwordErrM.value = collectMessages.call($v.value.password)

  console.log('Auth validation result:', result)

  //отправка данных на сервер, валидация на сервере, вывод ошибок тут на клиенте
}

function collectMessages(): string {
  return this.$errors.map((err: ErrorObject) => err.$message).join('. ')
}

function onReset(){
  loginUser.username = ''
  loginUser.password = ''
  $v.value.$reset() // $v.value.$clearExternalResults()// $v.value.$reset()// $v.value.$touch()
}

</script>

<style lang="scss">

</style>
