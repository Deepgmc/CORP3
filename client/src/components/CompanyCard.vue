<template>
    <h4>{{ captionLabel }} компании</h4>
    <div class="form_container">
        <q-form @submit="onSubmit">
            <div class="column">
                <!-- company id (readonly) -->
                <q-input readonly
                    type="number"
                    v-model="companyForm.companyId"
                    label="ID"
                    :rules="[val => !!val || v_msg.REQUIRED]"
                    dense
                />

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

                <!-- company account -->
                <q-input type="number" readonly v-model="companyForm.accountBalance" label="Внутренний баланс компании" dense />

                <!-- Кнопки действий -->
                <div class="row q-mt-sm justify-end" v-if="canEdit">
                    <q-btn label="Сохранить" type="submit" color="primary" />
                </div>
            </div>
        </q-form>
    </div>

    <div>
         <span class="spinner"></span> caption!
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { SAVED_SUCCESS, v_msg } from '@/utils/constants/texts.ts'
import type { ICompanyForm } from '@/interfaces/Company';
import { notifyTypes, useNotify } from '@/composables/notifyQuasar'
import { R_ACTIONS, R_ENTITIES, R_FIELDS, Rbac } from '@/entities/Rbac';

const notify = useNotify()
const $um = Rbac.getInstance()

const {companyId, name, address, accountBalance} = $um.company

const canEdit = $um.can(R_ENTITIES.COMPANY)(R_ACTIONS.EDIT)(R_FIELDS.ENTIRE)
const captionLabel = canEdit ? 'Редактировать данные' : 'Просмотр данных'

const companyForm: ICompanyForm = reactive({
    companyId,
    name,
    address,
    accountBalance
})

async function onSubmit() {
    if (await $um.company.saveCompanyProfile({...companyForm})) {
        notify.run(SAVED_SUCCESS, notifyTypes.succ)
    }
}
</script>

<style lang="scss" scoped>
.spinner {
    display: inline-block;
    height: 100px;
    width: 100px;
    border: 7px solid;
    vertical-align: middle;
    border-radius: 50%;
    border-top-color: #06c927;
    animation: rotatee 0.5s linear infinite;
}
@keyframes rotatee {
    0%{ transform: rotate(0deg);}
    100%{ transform: rotate(360deg);}
}
</style>
