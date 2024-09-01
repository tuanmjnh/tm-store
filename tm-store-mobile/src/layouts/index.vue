<script setup lang="ts">
import tabbar from "@/components/Tabbar/index.vue";
import NavBar from "@/components/NavBar/index.vue";
// import { useCachedViewStoreHook } from "@/store/modules/cachedView";
// import { useDarkMode } from "@/hooks/useToggleDarkMode";
import { computed } from "vue";

// const cachedViews = computed(() => {
//   return useCachedViewStoreHook().cachedViewList;
// });
</script>

<template>
  <nav-bar />
  <router-view v-slot="{ Component }">
    <!-- <keep-alive :include="cachedViews"> -->
      <component :is="Component" />
    <!-- </keep-alive> -->
  </router-view>
  <tabbar />
</template>

<style scoped>
.app-wrapper {
  &:after {
    content: "";
    display: table;
    clear: both;
  }

  position: relative;
  height: 100%;
  width: 100%;
}
</style>
