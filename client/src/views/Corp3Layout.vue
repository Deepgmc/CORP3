<template>
  <q-layout view="hHh lpR FFF" class="bg-grey">
    <q-header reveal class="text-black bg-orange-6" bordered>
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          Ваша компания: {{ $authManager.user.username }}
        </q-toolbar-title>
        <q-btn @click="logout" class="text-blue-10">Выйти</q-btn>
      </q-toolbar>

      <!-- <q-tabs align="left">
        <q-route-tab to="/main" label="Main" />
        <q-route-tab to="/company" label="Company" />
        <q-route-tab to="/employee" label="Employee" />
      </q-tabs> -->
    </q-header>

    <!-- mini -->
    <q-drawer
      mini-to-overlay
      show-if-above
      side="left"

      :mini="miniState"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"

      class="bg-brown-3"
      v-model="leftDrawerOpen"
      >
      <q-scroll-area class="fit">
          <q-list padding class="menu-list">
            <q-item v-ripple to="/profile" active-class="text-blue-9">
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
              <q-item-section>
                Мой профиль
              </q-item-section>
            </q-item>

            <q-item v-ripple to="/main" active-class="text-blue-9">
              <q-item-section avatar>
                <q-icon name="assessment" />
              </q-item-section>
              <q-item-section>
                Статистика
              </q-item-section>
            </q-item>

            <q-item v-ripple to="/company" active-class="text-blue-9">
              <q-item-section avatar>
                <q-icon name="apartment" />
              </q-item-section>
              <q-item-section>
                Компания
              </q-item-section>
            </q-item>

            <q-item v-ripple to="/employee" active-class="text-blue-9">
              <q-item-section avatar>
                <q-icon name="people" />
              </q-item-section>
              <q-item-section>
                Сотрудники
              </q-item-section>
            </q-item>

            <q-item v-ripple to="/departments" active-class="text-blue-9">
              <q-item-section avatar>
                <q-icon name="assignment" />
              </q-item-section>
              <q-item-section>
                Департаменты
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
    </q-drawer>

    <q-page-container class="bg-grey">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { AuthManager } from '@/auth/AuthManager'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const $authManager = AuthManager.getInstance()
const leftDrawerOpen = ref(true)
const miniState = ref(true)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function logout(){
  if($authManager.logOut()){
    $authManager.setRouterAfterLogOut(router)
  }
}
</script>

<style lang="scss">

</style>
