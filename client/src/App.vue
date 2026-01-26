<script setup lang="ts">
import { provide } from 'vue'
import NetworkManager from './network/NetworkManager';
import { AuthManager } from './auth/AuthManager';
import { jwtStrategy } from './auth/strategies/jwt.strategy';
import { useAuthStore } from '@/stores/authStore';

const $networkManager = NetworkManager.getInstance()
provide('$networkManager', $networkManager)
const $authManager = AuthManager.getInstance( new jwtStrategy($networkManager), useAuthStore())
provide('$authManager', $authManager)

</script>

<template>
  <router-view />
</template>

<style lang="scss">
.pointer{
    cursor: pointer
}
</style>
