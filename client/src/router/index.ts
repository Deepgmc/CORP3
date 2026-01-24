import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Corp3Layout from '@/views/Corp3Layout.vue'

import AuthLayout from '@/views/AuthLayout.vue'
import AuthLogin from '@/components/auth/AuthLogin.vue'
import AuthRegister from '@/components/auth/AuthRegister.vue'
import { AuthManager } from '@/auth/AuthManager'

//import ProfileView from '@/views/pages/ProfileView.vue'


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
        path: 'stats', // страница статистики
        name: 'stats',
        component: () => import('@/views/pages/StatsView.vue'),
      },

      {
        path: 'company',
        name: 'company',
        component: () => import('@/views/pages/CompanyView.vue'),
      },

      {
        path: 'employee',
        name: 'employee',
        component: () => import('@/views/pages/EmployeeView.vue'),
      },

      {
        path: 'departments',
        name: 'departments',
        component: () => import('@/views/pages/DepartmentsView.vue'),
      },

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
//console.log('isLogined at router:', isLogined)


router.beforeEach((to, _from, next) => {
  isLogined = AuthManager.isLoginedByJWTToken()
  //console.log('isLogined at befreEach:', isLogined)
  if (!isLogined && to.name !== 'login' && to.name !== 'register') {
    next('/auth/login')
  } else {
    next()
  }
})

export default router
