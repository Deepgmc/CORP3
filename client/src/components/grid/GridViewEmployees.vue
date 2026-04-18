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
            size="md"
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
import { inject } from 'vue'
import { R_ACTIONS, R_ENTITIES, R_FIELDS, type Rbac } from '@/entities/Rbac'
import { notifyTypes, useNotify } from '@/composables/notifyQuasar'
import { ACCESS_DENIED } from '@/utils/constants/texts'
import { rbacSym } from '@/utils/injecttionSymbols'


const notify = useNotify()
defineEmits(['gv_sort'])

const $userManager = inject<Rbac>(rbacSym) as Rbac

defineProps<{
    gridCols: GridCols,
    sortField: (column: keyof GridColsDataTypes) => void
}>()

const { openUserCard, loadUserCardData } = useUserProfileCard()

async function openEmployeeCard(userId: number | null): Promise<void> {
    if(userId === null || $userManager === undefined) return
    if(!$userManager.can(R_ENTITIES.EMPLOYEE)(R_ACTIONS.VIEW)(R_FIELDS.ENTIRE)) {
        notify.run(ACCESS_DENIED, notifyTypes.err)
        return
    }
    await loadUserCardData(userId)
        .then(() => {
            openUserCard()
        })
}
</script>
