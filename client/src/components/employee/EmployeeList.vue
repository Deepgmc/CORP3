<template>
    <h4>Сотрудники</h4>
    <grid-view-employees
        v-if="employees && employees.length"
        :gridCols="gridCols"
        :sortField="gridCols.sortField.bind(gridCols)"
    ></grid-view-employees>
</template>

<script setup lang="ts">
import GridViewEmployees from '@/components/grid/GridViewEmployees.vue';
import { employeeAvailableCols } from '@/composables/gridView/GridColumnOptions';
import { GridCols } from '@/composables/gridView/GridColsManager';
import { Rbac } from '@/entities/Rbac';
import { inject } from 'vue';
import { rbacSym } from '@/utils/injecttionSymbols';

const $userManager = inject<Rbac>(rbacSym) as Rbac
const needFields = ['username', 'firstName', 'state', 'position', 'skills']
const employees = $userManager.company.employees

const gridCols = new GridCols(
    needFields,
    employeeAvailableCols,
    employees,
    'userId',
    'users',
    'user_field',
    8
);
</script>
