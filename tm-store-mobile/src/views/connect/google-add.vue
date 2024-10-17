<script setup lang="ts">
// import { requestlAccessToken, initCodeClient } from '@/services/gapi-client'
import { useConnectGoogleStore } from '@/store'
const connectGoogleStore = useConnectGoogleStore()
import { GoogleOAuthCallback } from '@/services/google-oauth2'
GoogleOAuthCallback().then(args => {
  connectGoogleStore.authCode(args).then(res => {
    console.log(res)
  })
})
</script>
<template>
  <div class="flex justify-center">
    <van-loading color="#1989fa">
      {{ $t('global.textLoading') }}
    </van-loading>
  </div>
</template>