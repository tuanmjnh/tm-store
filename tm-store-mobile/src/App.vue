<script setup lang="ts">
import { useAppStore } from './store'
const appStore = useAppStore()
</script>
<template>
  <div class="app-wrapper">
    <van-config-provider :theme="appStore.darkMode ? 'dark' : 'light'">
      <router-view />
    </van-config-provider>
    </div>
</template>

<style></style>
