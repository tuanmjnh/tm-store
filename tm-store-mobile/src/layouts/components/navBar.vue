<script setup lang="ts">
import router from '@/router';
import { $t } from '@/i18n';
import { useAppStore } from '@/store'

const $route = useRoute()
const storeApp = useAppStore()

// const { VITE_APP_NAME } = import.meta.env
const onClickRight = () => {
  router.push({ name: 'setting' }).catch(() => { })
}
const getTitle = () => {
  let rs = $t(`route.${$route.meta.title}`, $route.name.toString())
  if ($route.meta.parent) rs += ' ' + $t(`route.${$route.meta.parent}`, $t(`route.${$route.meta.label}`)).toLowerCase()
  return rs
}
</script>

<template>
  <van-nav-bar fixed placeholder :title="getTitle()" :left-arrow="$route.meta.level === 2" @click-right="onClickRight">
    <template #left>
      <!-- <icon-park-outline-application-menu v-if="$route.meta.level === 1" @click="storeApp.isLeftMenu = true" /> -->
      <!-- <van-icon v-else name="wap-home-o" @click="router.replace('/')" /> -->
      <!-- <icon-park-outline-analysis v-else @click="router.replace('/')" /> -->
      <icon-park-outline-application-menu @click="storeApp.isLeftMenu = true" />
    </template>
    <template v-if="$route.meta.level === 1" #right>
      <icon-park-outline-setting />
    </template>
  </van-nav-bar>
</template>

<style scoped></style>
