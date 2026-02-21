<template>
<grid-view
    :gridCols="gridCols"
    @gv_sort="sortField"
>
    <template #actions_caption>
        <q-icon class="gv-edit_buttons-negative" name="edit" />
    </template>

    <template #actions_buttons="slotProps">
        <q-icon
            class="gv-edit_buttons-negative"
            name="delete_forever"
            @click="deleteDepartment"
            :data-itemId="slotProps.itemId"
        />
    </template>
</grid-view>
</template>

<script setup lang="ts">
import GridView from './GridView.vue';
import { AuthManager } from '@/auth/AuthManager';
import { notifyTypes, useNotify } from '@/composables/notifyQuasar';
import { CANT_DELETE, DELETE_ERROR } from '@/utils/constants/texts';
import type { GridCols, GridColsDataTypes } from './GridColsManager';

defineEmits(['gv_sort'])

defineProps<{
    gridCols: GridCols,
    sortField: (column: keyof GridColsDataTypes) => void
}>()

const notify = useNotify()
async function deleteDepartment(e: MouseEvent) {
    if(!(e.target instanceof HTMLElement) || typeof e.target.dataset.itemid === 'undefined') return
    const itemId: number = Number.parseInt(e.target.dataset.itemid)
    if(Number.isNaN(itemId)) {
        notify.run(DELETE_ERROR, notifyTypes.err)
    } else if(!await AuthManager.getInstance().company.deleteDepartment(itemId)) {
        notify.run(`${CANT_DELETE}, в департаменте есть сотрудники`, notifyTypes.err)
    }
}
</script>
