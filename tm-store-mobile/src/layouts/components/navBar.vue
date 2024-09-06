<script setup lang="ts">
import { useAppStore } from '@/store'
const storeApp = useAppStore()
import router from '@/router';
const $route = useRoute()
// const { VITE_APP_NAME } = import.meta.env
const onBackPage = () => {
  if (window.history.state.back) history.back()
  else router.replace('/')
  // router.push({ name: 'appRoot' }).catch(e => { })
}
const onClickRight = () => {
  router.push({ name: 'setting' }).catch(e => { })
}
</script>

<template>
  <van-nav-bar fixed placeholder :title="$t(`route.${String($route.name)}`, $route.meta.title)"
    :left-arrow="$route.meta.level === 2" @click-right="onClickRight">
    <template #left>
      <!-- <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar"
        type="button"
        class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
        <span class="sr-only">Open sidebar</span>
        <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path clip-rule="evenodd" fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
          </path>
        </svg>
      </button> -->
      <icon-park-outline-application-menu v-if="$route.meta.level === 1" @click="storeApp.isLeftMenu=true" />
      <van-icon v-else name="arrow-left" @click="onBackPage" />
    </template>
    <template v-if="$route.meta.level === 1" #right>
      <icon-park-outline-setting />
    </template>
  </van-nav-bar>
</template>

<style scoped></style>
