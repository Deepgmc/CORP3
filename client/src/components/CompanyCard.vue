<template>
    <h4>{{ captionLabel }} компании {{ companyForm.name }}</h4>
    <div class="form_container">
        <q-form @submit="onSubmit">
            <div class="column">
                <div class="row justify-around items-center">
                    <!-- company id (readonly) -->
                    <div>ID: <span>{{ companyForm.companyId }}</span></div>
                    <div>Внутренний баланс компании: <span v-marker v-splitNumber="companyForm.accountBalance"></span> руб.</div>
                </div>

                <!-- company name -->
                <q-input
                    :readonly="!canEdit"
                    v-model="companyForm.name"
                    label="Название *"
                    :rules="[val => !!val || v_msg.REQUIRED]"
                    dense
                />

                <!-- company address -->
                <q-input :readonly="!canEdit" :rules="[val => !!val || v_msg.REQUIRED]" v-model="companyForm.address" label="Адрес" dense />

                <!-- Кнопки действий -->
                <div class="row q-mt-sm justify-end" v-if="canEdit">
                    <q-btn label="Сохранить" type="submit" color="primary" />
                </div>
            </div>
        </q-form>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { SAVED_SUCCESS, v_msg } from '@/utils/constants/texts.ts'
import type { ICompanyForm } from '@/interfaces/Company';
import { notifyTypes, useNotify } from '@/composables/notifyQuasar'
import { R_ACTIONS, R_ENTITIES, R_FIELDS, Rbac } from '@/entities/Rbac';
// import { rbacSym } from '@/utils/injecttionSymbols';

const notify = useNotify()
//const $userManager = inject<Rbac>(rbacSym) as Rbac
const $userManager = Rbac.getInstance()

const {companyId, name, address, accountBalance} = $userManager.company

const canEdit = $userManager.can(R_ENTITIES.COMPANY)(R_ACTIONS.EDIT)(R_FIELDS.ENTIRE)
const captionLabel = canEdit ? 'Редактировать данные' : 'Просмотр данных'

const companyForm: ICompanyForm = reactive({
    companyId,
    name,
    address,
    accountBalance
})

async function onSubmit() {
    if (await $userManager.company.saveCompanyProfile({...companyForm})) {
        notify.run(SAVED_SUCCESS, notifyTypes.succ)
    }
}
</script>
