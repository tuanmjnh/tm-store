<script setup lang="ts">
import { get } from '@/utils/localStorage'
import { useAppStore, useAuthStore, useTypeStore, useConnectsStore } from './store'
const appStore = useAppStore()
const authStore = useAuthStore()
const typeStore = useTypeStore()
const connectsStore = useConnectsStore()
onMounted(() => {
  if (authStore.accessToken) {
    const typeStoreAll = get('typeStore.all')
    if (!typeStoreAll || !typeStoreAll.length) typeStore.getAll()
    connectsStore.googleVerifyAccessToken()//.then(x => {
    //   console.log(`GoogleVerifyAccessToken: ${x}`)
    // })
  }
})
// console.log(window.matchMedia('(prefers-color-scheme: dark)').matches)
</script>
<template>
  <div class="app-wrapper">
    <van-config-provider :theme="appStore.darkMode ? 'dark' : 'light'">
      <router-view />
    </van-config-provider>
  </div>
</template>

<style></style>
