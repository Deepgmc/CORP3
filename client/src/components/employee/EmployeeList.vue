<template>
    <h4>Сотрудники</h4>
    <grid-view
        v-if="employees && employees.length"
        :cols="employeeColsMap"
        :data="employees"
        :idName="'userId'"
        module="users"
        action="user_field"
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
import type { IUser } from '@/interfaces/User';
import { onMounted, ref } from 'vue';
import { setColsMap, employeeBaseMap, modifyGridData, employeeAvailableCols } from '@/components/grid/GridColumnOptionTypes'
import { useUserProfileCard } from '@/composables/userProfileCard';

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
const employeeColsMap = setColsMap(needFields, employeeBaseMap, employeeAvailableCols)

const employees = ref<IUser[] | null>(null)

onMounted(async () => {
    employees.value = modifyGridData([...$authManager.company.employees.value], employeeColsMap)
})
</script>
