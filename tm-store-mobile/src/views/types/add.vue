<script setup lang="ts">
import router from '@/router'
const onBackPage = () => {
  if (window.history.state.back) history.back()
  else router.replace('/')
}
</script>
<template>
  <van-tabbar placeholder fixed>
    <van-tabbar-item icon="arrow-left" class="van-text--default" @click="onBackPage()">
      {{ $t('app.back') }}
    </van-tabbar-item>
    <van-tabbar-item icon="add-o" @click="router.push('add').catch(e => { })">{{ $t('app.add') }}</van-tabbar-item>
  </van-tabbar>
</template>