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
            @click="redactUser"
        />
    </template>
</grid-view>
</template>

<script setup lang="ts">
import GridView from './GridView.vue';
import type { GridCols, GridColsDataTypes } from './GridColsManager';
import { useUserProfileCard } from '@/composables/userProfileCard';

defineEmits(['gv_sort'])

defineProps<{
    gridCols: GridCols,
    sortField: (column: keyof GridColsDataTypes) => void
}>()

const { userCardOpen, setDialogUser } = useUserProfileCard()

function redactUser() {
    setDialogUser({
        username: 'sdfsdf',
        userId: 0,
        birth: 0,
        email: '',
        companyId: null,
        isDirector: false,
        gender: 0,
        bio: '',
        firstName: '',
        lastName: '',
        phone: '',
        departmentId: null,
        company: null,
        skills: [],
        department: null
    })
    userCardOpen()
}
</script>
