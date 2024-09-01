<script setup>
// import { ref, computed, watch } from 'vue'
// import { useStoreApp } from '@/stores'
// import NavBar from "./components/nav-bar.vue"
import TabBar from "./components/tab-bar.vue"
// const storeApp = useStoreApp()
// const theme = computed(() => storeApp.darkMode ? 'dark' : 'light')
// const theme = ref('light')
// const mode = computed(() => storeApp.mode)
// watch(mode, (val) => {
  // if (val === 'dark') {//|| localStorage.get('theme') === 'dark') {
  //   theme.value = 'dark'
  //   document.querySelector('html').setAttribute('data-theme', theme.value)
  // }
  // else {
  //   theme.value = 'light'
  //   document.querySelector('html').setAttribute('data-theme', theme.value)
  // }
// }, { immediate: true })
</script>
<template>
  <div class="app-wrapper">
    <!-- <van-config-provider :theme="theme"> -->
    <!-- <nav-bar /> -->
    <div class="app-container">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
      <tab-bar />
      <!-- </van-config-provider> -->
    </div>
  </div>
</template>

<style scoped></style>
