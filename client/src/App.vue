<script setup lang="ts">
import { provide } from 'vue'
import NetworkManager from './network/NetworkManager';
import { jwtStrategy } from './auth/strategies/jwt.strategy';
import { useUserStore } from '@/stores/userStore';
import { Rbac } from './entities/Rbac';
import { useDictStore } from './stores/dictStore';

const $networkManager = NetworkManager.getInstance()
provide('$networkManager', $networkManager)

const $userManager = Rbac.getInstance(new jwtStrategy($networkManager), useUserStore())
provide('$userManager', $userManager)

useDictStore()

</script>

<template>
    <router-view />
</template>
