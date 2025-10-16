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
          :error-message="usernameErrorMessages"
        />

        <q-input
          v-model="loginUser.password"
          :type="isPwd ? 'password' : 'text'"
          label="Пароль *"
          :error="$v.password.$error"
          :error-message="passwordErrorMessages"
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
          v-model="loginUser.passwordConfirm"
          :type="isPwdConf ? 'password' : 'text'"
          label="Пароль повторно *"
          :error="$v.passwordConfirm.$error"
          :error-message="passwordConfirmErrorMessages"
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
          <q-btn label="Войти" type="submit" color="primary" />
          <q-btn label="Сбросить" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed} from 'vue'
import type { TRegisterForm } from '../../../../interfaces/User'
import { requiredNameLength, requiredPasswordLength } from '@/composables/auth/formValidation'

const $externalResults = reactive({})
import { useVuelidate, type ErrorObject } from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'

const isPwd = ref<boolean>(true)
const isPwdConf = ref<boolean>(true)
const usernameErrorMessages = ref<string>('')
const passwordErrorMessages = ref<string>('')
const passwordConfirmErrorMessages = ref<string>('')

const loginUser = reactive<TRegisterForm>({
    username       : 'Se',
    password       : '1234',
    passwordConfirm: '1234',
    email          : 'test@mail.ru',
    birth          : '19.04.1988',
})

const rules = computed(() => ({
  username: {
    required: helpers.withMessage(`Не может быть пустым`, required),
    minLength: helpers.withMessage(`Минимум ${requiredNameLength.value}`, minLength(requiredNameLength.value))
  },
  password: {
    required: helpers.withMessage(`Не может быть пустым`, required),
    minLength: helpers.withMessage(`Минимум ${requiredPasswordLength.value}`, minLength(requiredPasswordLength.value))
  },
  passwordConfirm: {
    required: helpers.withMessage(`Не может быть пустым`, required),
    minLength: helpers.withMessage(`Минимум ${requiredPasswordLength.value}`, minLength(requiredPasswordLength.value))
  },
}))

const $v = useVuelidate(rules, loginUser, { $externalResults: $externalResults })

async function onSubmit(){
  const result = await $v.value.$validate()
  console.log('Validation result:', result)
  usernameErrorMessages.value = collectMessages.call($v.value.username)
  passwordErrorMessages.value = collectMessages.call($v.value.password)
}

function collectMessages(): string {
  return this.$errors.map((err: ErrorObject) => err.$message).join('. ')
}

function onReset(){
  loginUser.username = ''
  loginUser.password = ''
  loginUser.passwordConfirm = ''
  $v.value.$reset()
}
</script>

<style lang="scss">

</style>
