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

        <div>
          <q-btn label="Войти" type="submit" color="primary" />
          <q-btn label="Сбросить" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
</template>



<script setup lang="ts">

import {ref, reactive, computed} from 'vue'
import type { ILoginUser } from '../../../../interfaces/User'
import { requiredNameLength, requiredPasswordLength } from '@/composables/auth/formValidation'

const $externalResults = reactive({})
import { useVuelidate, type ErrorObject } from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'

const isPwd = ref<boolean>(true)

const loginUser = reactive<ILoginUser>({
    username: 'Se',
    password: '1234'
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
}))

const $v = useVuelidate(rules, loginUser, { $externalResults: $externalResults })

const usernameErrorMessages = ref<string>('')
const passwordErrorMessages = ref<string>('')

async function onSubmit(){
  // $v.value.$clearExternalResults()// $v.value.$reset()// $v.value.$touch()
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
  $v.value.$reset()
}
</script>

<style lang="scss">

</style>
