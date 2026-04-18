<template>
<q-layout view="lHh lpR FFF">
    <q-header reveal class="text-black bg-brown-9 top-main-header" bordered>
        <q-toolbar>
            <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
            <q-toolbar-title>
                {{ thisUser.username }} : {{ thisUser.company?.name }}
            </q-toolbar-title>
            <q-btn @click="logout" class="text-blue-10">Выйти</q-btn>
        </q-toolbar>
    </q-header>

    <!-- :mini="miniState"    @mouseenter="miniState = false"  @mouseleave="miniState = true"       mini-to-overlay-->
    <q-drawer
        show-if-above
        side="left"
        :width="200"
        class="bg-brown-9 left-main-drawer"
        v-model="leftDrawerOpen"
    >
        <q-scroll-area class="fit">
            <q-list class="menu-list">
                <q-item to="/profile" active-class="text-blue-9">
                    <q-item-section avatar>
                        <q-icon name="home" />
                    </q-item-section>
                    <q-item-section id="sdfsdfsdf">
                        Мой профиль
                    </q-item-section>
                </q-item>
<!-- --------------------------------- -->
                <q-item to="/company" active-class="text-blue-9">
                    <q-item-section avatar>
                        <q-icon name="apartment" />
                    </q-item-section>
                    <q-item-section>
                        Компания
                    </q-item-section>
                </q-item>
                    <q-item to="/departments" active-class="text-blue-9" dense>
                        <q-item-section class="text-right" dense>
                            <div class="sub-item q-mr-lg">Департаменты</div>
                        </q-item-section>
                    </q-item>

                    <q-item to="/employee" active-class="text-blue-9" dense>
                        <q-item-section class="text-right q-ml-xl" dense>
                            <div class="sub-item q-mr-lg">Сотрудники</div>
                        </q-item-section>
                    </q-item>
<!-- --------------------------------- -->
                <q-item to="/deals" active-class="text-blue-9">
                    <q-item-section avatar>
                        <q-icon name="handshake" />
                    </q-item-section>
                    <q-item-section>
                        Сделки
                    </q-item-section>
                </q-item>

                <q-item to="/warehouse" active-class="text-blue-9">
                    <q-item-section avatar>
                        <q-icon name="warehouse" />
                    </q-item-section>
                    <q-item-section>
                        Склад
                    </q-item-section>
                </q-item>

                <q-item to="/stats" active-class="text-blue-9">
                    <q-item-section avatar>
                        <q-icon name="assessment" />
                    </q-item-section>
                    <q-item-section>
                        Статистика
                    </q-item-section>
                </q-item>
            </q-list>
        </q-scroll-area>
    </q-drawer>

    <q-page-container>
        <q-page class="q-pa-xs">
            <div class="row justify-center">
                <div class="col-xs-12 col-sm-8 col-md-8 col-lg-8 card_block">
                    <router-view />
                </div>
            </div>
        </q-page>

        <grid-view-change-dialog></grid-view-change-dialog>
    </q-page-container>
</q-layout>

<employee-profile-card v-if="isUserProfileCardOpened"></employee-profile-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { inject, ref } from 'vue'
import GridViewChangeDialog from '@/components/GridViewChangeDialog.vue'
import EmployeeProfileCard from '@/components/profile/EmployeeProfileCard.vue'
import { Rbac } from '@/entities/Rbac'
import { useUserProfileCard } from '@/composables/userProfileCard'
import { rbacSym } from '@/utils/injecttionSymbols'

const { isUserProfileCardOpened } = useUserProfileCard()

const router = useRouter()
const $userManager = inject<Rbac>(rbacSym) as Rbac
const leftDrawerOpen = ref<boolean>(true)
const thisUser = $userManager.getUser()

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
}

function logout() {
    if ($userManager.logOut()) {
        $userManager.setRouterAfterLogOut(router)
    }
}

</script>

<style lang="scss">
//@use '@/assets/globalVariables.scss' as globals;
.top-main-header{
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.5);
}
.left-main-drawer{
    border-right: 3px solid grey;
}
.sub-item {
    font-size: $text12;
}
</style>
