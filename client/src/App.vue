<script setup lang="ts">
    import { provide } from 'vue';
    import NetworkManager from './network/NetworkManager';
    import { jwtStrategy } from './auth/strategies/jwt.strategy';
    import { useUserStore } from '@/stores/userStore';
    import { Rbac } from './entities/Rbac';
    import { useDictStore } from './stores/dictStore';
    import { nmSym, rbacSym } from './utils/injecttionSymbols';

    const $networkManager = NetworkManager.getInstance()

    provide<NetworkManager>(nmSym, $networkManager)
    provide<Rbac>(rbacSym, Rbac.getInstance(new jwtStrategy($networkManager), useUserStore()))

    useDictStore()
</script>

<template>
    <router-view />
</template>
