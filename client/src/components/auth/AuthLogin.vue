<template>
    <h5>Вход в систему</h5>
    <q-separator inset />
    <div class="q-pa-md">
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        v-model="loginUser.username"
        label="Логин *"
        :error="$v.username.$error"
        :error-message="usernameErrorMessages"
      />
      <!-- <div v-for="error in $v.collection.$each.$response.$errors[index].name" :key="error"></div> -->

      <q-input
        v-model="loginUser.password"
        :type="isPwd ? 'password' : 'text'"
        label="Пароль *"
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
/**
:rules="[
  emptyRule,
  tooShortRule,
  tooLongRule,
]"
*/
import {ref, reactive, computed} from 'vue'

import type { ILoginUser } from '../../../../interfaces/User'

//import {emptyRule, tooShortRule, tooLongRule} from '@/utils/validationRules.ts'
const $externalResults = reactive({})
import { useVuelidate, type Validation} from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'

const isPwd = ref<boolean>(true)

const loginUser = reactive<ILoginUser>({
    username: 'Se',
    password: '1234567'
})

const requiredNameLength = ref(3)
const rules = computed(() => ({
  username: {
    required: helpers.withMessage(`Не может быть пустым`, required),
    minLength: helpers.withMessage(`Минимум ${requiredNameLength.value}`, minLength(requiredNameLength.value))
  },
}))

const $v = useVuelidate(rules, loginUser, { $externalResults: $externalResults })

const usernameErrorMessages = ref<string>('')

async function onSubmit(){
  // $v.value.$clearExternalResults()
  // $v.value.$reset()
  // $v.value.$touch()
  const result = await $v.value.$validate()
  console.log('result:', result)
  const messages = collectMessages($v.value)
  usernameErrorMessages.value = messages
}

function collectMessages($v: Validation): string {
  return $v.$errors.map(err => err.$message).join(' <> ')
}

function onReset(){
  loginUser.username = ''
  loginUser.password = ''
}
</script>

<style lang="scss">

</style>
