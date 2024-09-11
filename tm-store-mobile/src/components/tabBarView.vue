<script setup lang="ts">
import router from '@/router'

const props = defineProps({
  hideLeft: { type: Boolean, default: false },
  placeholder: { type: Boolean, default: true },
  fixed: { type: Boolean, default: true },
})
const onBackPage = () => {
  if (window.history.state.back) history.back()
  else router.replace('/')
}

</script>
<template>
  <van-tabbar :placeholder="placeholder" :fixed="fixed" class="margin-bottom-initial">
    <van-tabbar-item v-if="!hideLeft" icon="arrow-left" class="van-text--default" @click="onBackPage()">
      <!-- {{ $t('app.back') }} -->
    </van-tabbar-item>
    <slot name="item"></slot>
  </van-tabbar>
</template>