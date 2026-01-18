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

      <div class="row">
        <div :class="{'col-8': isCompanySelected, 'col-12': !isCompanySelected}">
          <q-select
            filled
            v-model="selectRefModel"
            :options="selectOptions"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            @filter="filterFn"
            @update:model-value="onCompanySelect"

            label="Выберите компанию *"
            :error="$v.companyId.$error"
            :error-message="getErrorForField('companyId')"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Ничего не найдено
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div v-show="isCompanySelected" :class="{'col-4': isCompanySelected}">
          <div class="row">
            <div class="col-12">
              Вы руководитель?
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-checkbox v-show="isCompanySelected" v-model="regUser.isDirector" left-label label="" />
            </div>
          </div>
        </div>
      </div>

      <div class="row q-mt-sm">
        <div class="col">
          <q-chip v-if="responseMsgText" class="q-mb-md" :color="responseMsgColor" text-color="white">
            {{ responseMsgText }}
          </q-chip>
        </div>
      </div>
      <q-btn label="Зарегистрироваться" type="submit" color="primary" />
      <q-btn label="Сбросить" type="reset" color="primary" flat class="q-ml-sm" />
    </q-form>
  </div>
</template>


<script setup lang="ts">
import {ref, reactive, inject, onMounted, computed } from 'vue'

import type { TRegisterForm } from '@/interfaces/User'
import { getAuthRules, msgColors } from '@/composables/auth/formValidation'

const $externalResults = reactive({})
import { useVuelidate, type ErrorObject } from '@vuelidate/core'
import { AuthManager } from '@/auth/AuthManager'
import type NetworkManager from '@/network/NetworkManager'
import { useCompany } from '@/composables/companySelect'
const $networkManager: NetworkManager | undefined = inject<NetworkManager>('$networkManager')

//import { useTemplateRef } from 'vue'
//const comSelectRef = useTemplateRef('comSelectRef')

if(!$networkManager){
  throw new Error('Wrong network manager injection!')
}

const { selectOptions, selectRefModel, filterFn, loadAllCompanies, resetCompanySelection } = useCompany($networkManager)

const isPwd            = ref<boolean>(true)
const isPwdConf        = ref<boolean>(true)
const responseMsgText  = ref<string>('')
const responseMsgColor = ref<msgColors>(msgColors.red)

const regUser = ref<TRegisterForm>({
    username       : 'Deepgmc',
    password       : '1234567',
    passwordConfirm: '1234567',
    email          : 'test@mail.ru',
    birth          : 577396800000,
    companyId      : null,
    isDirector     : false
})
onMounted(() => {
  //загружаем список компаний при инициализации
  loadAllCompanies()
})

const rules = getAuthRules(['username', 'password', 'passwordConfirm', 'email', 'passEqual', 'companyId'])
const $v = useVuelidate(rules, regUser, { $externalResults: $externalResults })

async function onSubmit(): Promise<boolean> {
  resetServerErrText()
  if(!await $v.value.$validate()) return false

  //отправка данных на сервер, валидация на сервере, вывод ошибок
  try {
    const registerRes = await AuthManager.getInstance().registerRequest(regUser.value)
    if(registerRes.error){
      responseMsgText.value = registerRes.message ?? 'unhandled error'
      return false
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

function onCompanySelect(): void {
  if(selectRefModel.value === null) throw new Error('Wrong company selection')
  regUser.value.companyId = selectRefModel.value.value ?? null
}

/* выбрана ли компания в зависимости от состояния */
const isCompanySelected = computed((): boolean => {
  return !!regUser.value.companyId
})

function onReset(){
  resetForm()
}

function resetForm(){
  regUser.value.username = ''
  regUser.value.password = ''
  regUser.value.passwordConfirm = ''
  regUser.value.email = ''
  regUser.value.companyId = null
  resetServerErrText()
  resetCompanySelection()
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
