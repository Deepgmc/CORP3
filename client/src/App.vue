<script setup lang="ts">
import { provide } from 'vue'
import NetworkManager from './network/NetworkManager';
import { UserManager } from './entities/UserManager';
import { jwtStrategy } from './auth/strategies/jwt.strategy';
import { useUserStore } from '@/stores/userStore';

const $networkManager = NetworkManager.getInstance()
provide('$networkManager', $networkManager)
const $userManager = UserManager.getInstance(new jwtStrategy($networkManager), useUserStore())
provide('$userManager', $userManager)

</script>

<template>
    <router-view />
</template>
