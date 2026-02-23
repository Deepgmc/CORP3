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
import { UserManager } from '@/entities/UserManager';
import { employeeAvailableCols } from '@/components/grid/GridColumnOptions'
import { GridCols } from '../../composables/gridView/GridColsManager'

const $userManager = UserManager.getInstance()
const needFields = ['firstName', 'lastName', 'departmentId', 'birth', 'phone', 'skills']
const employees = $userManager.company.employees

const gridCols = new GridCols(
    needFields,
    employeeAvailableCols,
    employees,
    'userId',
    'users',
    'user_field',
    8
)
</script>
