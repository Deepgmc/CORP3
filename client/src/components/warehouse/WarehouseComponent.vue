<template>
    <h4>Склад</h4>
    <div
        v-for="product in productsList"
        :key="product.id"
    >
        {{ product.id }} - {{ product.name }}- {{ product.status }}
    </div>
    <add-product-form
        @add-product="addProduct"
        v-model:newProductName="newProductRaw.name"
        v-model:newProductPrice="newProductRaw.price"
        v-model:newProductUnitId="newProductRaw.unitId"
    ></add-product-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { productDummy, type INewProduct } from '@/interfaces/ProductsDeals';
import AddProductForm from './AddProductForm.vue';
import Product from '@/entities/warehouse/Product';
import { Rbac } from '@/entities/Rbac';
import { notifyTypes, useNotify } from '@/composables/notifyQuasar';
const notify = useNotify()
const $um = Rbac.getInstance()

const productsList = ref($um.company.warehouse)

function addProduct(): void {
    newProductRaw.companyId = $um.company.companyId
    const newProduct = new Product(newProductRaw)
    if(!newProduct.checkProductValid()) {
        notify.run('Неверно заполнен продукт', notifyTypes.err)
        return
    }
    newProduct
        .saveModel()
        .then((saveRes) => {
            if(!saveRes.error){
                formReset()
            } else {
                throw new Error(saveRes.errorMessage)
            }
        })
}

const newProductRaw: INewProduct = reactive(productDummy)

function formReset() {
    Object.assign(newProductRaw, productDummy)
}
</script>
