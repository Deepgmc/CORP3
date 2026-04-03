<template>
    <h4>Склад</h4>
    <div
        v-for="product in productsList"
        :key="product.id"
    >
        {{ product.id }} - {{ product.name }}
    </div>
    <add-product-form
        @add-product="addProduct"
        v-model:newProductName="newProductRaw.name"
    ></add-product-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { productStatesNames, type INewProduct } from '@/interfaces/ProductsDeals';
import AddProductForm from './AddProductForm.vue';
import Product from '@/entities/warehouse/Product';
import { Rbac } from '@/entities/Rbac';
import { notifyTypes, useNotify } from '@/composables/notifyQuasar';
const notify = useNotify()
const $um = Rbac.getInstance()

const productsList = ref($um.company.warehouse)

function addProduct(): void {
    newProductRaw.companyId = $um.company.companyId
    if(!checkProductValid()){
        notify.run('Неверно заполнен продукт', notifyTypes.err)
        return
    }
    new Product(newProductRaw)
        .saveModel()
        .then((saveRes) => {
            if(!saveRes.error){
                formReset()
            } else {
                throw new Error(saveRes.errorMessage)
            }
        })
}

const newProductRaw: INewProduct = reactive({
    name     : '',
    companyId: null,
    status   : productStatesNames.inStock
})

function checkProductValid(){
    return newProductRaw.name.length > 0 && newProductRaw.companyId !== null
}

function formReset() {
    newProductRaw.name = ''
    newProductRaw.companyId = null
}
</script>
