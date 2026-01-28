<template>
    <div class="row justify-center">
        <div class="col col-grow">
            <table class="gv_table">
                <thead>
                    <tr>
                        <th
                            class="thead_th pointer"
                            v-for="col in cols.keys()"
                            :key="col"
                            :align="cols.get(col)!.align"
                        >
                            {{ cols.get(col)!.label }}
                        </th>
                        <th v-if="$slots.actions_caption" class="text-center">
                            <slot name="actions_caption"></slot>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in data" :key="row[idName]">
                        <td v-for="col in cols.keys()" :key="col" :align="cols.get(col)!.align">
                            {{ cols.get(col)!.switchData ? row[`${col}Value`] : row[col] }}
                        </td>
                        <td v-if="$slots.actions_buttons" class="text-center pointer">
                            <slot name="actions_buttons" :itemId="row[idName]"></slot>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">

import type { TGridColMap } from './GridColumnOptionTypes';

defineProps<{
    cols: Map<string, TGridColMap>,
    data  : any,
    idName: string
}>()
</script>




<style lang="scss">
$cellPadding: 5px;

.gv_table{
    width:100%;
    border-spacing: 0px;
    border-collapse: collapse;

    thead th, thead tr {
        padding: 0px;
        border-bottom: 1px solid blue;
    }
    thead th {
        padding: $cellPadding;
    }
    tbody tr {
        border-bottom: 1px solid green;
    }
    tbody tr td {
        padding: 0px;
        margin: 0px;
    }
    tbody tr td {
        padding: $cellPadding;
    }

    .gv-edit_buttons{
        font-size: $text18;
        color: $dark-negative;
    }
}
</style>
