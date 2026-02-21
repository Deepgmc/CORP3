<template>
    <q-dialog v-model="isOpenedGV">
        <q-card class="q-pa-md" :class="qCardWidthClass">
            <q-form @submit.prevent="changeValue">
                <div class="row">
                    <div class="col">
                        <q-input
                            v-model="gvSettings.val"
                            :type="gvSettings.fieldType"
                            dense
                            label="Меняем значение:"
                        ></q-input>
                    </div>
                </div>
                <div class="row q-mt-lg">
                    <div class="col">
                        <q-btn flat label="Сохранить" type="submit" color="primary" />
                        <q-btn v-close-popup flat label="Закрыть" color="secondary" />
                    </div>
                </div>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script lang="ts" setup>

import { useGVDialog } from '@/composables/gridView/redactFieldDialog';
import { notifyTypes, useNotify } from '@/composables/notifyQuasar';
import { SAVED_ERROR } from '@/utils/constants/texts';
import { computed } from 'vue';
const { isOpenedGV, gvSettings, saveNewData, closeGV } = useGVDialog()
const notify = useNotify()

async function changeValue() {
    const itemId = gvSettings.value.itemId
    if(Number.isInteger(Number(itemId))) {
        const isSaved: boolean = await saveNewData({
            itemId,
            val      : gvSettings.value.val,
            fieldName: gvSettings.value.fieldName,
            module   : gvSettings.value.module,
            action   : gvSettings.value.action
        });
        if(isSaved){
            closeGV()
                .then( () => {
                    if(gvSettings.value.HTMLElement !== null)
                        gvSettings.value.HTMLElement.innerText = gvSettings.value.val
                })
        } else {
            notify.run(SAVED_ERROR, notifyTypes.err)
        }
    };
}

//ширина модалки в зависимости от типа поля
const qCardWidthClass = computed(() => {
    return {
        'gv_q_card-wide': gvSettings.value.fieldType === 'textarea',
        'gv_q_card-narrow': ['text', 'number', 'date'].includes(gvSettings.value.fieldType)
    }
})

</script>

<style scoped>
    .gv_q_card-wide {
        width: 800px;
    }
    .gv_q_card-narrow {
        width: 250px;
    }
</style>
