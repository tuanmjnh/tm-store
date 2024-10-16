<script setup lang="ts">
import{tokenClient} from '@/services/gapi-client'
// import { GoogleOAuthCallback } from '@/services/google-oauth2'
// GoogleOAuthCallback()
// const googleOauth = gapi.auth2.getAuthInstance();
// const newScope = "https://www.googleapis.com/auth/calendar"

// googleOauth = auth2.currentUser.get();
// googleOauth.grantOfflineAccess({ scope: newScope }).then(
//   function (success) {
//     console.log(JSON.stringify({ message: "success", value: success }));
//   },
//   function (fail) {
//     alert(JSON.stringify({ message: "fail", value: fail }));
//   });
tokenClient.requestAccessToken({ prompt: 'consent' })
console.log()
</script>
<template>
  <div class="flex justify-center">
    <van-loading color="#1989fa">
      {{ $t('global.textLoading') }}
    </van-loading>
  </div>
</template>