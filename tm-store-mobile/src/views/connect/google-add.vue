<script setup lang="ts">
import { useConnectsStore } from '@/store'
const sonnectsStore = useConnectsStore()
import { GoogleOAuthCallback } from '@/services/google/oauth2'
GoogleOAuthCallback().then(args => {
  // console.log(args)
  sonnectsStore.googleAuthByCode(args).then(res => {
    // console.log(res)
  }).catch((e) => console.log(e)).finally(() => window.close())
})
</script>
<template>
  <div class="flex justify-center">
    <van-loading color="#1989fa">
      {{ $t('global.textLoading') }}
    </van-loading>
  </div>
</template>