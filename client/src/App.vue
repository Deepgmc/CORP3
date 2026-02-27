<script setup lang="ts">
import { provide } from 'vue'
import NetworkManager from './network/NetworkManager';
import { jwtStrategy } from './auth/strategies/jwt.strategy';
import { useUserStore } from '@/stores/userStore';
import { Rbac } from './entities/Rbac';

const $networkManager = NetworkManager.getInstance()
provide('$networkManager', $networkManager)

const $userManager = Rbac.getInstance(new jwtStrategy($networkManager), useUserStore())

provide('$userManager', $userManager)

</script>

<template>
    <router-view />
</template>
