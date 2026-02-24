<template>
<grid-view
    :gridCols="gridCols"
    @gv_sort="sortField"
>
    <template #actions_caption>
        <q-icon class="gv-edit_buttons-positive" name="edit" />
    </template>

    <template #actions_buttons="slotProps">
        <q-icon
            class="gv-edit_buttons-positive"
            name="settings"
            :data-userId="slotProps.itemId"
            @click="openEmployeeCard(slotProps.itemId)"
        />
    </template>

    <template #field_components="slotProps">
        <!-- @vue-ignore --><!--skills ??? -->
        <user-skills
            v-if="slotProps.col === 'skills'"
            :skills="slotProps.value"
            :needAssession="false"
            :maxQuantity="3"
            :size="'sm'"
            :removable="false"
        ></user-skills>
    </template>
</grid-view>
</template>

<script setup lang="ts">
import GridView from './GridView.vue'
import type { GridCols, GridColsDataTypes } from '@/composables/gridView/GridColsManager'
import { useUserProfileCard } from '@/composables/userProfileCard'
import UserSkills from '@/components/UserSkills.vue'

defineEmits(['gv_sort'])

defineProps<{
    gridCols: GridCols,
    sortField: (column: keyof GridColsDataTypes) => void
}>()

const { openUserCard, loadUserCardData } = useUserProfileCard()

function openEmployeeCard(userId: number | null): void {
    if(userId === null) return
    loadUserCardData(userId)
        .then(() => {
            openUserCard()
        })
}
</script>
