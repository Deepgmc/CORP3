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
                    <tr
                        v-for="row in data"
                        :key="row[idName]"
                        :data-module="module"
                        :data-action="action"
                        :data-item_id="row[idName]"
                    >
                        <td
                            v-for="col in cols.keys()"
                            :key="col"
                            :align="cols.get(col)!.align"
                            :field_editable="cols.get(col)?.editable"

                            :data-field_name="col"
                            :data-field_type="cols.get(col)?.type"
                            :data-value="row[col]"

                            :class="{gv_editable: cols.get(col)?.editable}"
                            @click="redactField"
                        >
                            {{ cols.get(col)!.switchData ? row[`${col}Value`] : row[col] }}
                        </td>

                        <td
                            v-if="$slots.actions_buttons"
                            class="text-center pointer"
                        >
                            <slot name="actions_buttons" :itemId="row[idName]"></slot>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGVDialog, type TEditTypes } from '@/composables/gridView/redactFieldDialog';
import type { TGridColMap } from './GridColumnOptionTypes';

defineProps<{
    cols  : Map<string, TGridColMap>,
    data  : any,
    idName: string,
    module: string,
    action: string
}>()

const { openGV } = useGVDialog()

/**
 * Передаём данные из ячейки таблицы, которую хотим редактировать в компонент диалога для дальнейшего изменения
 * @param e
 */
function redactField(e: MouseEvent): boolean {
    const target = e.target as HTMLElement
    const pElement = target.parentElement as HTMLElement
    if(!target.classList.contains('gv_editable')){
        return false
    }
    const type: TEditTypes = target.dataset.field_type as TEditTypes ?? 'text';
    openGV({
        val        : target.dataset.value ?? '',
        fieldName  : target.dataset.field_name ?? '',
        module     : pElement.dataset.module ?? '',
        action     : pElement.dataset.action ?? '',
        itemId     : pElement.dataset.item_id ?? '',
        HTMLElement: target,
        fieldType  : type,
    })
    return true
}
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
        border-bottom: 1px solid grey;
    }
    tbody tr td {
        padding: 0px;
        margin: 0px;
    }
    tbody tr td {
        padding: $cellPadding;
        border-right: 1px solid grey;
    }
    tbody tr td:first-of-type {
        border-left: 1px solid grey;
    }

    .gv-edit_buttons {
        font-size: $text18;
    }
    .gv-edit_buttons-negative {
        color: $dark-negative
    }
    .gv-edit_buttons-positive {
        color: $positive
    }

    .gv_editable{
        cursor: text;
    }
    .gv_editable:hover {
        background: rgb(155, 182, 155)
    }
}
</style>
