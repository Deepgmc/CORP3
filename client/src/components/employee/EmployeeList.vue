<template>
    <h4>Сотрудники</h4>
    <grid-view
        v-if="employees && employees.length"
        :cols="employeeColsMap"
        :data="employees"
        :idName="'userId'"
        module="users"
        action="user_field"
    ></grid-view>
</template>

<script setup lang="ts">
import { AuthManager } from '@/auth/AuthManager';
import GridView from '@/components/grid/GridView.vue';
import type { IUser } from '@/interfaces/User';
import { onMounted, ref } from 'vue';
import { setColsMap, employeeBaseMap, modifyGridData, employeeAvailableCols } from '@/components/grid/GridColumnOptionTypes'

const $authManager = AuthManager.getInstance()
const needFields = ['username', 'companyId', 'departmentId', 'firstName', 'lastName', 'birth', 'phone', 'reg_date', 'bio']
const employeeColsMap = setColsMap(needFields, employeeBaseMap, employeeAvailableCols)

const employees = ref<IUser[] | null>(null)

onMounted(async () => {
    employees.value = modifyGridData([...$authManager.company.employees], employeeColsMap)
})
</script>
