<template>
    <h4>Сотрудники</h4>
    <grid-view-employees
        v-if="employees && employees.length"
        :gridCols="gridCols"
        :sortField="gridCols.sortField.bind(gridCols)"
    ></grid-view-employees>
</template>

<script setup lang="ts">
import GridViewEmployees from '../grid/GridViewEmployees.vue';
import { AuthManager } from '@/auth/AuthManager';
import { employeeAvailableCols } from '@/components/grid/GridColumnOptions'
import { GridCols } from '../grid/GridCols'

const $authManager = AuthManager.getInstance()
const needFields = ['userId', 'username', 'firstName', 'lastName', 'departmentId', 'birth', 'phone']
const employees = $authManager.company.employees

const gridCols = new GridCols(
    needFields,
    employeeAvailableCols,
    employees,
    'userId',
    'users',
    'user_field',
)
</script>
