<template>
    <h4>Склад</h4>
    <add-product-form @add-product="addProduct"></add-product-form>
</template>

<script setup lang="ts">
import type { INewProduct } from '@/interfaces/ProductsDeals';
import AddProductForm from './AddProductForm.vue';
import Product from '@/entities/warehouse/Product';

function addProduct(newProductData: INewProduct): void {
    console.log('newProductData:', newProductData)
    const newProduct = new Product(newProductData)
    console.log('newProduct:', newProduct)
}
</script>
