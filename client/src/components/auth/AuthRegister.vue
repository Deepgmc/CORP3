<template>
    <div class="q-pa-md">
        <q-form @submit="onSubmit" @reset="onReset">
            <q-input v-model="regUser.username" label="Логин *" :error="$v.username.$error"
                     :error-message="getErrorForField('username')" @blur="setBlur('username')" />

            <q-input v-model="regUser.email" label="Эл. почта *" :error="$v.email.$error"
                     :error-message="getErrorForField('email')" @blur="setBlur('email')" />

            <q-input v-model="regUser.password" :type="isPwd ? 'password' : 'text'" label="Пароль *"
                     :error="$v.password.$error" :error-message="getErrorForField('password')"
                     @blur="setBlur('password')">
                <template #append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                            @click="isPwd = !isPwd" />
                </template>
            </q-input>

            <q-input v-model="regUser.passwordConfirm" :type="isPwdConf ? 'password' : 'text'" label="Пароль повторно *"
                     :error="$v.passwordConfirm.$error" :error-message="getErrorForField('passwordConfirm')"
                     @blur="setBlur('passwordConfirm')">
                <template #append>
                    <q-icon :name="isPwdConf ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                            @click="isPwdConf = !isPwdConf" />
                </template>
            </q-input>

            <div class="row">
                <div :class="{ 'col-8': isCompanySelected, 'col-12': !isCompanySelected }">
                    <q-select filled
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
                <div v-show="isCompanySelected" :class="{ 'col-4': isCompanySelected }">
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

            <!--Department-->
            <div v-if="isCompanySelected" class="row q-pt-sm">
                <div class="col">
                    <q-select filled
                        v-model="selectDeptModel"
                        :options="selectDeptOptions"
                        input-debounce="0"
                        label="Выберите департамент *"
                        @update:model-value="onDeptSelect"
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
            </div>

            <!--Position-->
            <div v-if="isCompanySelected" class="row q-pt-sm">
                <div class="col">
                    <q-select filled
                        v-model="selectPositionModel"
                        :options="selectPositionOptions"
                        input-debounce="0"
                        label="Выберите должность"
                        @update:model-value="onPositionSelect"
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
            </div>

            <q-btn label="Зарегистрироваться" type="submit" color="primary" />
            <q-btn label="Сбросить" type="reset" color="primary" flat class="q-ml-sm" />
        </q-form>
    </div>
</template>


<script setup lang="ts">
import { ref, reactive, inject, onMounted, computed } from 'vue'

import type { TRegisterForm } from '@/interfaces/User'
import { getAuthRules } from '@/composables/auth/formValidation'

import { useVuelidate, type ErrorObject } from '@vuelidate/core'
import { UserManager } from '@/entities/UserManager'
import type NetworkManager from '@/network/NetworkManager'
import { useCompany } from '@/composables/companySelect'
import { notifyTypes, useNotify } from '@/composables/notifyQuasar'
const $networkManager: NetworkManager | undefined = inject<NetworkManager>('$networkManager')

if (!$networkManager) {
    throw new Error('Wrong network manager injection!')
}

const $externalResults = reactive({})

const {
    selectRefModel,
    selectDeptModel,
    selectPositionModel,
    selectOptions,
    selectDeptOptions,
    selectPositionOptions,
    filterFn,
    loadAllCompanies,
    resetCompanySelection,
    loadCompanyDepartments,
    loadPositions,
} = useCompany($networkManager)

const isPwd = ref<boolean>(true)
const isPwdConf = ref<boolean>(true)
const notify = useNotify()

const regUser = ref<TRegisterForm>({
    username       : 'Deepgmc',
    password       : '1234567',
    passwordConfirm: '1234567',
    email          : 'test@mail.ru',
    bio            : '',
    birth          : 0,
    companyId      : null,
    isDirector     : false,
    departmentId   : null,
    positionId     : null,
})

onMounted(() => {
    //загружаем список компаний при инициализации
    loadAllCompanies()
})

const rules = getAuthRules(['username', 'password', 'passwordConfirm', 'email', 'passEqual', 'companyId'])
const $v = useVuelidate(rules, regUser, { $externalResults: $externalResults })

function setBlur(fieldName: string) {
    $v.value[fieldName].$touch()
}

async function onSubmit(): Promise<boolean> {
    if (!await $v.value.$validate()) return false

    //отправка данных на сервер, валидация на сервере, вывод ошибок
    try {
        const registerRes = await UserManager.getInstance().registerRequest(regUser.value)
        if (registerRes.error) {
            if (registerRes.message) notify.run(registerRes.message, notifyTypes.err)
            return false
        }
    } catch (error: any) {
        if (typeof error.response !== 'undefined') {
            notify.run(error.response.data.message[0], notifyTypes.err)
        }
        return false
    }
    notify.run('Вы успешно зарегистрировались', notifyTypes.succ)
    return true
}

//при смене селекта департамента грузим нужные департаменты и мерджим компанию в основную модель
async function onCompanySelect(): Promise<void> {
    if (selectRefModel.value === null) throw new Error('Wrong company selection')
    regUser.value.companyId = selectRefModel.value.value ?? null
    await loadCompanyDepartments(selectRefModel.value.value)
    await loadPositions()
}

//при смене селекта департамента
async function onDeptSelect(): Promise<void> {
    if (selectDeptModel.value === null) throw new Error('Wrong department selection')
    regUser.value.departmentId = selectDeptModel.value.value ?? null
}
//при смене селекта должности
async function onPositionSelect(): Promise<void> {
    if (selectPositionModel.value === null) throw new Error('Wrong position selection')
    regUser.value.positionId = selectPositionModel.value.value ?? null
}

/* выбрана ли компания в зависимости от состояния */
const isCompanySelected = computed((): boolean => {
    return !!regUser.value.companyId
})

function onReset() {
    regUser.value.username = ''
    regUser.value.password = ''
    regUser.value.passwordConfirm = ''
    regUser.value.email = ''
    regUser.value.companyId = null
    resetCompanySelection()
    $v.value.$reset()
}

function getErrorForField(field: string) {
    return $v.value[field].$errors.map((err: ErrorObject) => {
        return err.$message.toString()
    }).join(' | ')
}

</script>

<style lang="scss"></style>
