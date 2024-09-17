<script setup lang="ts">
import { historyBack } from '@/router'

const props = withDefaults(
  defineProps<{
    hideLeft?: boolean
    placeholder?: boolean
    fixed?: boolean
  }>(),
  {
    hideLeft: false,
    placeholder: true,
    fixed: true,
  })

</script>
<template>
  <van-tabbar :placeholder="placeholder" :fixed="fixed" class="margin-bottom-initial">
    <van-tabbar-item v-if="!hideLeft" icon="arrow-left" class="van-text--default" @click="historyBack()">
      <!-- {{ $t('app.back') }} -->
    </van-tabbar-item>
    <slot name="item"></slot>
  </van-tabbar>
</template>