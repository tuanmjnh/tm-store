<script setup>
import { defineAsyncComponent, computed } from 'vue'
// import { useStoreSettings } from '@/stores'
import stores from '@/stores'
const storeSetting = stores.setting()
//init setting
storeSetting.initialize()
const component = computed(() => {
  if (true) {//if ($store.state.auth.user) {
    return defineAsyncComponent(() => import(`./layouts/index.vue`))
  } else {
    return defineAsyncComponent(() => import('./layouts/fake-layout.vue'))
  }
})
</script>

<template>
  <component :is="component">
    <router-view />
  </component>
</template>

<style scoped></style>
