import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Corp3Layout from '@/views/Corp3Layout.vue'
// import AuthView from '@/views/AuthLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'indexLogined',
    component: Corp3Layout,
    children: [
    {
        path: 'main',
        name: 'main',
        component: () => import('@/views/pages/MainView.vue'),
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

    ]
  },

  {
        path: '/auth',
        name: 'auth',
        component: () => import('@/views/AuthLayout.vue'),
        // component: AuthView,
        children: [
        {
            path: 'login',
            name: 'login',
            component: () => import('@/views/auth/AuthLoginView.vue'),
          },

          {
            path: 'register',
            name: 'register',
            component: () => import('@/views/auth/AuthRegisterView.vue'),
          },
        ]
      }

];

const isLogined = false


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach((to, _from, next) => {
  console.log('%c beforeEach to:', 'color:rgb(182, 86, 158);', to)
  if (!isLogined && to.name !== 'login' && to.name !== 'register') {
    next('/auth/login')
  } else {
    next()
  }
})

export default router
