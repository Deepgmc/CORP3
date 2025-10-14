<template>
  <q-layout view="lHh lpR FFF">
    <q-header reveal class="text-white">
      <q-toolbar>
        <q-toolbar-title>
          Авторизация
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above side="left" class="bg-dark">
      <q-scroll-area class="fit">
          <q-list padding class="menu-list">
            <q-item clickable v-ripple to="/auth/login">
              <q-item-section avatar>
                <q-icon name="login" />
              </q-item-section>
              <q-item-section>
                Войти
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/auth/register">
              <q-item-section avatar>
                <q-icon name="note_add" />
              </q-item-section>
              <q-item-section>
                Регистрация
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
