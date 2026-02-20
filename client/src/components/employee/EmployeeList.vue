<template>
    <h4>Сотрудники</h4>
    <grid-view-employees
        v-if="employees && employees.length"
        :gridCols="gridCols"
        :sortField="sortField"
    ></grid-view-employees>
</template>

<script setup lang="ts">
import GridViewEmployees from '../grid/GridViewEmployees.vue';
import { AuthManager } from '@/auth/AuthManager';
import { employeeAvailableCols } from '@/components/grid/GridColumnOptions'
import { GridCols, type GridColsDataTypes } from '../grid/GridCols'

const $authManager = AuthManager.getInstance()
const needFields = ['username', 'firstName', 'lastName', 'departmentId', 'birth', 'phone']
const employees = $authManager.company.employees

const gridCols = new GridCols(
    needFields,
    employeeAvailableCols,
    employees,
    'userId',
    'users',
    'user_field',
)

function sortField(column: keyof GridColsDataTypes): void {
    gridCols.sortField(column)
}
</script>
