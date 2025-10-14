<template>
  <q-layout view="lHh lpR FFF">
    <q-header reveal class="text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          Corp3 Layout header caption
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/main" label="Main" />
        <q-route-tab to="/company" label="Company" />
        <q-route-tab to="/employee" label="Employee" />
      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" class="bg-dark">
      <q-scroll-area class="fit">
          <q-list padding class="menu-list">
            <q-item clickable v-ripple to="/main">
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
              <q-item-section>
                Статистика
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/company">
              <q-item-section avatar>
                <q-icon name="apartment" />
              </q-item-section>
              <q-item-section>
                Моя компания
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/employee">
              <q-item-section avatar>
                <q-icon name="people" />
              </q-item-section>
              <q-item-section>
                Сотрудники
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

  const leftDrawerOpen = ref(true)

  function toggleLeftDrawer () {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }
</script>

<style lang="scss">

</style>
