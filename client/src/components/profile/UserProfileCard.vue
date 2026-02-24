<template>
    <q-dialog v-model="isUserProfileCardOpened">
        <q-card class="q-pa-lg">
            <div>{{ dialogUser?.username }}</div>
            <div>{{ dialogUser?.firstName }}</div>
            <div>{{ dialogUser?.lastName }}</div>
            <div>{{ dialogUser?.bio }}</div>
            <div>birth: {{ dialogUser?.birth }}</div>
            <div>deptId: {{ dialogUser?.departmentId }}</div>
            <div>comId: {{ dialogUser?.companyId }}</div>
            <div>{{ dialogUser?.phone }}</div>
            <div>{{ dialogUser?.skills }}</div>
        </q-card>
    </q-dialog>
</template>



<script lang="ts" setup>
import { useUserProfileCard } from '@/composables/userProfileCard';

const { isUserProfileCardOpened, dialogUser } = useUserProfileCard()
</script>
