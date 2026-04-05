<template>
    <h4>Склад</h4>
    <grid-view-departments
        v-if="productsList && productsList.length"
        :gridCols="gridCols"
        :sortField="gridCols.sortField.bind(gridCols)"
    ></grid-view-departments>

    <add-product-form
        @add-product="addProduct"
        v-model:newProductName="newProductRaw.name"
        v-model:newProductPrice="newProductRaw.price"
        v-model:newProductCount="newProductRaw.count"
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
import { GridCols } from '@/composables/gridView/GridColsManager';
import { warehouseAvailableCols } from '@/composables/gridView/GridColumnOptions';
import GridViewDepartments from '@/components/grid/GridViewDepartments.vue';

const notify = useNotify()
const $um = Rbac.getInstance()

const productsList = ref($um.company.warehouse)
const needFields = ['id', 'name', 'count']

const gridCols = new GridCols(
    needFields,
    warehouseAvailableCols,
    productsList.value,
    'id',
    'company',
    'warehouse',
    8
);

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
