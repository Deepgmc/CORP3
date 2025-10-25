<script setup lang="ts">
import { provide } from 'vue'
import NetworkManager from './network/NetworkManager';
import { AuthManager } from './auth/AuthManager';
import { jwtStrategy } from './auth/strategies/jwt.strategy';
import { useAuthStore } from './stores/auth';
// const route = useRoute()
// import { useRouter } from 'vue-router'
// const router = useRouter()
// const isLoaded = ref(true)
// if(!isLoaded.value){
//   router.push({path: '/auth', replace: true})
// } else {
//   router.push({path: '/', replace: true})
// }

//.lintstagetrc: "npm run test:unit --prefix ./client"

const authStore = useAuthStore()

provide('$networkManager', NetworkManager.getInstance())
provide('$authManager', AuthManager.getInstance( new jwtStrategy(NetworkManager.getInstance()), authStore) )
</script>

<template>
  <router-view />
</template>

<style lang="scss">
</style>
