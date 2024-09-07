<script setup lang="ts">
// import { computed } from "vue";
import tabbar from "@/layouts/components/tabBar.vue";
import NavBar from "@/layouts/components/navBar.vue";
import cellMenu from "@/layouts/components/cellMenu.vue";
// import leftMenu from "@/layouts/components/leftMenu.vue";
// import leftMenuTW from "@/components/leftMenuTW.vue";

// import { useCachedViewStoreHook } from "@/store/modules/cachedView";
// import { useDarkMode } from "@/hooks/useToggleDarkMode";

// const cachedViews = computed(() => {
//   return useCachedViewStoreHook().cachedViewList;
// });
</script>

<template>
  <!-- <leftMenu /> -->
  <cell-menu />
  <nav-bar />
  <router-view v-slot="{ Component, route }">
    <!-- <transition :name="routeTransitionName"> -->
    <!-- <keep-alive :include="keepAliveRouteNames"> -->
    <component :is="Component" :key="route.name" />
    <!-- </keep-alive> -->
    <!-- </transition> -->
  </router-view>
  <!-- <left-menuTW /> -->

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
