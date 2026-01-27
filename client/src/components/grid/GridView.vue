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
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in dataArray" :key="row[idName]">
                        <td v-for="col in cols.keys()" :key="col" :align="cols.get(col)!.align">
                            {{ row[col] }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import type { TGridColMap } from './GridColumnOptionTypes';

const props = defineProps<{
    cols: Map<string, TGridColMap>,
    data  : any,
    idName: string
}>()

const dataArray = ref<any>(props.data)

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
}
</style>
