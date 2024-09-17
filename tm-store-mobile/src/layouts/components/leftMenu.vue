<script setup lang="ts">
import { useAppStore } from '@/store'
import { rootRoute } from '@/router/routes.inner'
import leftMenuItem from "./left-menu-item.vue";

const { isLeftMenu } = toRefs(useAppStore())
</script>

<template>
  <van-popup v-model:show="isLeftMenu" position="left" :style="{ width: '80%', height: '100%' }">
    <aside id="sidebar-multi-level-sidebar"
      :class="`fixed top-0 left-0 z-40 w-full h-screen transition-transform -translate-x-full ${isLeftMenu ? 'transform-none' : 'sm:translate-x-0'}`"
      aria-label="Sidebar">
      <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul class="space-y-2 font-medium">
          <leftMenuItem v-for="(e, i) in rootRoute.children" :key="i" :item="e" />
        </ul>
      </div>
    </aside>
  </van-popup>
</template>

<style scoped></style>
