<template>
    <q-form class="q-gutter-md" @submit="onSubmit">
        <!-- company id (readonly) -->
        <div class="row">
            <div class="col-12">
                <q-input readonly v-model="companyForm.companyId" label="ID"
                            :rules="[val => !!val || v_msg.REQUIRED]" dense />
            </div>
        </div>
        <!-- company name -->
        <div class="row">
            <div class="col-12">
                <q-input :readonly="!$authManager.isDirector()" v-model="companyForm.name" label="Название *"
                            :rules="[val => !!val || v_msg.REQUIRED]" dense />
            </div>
        </div>
        <!-- company address -->
        <div class="row">
            <div class="col-12">
                <q-input :readonly="!$authManager.isDirector()" v-model="companyForm.address" label="Адрес" dense />
            </div>
        </div>

        <!-- Кнопки действий -->
        <div class="row q-gutter-sm" v-if="$authManager.isDirector()">
            <q-btn label="Сохранить" type="submit" color="primary" />
        </div>
    </q-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { SAVED_SUCCESS, v_msg } from '@/utils/constants/texts.ts'
import type { ICompanyForm } from '@/interfaces/Company';
import { AuthManager } from '@/auth/AuthManager';
import { notifyTypes, useNotify } from '@/composables/notifyQuasar'

const notify = useNotify()
const $authManager = AuthManager.getInstance()

const {companyId, name, address} = $authManager.company

const companyForm: ICompanyForm = reactive({
    companyId,
    name,
    address
})

async function onSubmit() {
    const saveCompanyProfile: ICompanyForm = Object.assign({}, companyForm)
    if (await $authManager.company.saveCompanyProfile(saveCompanyProfile)) {
        notify.run(SAVED_SUCCESS, notifyTypes.succ)
    }
}
</script>
