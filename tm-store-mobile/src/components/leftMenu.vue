<script setup lang="ts">
import { useAppStore } from '@/store'
const { isLeftMenu } = toRefs(useAppStore())
</script>

<template>
  <!-- <van-popup v-model:show="showLeft" :style="{ padding: '64px' }">Content</van-popup> -->
  <van-popup v-model:show="isLeftMenu" position="left" :style="{ width: '80%', height: '100%' }">
    <van-cell-group class="cell-left">
      <van-cell title="Cell title" is-link />
      <van-cell title="Cell title" is-link />
    </van-cell-group>
  </van-popup>
</template>

<style scoped></style>
