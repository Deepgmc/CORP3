<template>
    <q-dialog v-model="isUserProfileCardOpened">
        <q-card class="q-pa-lg">
            UserProfileCard
            <div>{{ dialogUser?.username }}</div>
            <div>{{ dialogUser?.gender }}</div>
        </q-card>
    </q-dialog>
</template>



<script lang="ts" setup>
import { useUserProfileCard } from '@/composables/userProfileCard';

const { isUserProfileCardOpened, dialogUser } = useUserProfileCard()
</script>
