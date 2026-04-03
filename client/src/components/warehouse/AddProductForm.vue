<template>
<div class="form_container q-mt-md">
    <q-form
        @submit.prevent="addProduct"
        class="q-gutter-md"
    >
        <q-input
            v-model="newProductName"
            type="text"
            label="название товара"
            outlined
            dense
            :rules="[
                val => val.length <= 50 || v_msg.WRONG_VALUE
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
import { v_msg } from '@/utils/constants/texts'

const newProductName = defineModel<string>('newProductName')
const emit = defineEmits(['add-product'])

function addProduct(): void {
    emit('add-product')
}
</script>
