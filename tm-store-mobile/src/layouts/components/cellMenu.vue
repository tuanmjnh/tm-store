<script setup lang="ts">
import { useAppStore } from '@/store'
import { rootRoute } from '@/router/routes.inner'
import cellMenuItem from "./cellMenuItem.vue";

const { isLeftMenu } = toRefs(useAppStore())
// console.log(rootRoute.children)
</script>

<template>
  <van-popup v-model:show="isLeftMenu" position="left" :style="{ width: '80%', height: '100%' }">
    <van-cell-group>
      <cell-menu-item v-for="(e, i) in rootRoute.children" :key="i" :item="e" />
      <!-- <van-cell title="Cell title" is-link @click="onClick" />
      <van-cell title="Cell title" is-link />
      <van-cell title="Cell title" is-link arrow-direction="down" /> -->
    </van-cell-group>
  </van-popup>
</template>

<style scoped></style>
