<template>
<div class="form_container q-mt-md">
    <q-form @submit.prevent="addProduct" class="q-gutter-md">
        <q-input
            v-model="newProduct.name"
            type="text"
            label="название товара"
            outlined
            dense
            :rules="[
                val => !!val || v_msg.REQUIRED,
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
import { reactive } from 'vue';
import { productStatesNames, type INewProduct } from '@/interfaces/ProductsDeals';
import { v_msg } from '@/utils/constants/texts';

const emit = defineEmits(['add-product'])
const newProduct: INewProduct = reactive({
    name: '',
    status: productStatesNames.inStock
})

function addProduct(): void {
    emit('add-product', newProduct)
    newProduct.name = ''
}
</script>
