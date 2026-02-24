<template>
    <h4>Мой профиль</h4>
    <q-dialog v-model="isCPOpen">
        <q-card>
            <q-card-section class="q-ma-xl">
                <q-form @submit="onCPSubmit">
                    <div class="row">
                        <div class="col">
                            <q-input readonly v-model="CPForm.username" label="логин *"
                                     :rules="[val => !!val || v_msg.REQUIRED]" dense />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <q-input v-model="CPForm.password" label="текущий пароль *"
                                     :rules="[val => !!val || v_msg.REQUIRED]" dense />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <q-input v-model="CPForm.newPassword" label="новый пароль *"
                                     :rules="[val => !!val || v_msg.REQUIRED]" dense />
                        </div>
                    </div>

                    <q-separator class="q-mt-xl"></q-separator>

                    <q-btn flat color="primary" type="submit" label="Изменить" />
                    <q-btn v-close-popup flat color="secondary" label="Закрыть" />
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>

    <q-form @submit="onSubmit" class="q-gutter-md ">
        <fieldset class="fieldset">
            <legend class="text-h5">Редактировать мои данные</legend>
            <!-- login -->
            <div class="row">
                <div class="col-12">
                    <q-badge class="q-pa-sm" text-color="black" color="orange-5" icon="account_circle">
                        {{ form.username }}
                        <q-icon class="q-ml-md" name="swap_horiz" size="md" @click="isCPOpen = true"
                                style="cursor:pointer" color="green-10" />
                    </q-badge>
                </div>
            </div>

            <div class="row">
                <!-- Компания -->
                <div class="col-12">
                    <q-badge class="q-pa-sm" transparent text-color="black" color="orange-5" icon="home">
                        {{ form.company?.name }} / {{ form.department?.name }}
                    </q-badge>
                </div>
            </div>

            <!-- Имя и Фамилия -->
            <div class="row">
                <div class="col-6">
                    <q-input v-model="form.firstName" label="Имя *" :rules="[val => !!val || v_msg.REQUIRED]" dense />
                </div>

                <div class="col-6">
                    <q-input v-model="form.lastName" label="Фамилия *" :rules="[val => !!val || v_msg.REQUIRED]"
                             dense />
                </div>
            </div>

            <!-- Email -->
            <!-- Телефон -->
            <div class="row">
                <div class="col-6">
                    <q-input v-model="form.email" label="Email *" type="email" :rules="[
                        val => !!val || v_msg.REQUIRED,
                        val => /.+@.+\..+/.test(val) || v_msg.EMAIL_FORMAT
                    ]" dense />
                </div>
                <div class="col-6">
                    <q-input v-model="form.phone" label="Телефон" mask="+# (###) ###-##-##" fill-mask
                             hint="Формат: +7 (123) 456-78-90" :rules="[
                                val => !val || /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(val) || v_msg.PHONE_FORMAT
                            ]" dense />
                </div>
            </div>

            <!-- Дата рождения -->
            <div class="row">
                <div class="col-12">
                    <q-input readonly v-model="bDateStr" label="Дата рождения" dense>
                        <template #append>
                            <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-date v-model="bDateStr" mask="DD.MM.YYYY">
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="OK" color="primary" flat />
                                        </div>
                                    </q-date>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </div>
            </div>

            <!-- О себе (текстовое поле) -->
            <div class="row">
                <div class="col-12">
                    <q-input v-model="form.bio" label="О себе" type="textarea" autogrow dense :rules="[
                        val => !val || val.length <= 500 || 'Максимум 500 символов'
                    ]" counter />
                </div>
            </div>

            <!-- Пол (радио-кнопки) -->
            <div class="row">
                <div class="col-12">
                    <div class="q-mt-sm">
                        <div class="q-mb-xs text-caption">Пол</div>
                        <q-option-group v-model="form.gender" :options="genderOptions" color="primary" inline />
                    </div>
                </div>
            </div>

            <!-- Кнопки действий -->
            <div class="row q-gutter-sm">
                <q-btn label="Сохранить" type="submit" color="primary" />
            </div>
        </fieldset>
    </q-form>

    <!-- Навыки -->
    <fieldset class="fieldset">
        <legend class="text-h5">Мои навыки</legend>
        <user-skills
            :skills="form.skills"
            :needAssession="true"
            @remove-skill="removeSkill"
            @add-skill="addSkill"
            :alwaysShowAll="true"
        ></user-skills>
    </fieldset>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, ref, watch } from 'vue'
import { convertStrToUnixTimestamp, convertTSToStr } from '@/utils/helpers/dates'
import type { ICPForm, IUser, TSkill } from '@/interfaces/User'
import UserSkills from '@/components/UserSkills.vue'
import { genderOptions } from '@/utils/constants/main'
import { userDummy } from '@/stores/userStore'

import { v_msg, SAVED_SUCCESS } from '@/utils/constants/texts.ts'
import { notifyTypes, useNotify } from '@/composables/notifyQuasar'
import type { TResult } from '@/interfaces/Error'
import { Rbac } from '@/entities/Rbac'

const $userManager = Rbac.getInstance()
const notify = useNotify()

onBeforeMount(() => {
    const user = $userManager.getUser()
    assignUserToFormData(user)
})

const isCPOpen = ref(false)

// Модель формы
const dummyCopy: IUser = Object.create(userDummy)
const form = reactive<IUser>(dummyCopy)
const bDateStr = ref<string>()

/**
 * Берём юзера из юзер-стора и запихиваем в форму, конвертируя нужные данные
 * @param user IUser
 */
function assignUserToFormData(user: IUser) {
    Object.assign(form, user)
    const bDate = convertTSToStr(user.birth)
    if (typeof bDate === 'string') bDateStr.value = bDate
    form.gender = Number(form.gender)
}

watch(bDateStr, (newBdate) => {
    const birth: TResult = convertStrToUnixTimestamp(String(newBdate))
    if (birth.error) {
        throw new TypeError('Ошибка получения даты рождения')
    }
    form.birth = birth.res
})

async function onSubmit(): Promise<void> {
    if (await $userManager.saveUserProfile({...form})) {
        notify.run(SAVED_SUCCESS, notifyTypes.succ)
    }
}

function removeSkill(skillId: TSkill['id']): void {
    if (!Number.isInteger(skillId)) return
    $userManager.removeUserSkill(skillId)
}

function addSkill(skillText: string): void {
    $userManager.addUserSkill(skillText)
}

///// CHANGE PASSWORD
const CPForm: ICPForm = reactive({
    userId: 0,
    username: '',
    password: '',
    newPassword: ''
})

async function onCPSubmit(): Promise<void> {
}
///// CHANGE PASSWORD
</script>
