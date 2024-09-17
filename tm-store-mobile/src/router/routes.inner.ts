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
    name: 'root',
    path: '/',
    // redirect: '/appRoot',
    redirect: VITE_APP_HOME_PATH,
    component: Layout,
    children: [],
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index.vue'), //Note that the file extension .vue is required
    meta: {
      title: 'login',
      withoutTab: true,
    },
  },
  {
    name: '403',
    path: '/403',
    component: () => import('@/views/error/403/index.vue'),
    meta: {
      title: '403',
      withoutTab: true,
    },
  },
  // {
  //   name: '404',
  //   path: '/404',
  //   component: () => import('@/views/error/404/index.vue'),
  //   meta: {
  //     title: '404',
  //     icon: 'icon-park-outline:ghost',
  //     withoutTab: true,
  //   },
  // },
  {
    name: '500',
    path: '/500',
    component: () => import('@/views/error/500/index.vue'),
    meta: {
      title: '500',
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
      title: '404',
      icon: 'icon-park-outline:ghost',
      withoutTab: true,
    }
  }
]
