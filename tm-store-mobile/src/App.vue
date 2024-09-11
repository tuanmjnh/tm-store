<script setup lang="ts">
import { get } from '@/utils/localStorage'
import { useAppStore, useTypeStore } from './store'
const appStore = useAppStore()
const typeStore = useTypeStore()
onMounted(() => {
  const typeStoreAll = get('typeStore.all')
  if (!typeStoreAll || !typeStoreAll.length) typeStore.getAll()
})
</script>
<template>
  <div class="app-wrapper">
    <van-config-provider :theme="appStore.darkMode ? 'dark' : 'light'">
      <router-view />
    </van-config-provider>
  </div>
</template>

<style></style>
