<template>
    <h4>Компания</h4>
    <q-form class="q-gutter-md" @submit="onSubmit">
        <fieldset class="fieldset">
            <legend class="text-h5">{{ captionLabel }}</legend>
            <!-- company id (readonly) -->
            <div class="row">
                <div class="col-12">
                    <q-input readonly
                        v-model="companyForm.companyId"
                        label="ID"
                        :rules="[val => !!val || v_msg.REQUIRED]" dense
                    />
                </div>
            </div>
            <!-- company name -->
            <div class="row">
                <div class="col-12">
                    <q-input
                        :readonly="!canEdit"
                        v-model="companyForm.name"
                        label="Название *"
                        :rules="[val => !!val || v_msg.REQUIRED]" dense
                    />
                </div>
            </div>
            <!-- company address -->
            <div class="row">
                <div class="col-12">
                    <q-input :readonly="!canEdit" v-model="companyForm.address" label="Адрес" dense />
                </div>
            </div>

            <!-- Кнопки действий -->
            <div class="row q-pt-md" v-if="canEdit">
                <div class="col">
                    <q-btn label="Сохранить" type="submit" color="primary" />
                </div>
            </div>
        </fieldset>
    </q-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { SAVED_SUCCESS, v_msg } from '@/utils/constants/texts.ts'
import type { ICompanyForm } from '@/interfaces/Company';
import { notifyTypes, useNotify } from '@/composables/notifyQuasar'
import { R_ACTIONS, R_ENTITIES, R_FIELDS, Rbac } from '@/entities/Rbac';

const notify = useNotify()
const $um = Rbac.getInstance()

const {companyId, name, address} = $um.company

const canEdit = $um.can(R_ENTITIES.COMPANY)(R_ACTIONS.EDIT)(R_FIELDS.ENTIRE)
const captionLabel = canEdit ? 'Редактировать данные' : 'Просмотр данных'

const companyForm: ICompanyForm = reactive({
    companyId,
    name,
    address
})

async function onSubmit() {
    if (await $um.company.saveCompanyProfile({...companyForm})) {
        notify.run(SAVED_SUCCESS, notifyTypes.succ)
    }
}
</script>
