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
      <icon-park-outline-application-menu v-if="$route.meta.level === 1" @click="storeApp.isLeftMenu=true" />
      <van-icon v-else name="arrow-left" @click="onBackPage" />
    </template>
    <template v-if="$route.meta.level === 1" #right>
      <icon-park-outline-setting />
    </template>
  </van-nav-bar>
</template>

<style scoped></style>
