<template>
    <h3>Departments page</h3>
    <grid-view
        v-if="departments && departments.length"
        :cols="departmentColsMap"
        :data="departments"
        :idName="'id'"
    >
    </grid-view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import GridView from './grid/GridView.vue';
import { AuthManager } from '@/auth/AuthManager';
import { RESPONSE_STATUS_CODES } from '@/constants';
import type { IDepartment } from '@/interfaces/Company';
import { modifyGridData, setColsMap, departmentBaseMap, departmentAvailableCols } from '@/components/grid/GridColumnOptionTypes';

const departments = ref<IDepartment[] | null>(null)

const needFields = ['id', 'name', 'description']
const departmentColsMap = setColsMap(needFields, departmentBaseMap, departmentAvailableCols)

onMounted(async () => {
    const $authManager = AuthManager.getInstance()
    const res = await $authManager.company.getFullDepartmetsList()
    if(res.status === RESPONSE_STATUS_CODES.CREATED || res.status === RESPONSE_STATUS_CODES.SUCCESS) {
        departments.value = modifyGridData([...res.data], departmentColsMap)
    }
})
</script>
