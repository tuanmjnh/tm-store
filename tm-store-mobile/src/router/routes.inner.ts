import type { RouteRecordRaw } from 'vue-router'
import Layout from "@/layouts/index.vue";
const { VITE_APP_HOME_PATH } = import.meta.env
/* Some fixed routes in the page, error pages, etc. */
export const rootRoute: RouteRecordRaw = {
  path: '/appRoot',
  name: 'appRoot',
  redirect: VITE_APP_HOME_PATH,
  component: Layout,
  meta: {
    title: '',
    icon: 'icon-park-outline:home',
  },
  children: [],
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    // redirect: '/appRoot',
    redirect: VITE_APP_HOME_PATH,
    component: Layout,
    children: [],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'), //Note that the file extension .vue is required
    meta: {
      title: 'Login',
      withoutTab: true,
    },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403/index.vue'),
    meta: {
      title: 'User has no permission',
      withoutTab: true,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404/index.vue'),
    meta: {
      title: 'Page Not Found',
      icon: 'icon-park-outline:ghost',
      withoutTab: true,
    },
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/error/500/index.vue'),
    meta: {
      title: 'Server Error',
      icon: 'icon-park-outline:close-wifi',
      withoutTab: true,
    },
  },
  {
    path: '/:catchAll(.*)*',
    //path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404/index.vue'),
    name: '404',
    meta: {
      title: 'Page Not Found',
      icon: 'icon-park-outline:ghost',
      withoutTab: true,
    }
  }
]
