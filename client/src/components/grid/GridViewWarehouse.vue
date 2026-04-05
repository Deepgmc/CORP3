<template>
    <grid-view
        :gridCols="gridCols"
        @gv_sort="sortField"
    >
        <template #actions_caption>
            <q-icon
                class="gv-edit_buttons-negative"
                name="edit"
            />
        </template>

        <template #actions_buttons="slotProps">
            <q-icon
                class="gv-edit_buttons-negative"
                name="delete_forever"
                @click="deleteDepartment"
                :size="'sm'"
                :data-itemId="slotProps.itemId"
            />
        </template>
    </grid-view>
</template>

<script setup lang="ts">
import GridView from './GridView.vue';
import type { GridCols, GridColsDataTypes } from '@/composables/gridView/GridColsManager';

defineEmits(['gv_sort'])

defineProps<{
    gridCols: GridCols,
    sortField: (column: keyof GridColsDataTypes) => void
}>()

async function deleteDepartment(e: MouseEvent) {
    if (!(e.target instanceof HTMLElement) || typeof e.target.dataset.itemid === 'undefined') return
    const itemId: number = Number.parseInt(e.target.dataset.itemid)
    console.log('Store deleting item id:', itemId)

}
</script>
