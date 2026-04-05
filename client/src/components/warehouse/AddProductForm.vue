<template>
<div class="form_container q-mt-md">
    <q-form
        @submit.prevent="handleSubmit"
        class="q-gutter-md"
    >
        <q-input
            v-model="newProductName"
            type="text"
            label="название товара"
            outlined
            dense
            :rules="[
                val => val.length <= 50 && val.length >= 2 || v_msg.WRONG_VALUE
            ]"
        />

        <q-input
            v-model.number="newProductPrice"
            type="number"
            label="цена товара"
            outlined
            dense
            :rules="[
                val => val > 0 || v_msg.WRONG_VALUE
            ]"
        />

        <q-input
            v-model.number="newProductCount"
            type="number"
            label="количество товара"
            outlined
            dense
            :rules="[
                val => val > 0 || v_msg.WRONG_VALUE
            ]"
        />

        <q-select
            v-model.number="newProductUnitId"
            :options="unitOptions"
            label="единица измерения"
            outlined
            dense
            emit-value
            map-options
            :rules="[
                val => !!val || v_msg.WRONG_VALUE
            ]"
        />

        <div class="row justify-end">
            <q-btn
                type="submit"
                color="primary"
                label="Добавить товар"
                icon="save"
                unelevated
            />
        </div>
    </q-form>
</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { v_msg } from '@/utils/constants/texts'
import { useDictStore } from '@/stores/dictStore'
import { getSelectOptionsFromDataArray } from '@/utils/helpers/components'
import type { IUnit } from '@/interfaces/Company'

const newProductName = defineModel<string>('newProductName')
const newProductPrice = defineModel<number>('newProductPrice')
const newProductCount = defineModel<number>('newProductCount')
const newProductUnitId = defineModel<number>('newProductUnitId')
const emit = defineEmits(['add-product'])

const dictStore = useDictStore()

const unitOptions = computed(() =>{
    return getSelectOptionsFromDataArray<IUnit>(dictStore.units, {
        idField: 'id',
        labelField: 'name'
    })
})

function handleSubmit(): void {
    emit('add-product')
}
</script>
