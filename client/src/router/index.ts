import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Corp3Layout from '@/views/Corp3Layout.vue'

import AuthLayout from '@/views/AuthLayout.vue'
import AuthLogin from '@/components/auth/AuthLogin.vue'
import AuthRegister from '@/components/auth/AuthRegister.vue'
import { AuthManager } from '@/auth/AuthManager'

//import ProfileView from '@/views/pages/ProfileView.vue'
// import DepartmentsView from '@/views/pages/DepartmentsView.vue'


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'indexLogined',
        component: Corp3Layout,
        children: [
            {
                path: 'profile',
                name: 'profile',
                //component: ProfileView,
                component: () => import('@/views/pages/ProfileView.vue'),
            },

            {
                path: 'company',
                name: 'company',
                component: () => import('@/views/pages/CompanyView.vue'),
            },

            {
                path: 'departments',
                name: 'departments',
                //component: DepartmentsView,
                component: () => import('@/views/pages/DepartmentsView.vue'),
            },

            {
                path: 'employee',
                name: 'employee',
                component: () => import('@/views/pages/EmployeeView.vue'),
            },

            {
                path: 'stats', // страница статистики
                name: 'stats',
                component: () => import('@/views/pages/StatsView.vue'),
            },

            //   { ДЛЯ ПРИМЕРА
            //     path: 'admin',
            //     name: 'admin',
            //     meta: { requiresAuth: true, adminOnly: true },
            //     component: () => import('@/views/pages/Admin.vue'),
            //   },

        ]
    },





    {
        path: '/auth',
        name: 'auth',
        //component: () => import('@/views/AuthLayout.vue'),
        component: AuthLayout,
        children: [
            {
                path: 'login',
                name: 'login',
                //component: () => import('@/components/auth/AuthLogin.vue'),
                component: AuthLogin,
            },

            {
                path: 'register',
                name: 'register',
                //component: () => import('@/components/auth/AuthRegister.vue'),
                component: () => AuthRegister,
            },
        ]
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
})

let isLogined = AuthManager.isLoginedByJWTToken()


router.beforeEach((to, _from, next) => {
    isLogined = AuthManager.isLoginedByJWTToken()
    if (!isLogined && to.name !== 'login' && to.name !== 'register') {
        next('/auth/login')
    } else {
        if(to.name === 'indexLogined') { next('/profile') }
        next()
    }
    // USE META
    // const userStore = useUserStore()
    // if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    //     next({ name: 'login' })
    // } else if (to.meta.adminOnly && !userStore.isAdmin) {
    //     next({ name: 'forbidden' })
    // } else {
    //     next()
    // }
})

export default router
