<template>
    <h4>Сотрудники</h4>
    <grid-view
        v-if="employees && employees.length"
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
import { AuthManager } from '@/auth/AuthManager';
import GridView from '@/components/grid/GridView.vue';
import { employeeAvailableCols } from '@/components/grid/GridColumnOptions'
import { useUserProfileCard } from '@/composables/userProfileCard';
import { GridCols, type GridColsDataTypes } from '../grid/GridCols';

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

const $authManager = AuthManager.getInstance()
const needFields = ['username', 'firstName', 'lastName', 'departmentId', 'birth', 'phone']
const employees = $authManager.company.employees

const gridCols = new GridCols(
    needFields,
    employeeAvailableCols,
    employees,
    'userId',
    'users',
    'user_field',
)


function sortField(column: keyof GridColsDataTypes): void {
    gridCols.sortField(column)
}


// onMounted(async () => {
//     employees.value = modifyGridData([...$authManager.company.employees.value], employeeColsMap)
// })
</script>
