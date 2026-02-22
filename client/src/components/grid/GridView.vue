<template>
    <div class="row justify-center">
        <div class="col col-grow">
            <table class="gv_table">
                <thead>
                    <tr>
                        <th
                            class="thead_th"
                            v-for="col in cols.keys()"
                            :key="col"
                            @click="$emit('gv_sort', col)"
                        >
                            {{ cols.get(col)!.label }}
                            <q-icon
                                class="pointer"
                                :name="getSortIconName(col)"
                            />
                        </th>

                        <th v-if="$slots.actions_caption" class="text-center">
                            <slot name="actions_caption"></slot>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <!-- @vue-ignore --><!-- проблема с типизацией key -->
                    <tr
                        v-for="row in currentPageData"
                        :key="row[gridCols.idName as keyof GridColsDataTypes]"
                        :data-module="gridCols.module"
                        :data-action="gridCols.action"
                        :data-item_id="row[gridCols.idName as keyof GridColsDataTypes]"
                    >
                        <td
                            v-for="col in cols.keys()"
                            :key="col"
                            :align="cols.get(col)!.align"
                            :field_editable="cols.get(col)?.editable"

                            :data-field_name="col"
                            :data-field_type="cols.get(col)?.type"
                            :data-value="row[col as keyof GridColsDataTypes]"

                            :class="{gv_editable: cols.get(col)?.editable}"
                            @click="redactField"
                        >
                            {{ cols.get(col)!.switchData ? row[`${col}Value` as keyof GridColsDataTypes] : row[col as keyof GridColsDataTypes] }}
                        </td>

                        <td
                            v-if="$slots.actions_buttons"
                            class="text-center pointer"
                        >
                            <slot name="actions_buttons" :itemId="row[gridCols.idName as keyof GridColsDataTypes]"></slot>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="row q-mt-xs justify-end">
                <q-btn
                    v-if="leftSideNums.length > 0"
                    class="q-ma-xs"
                    size="sm"
                    color="secondary"
                    text-color="warning"
                    round
                    icon="arrow_circle_left"
                    @click="decreasePage"
                />

                <div v-if="leftSideNums.length === 2 && currentPage > 3" class="row items-end">...</div>

                <q-btn
                    v-for="p in leftSideNums"
                    :key="p"
                    class="q-ma-xs"
                    size="sm"
                    color="yellow-3"
                    text-color="secondary"
                    round
                    :label="p"
                    @click="clickPageBtn(p)"
                />

                <q-btn
                    class="q-ma-xs"
                    size="sm"
                    color="yellow-3"
                    text-color="red"
                    round
                    :label="currentPage"
                />

                <q-btn
                    v-for="p in rightSideNums"
                    :key="p"
                    class="q-ma-xs"
                    size="sm"
                    color="yellow-3"
                    text-color="secondary"
                    round
                    :label="p"
                    @click="clickPageBtn(p)"
                />

                <div v-if="rightSideNums.length === 2 && currentPage + 2 < pagesCount" class="row items-end">...</div>

                <q-btn
                    v-if="currentPage <= pagesCount - 1"
                    class="q-ma-xs"
                    size="sm"
                    color="secondary"
                    text-color="warning"
                    round
                    icon="arrow_circle_right"
                    @click="increasePage"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGVDialog, type TEditTypes } from '@/composables/gridView/redactFieldDialog';
import type { GridCols, GridColsDataTypes, TColsMap } from '@/composables/gridView/GridColsManager';

defineEmits(['gv_sort'])

const props = defineProps<{
    gridCols: GridCols
}>()

const { openGV } = useGVDialog()

const cols: TColsMap = props.gridCols.getColsMap()
const currentPageData = props.gridCols.currentPageData





const currentPage = props.gridCols.currentPage
const pagesCount = props.gridCols.pagesCount
const leftSideNums = props.gridCols.leftSideNums
const rightSideNums = props.gridCols.rightSideNums

function decreasePage(){
    props.gridCols.setCurrentPage(currentPage.value - 1)
}
function increasePage(){
    props.gridCols.setCurrentPage(currentPage.value + 1)
}
function clickPageBtn(page: number){
    props.gridCols.setCurrentPage(page)
}


/**
 * Передаём данные из ячейки таблицы, которую хотим редактировать в компонент диалога для дальнейшего изменения
 * @param e MouseEvent
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

function getSortIconName(col: string){
    const defaultVal = 'swap_vert'
    const thisCol = cols.get(col)
    if(thisCol === undefined) return ''
    if(thisCol.order === undefined) return ''

    if(thisCol.order === -1) return defaultVal
    if(thisCol.order === 1) return 'south'
    else return 'north'
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
        min-width: 60px;
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
