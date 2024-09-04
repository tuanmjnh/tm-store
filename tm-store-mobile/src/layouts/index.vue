<script setup lang="ts">
// import { computed } from "vue";
import tabbar from "@/components/tabBar.vue";
import NavBar from "@/components/navBar.vue";
import leftMenu from "@/components/leftMenu.vue";

// import { useCachedViewStoreHook } from "@/store/modules/cachedView";
// import { useDarkMode } from "@/hooks/useToggleDarkMode";

// const cachedViews = computed(() => {
//   return useCachedViewStoreHook().cachedViewList;
// });
</script>

<template>
  <leftMenu />
  <nav-bar />
  <router-view v-slot="{ Component, route }">
    <!-- <transition :name="routeTransitionName"> -->
    <!-- <keep-alive :include="keepAliveRouteNames"> -->
    <component :is="Component" :key="route.name" />
    <!-- </keep-alive> -->
    <!-- </transition> -->
  </router-view>
  <!-- <router-view v-slot="{ Component }"> -->
  <!-- <keep-alive :include="cachedViews"> -->
  <!-- <component :is="Component" /> -->
  <!-- </keep-alive> -->
  <!-- </router-view> -->
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
