<!-- <q-icon name="note_add" /> <q-icon name="login" />-->
<template>
<q-layout view="HHH lpR lFr">
    <q-header align="center" class="bg-blue-9 text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <q-icon name="login" />
          </q-avatar>
          Авторизация
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="center">
        <q-route-tab :to="{name: 'login'}" label="Вход"></q-route-tab>
        <q-route-tab :to="{name: 'register'}" label="Регистрация"></q-route-tab>
      </q-tabs>
    </q-header>

    <q-page-container>
      <q-page>
        <div class="row">
          <div class="col-sm-3 col-md-4 col-xl-5 col-xs-12"></div>
          <div class="col-sm-6 col-md-4 col-xl-2 col-xs-12" align="center">
            <!-- <Suspense>
              <template #default>
                <router-view />
              </template>
              <template #fallback>
                <div>Загрузка...</div>
              </template>
            </Suspense> -->
            <router-view />
          </div>
          <div class="col-sm-3 col-md-4 col-xl-5 col-xs-12"></div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
