<template>
    <h3>Departments page</h3>
    <div v-for="dept of departments" :key="dept.id">{{ dept.name }}</div>
    <grid-view
        cols="cols"
        data="departments"
    >
    </grid-view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import GridView from './grid/GridView.vue'
import { AuthManager } from '@/auth/AuthManager';
import { RESPONSE_STATUS_CODES } from '@/constants';
import type { IDepartment } from '@/interfaces/Company';

const departments = ref<IDepartment[]>()

onMounted(async () => {
    const $authManager = AuthManager.getInstance()
    const res = await $authManager.company.getFullDepartmetsList()
    if(res.status === RESPONSE_STATUS_CODES.CREATED || res.status === RESPONSE_STATUS_CODES.SUCCESS){
        departments.value = res.data
    }
})
</script>
