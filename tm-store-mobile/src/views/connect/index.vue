<script setup lang="ts">
import tabBarView from "@/components/tabBarView.vue"
import { GoogleOAuthSignIn } from '@/services/google-oauth2'
const router = useRouter()
const isLoadingGoogle = ref(false)
const isLoadingFacebook = ref(false)
const isLoadingTiktok = ref(false)
const onGoogleConnect = () => {
  isLoadingGoogle.value = true
  GoogleOAuthSignIn()
  // router.push('google-add')
}
console.log(window.location.origin)
</script>
<template>
  <van-cell-group>
    <van-cell title="Google" is-link @click="onGoogleConnect">
      <template #right-icon>
        <van-loading v-if="isLoadingGoogle" size="20" color="#1989fa" />
        <van-icon v-else name="arrow" class="van-cell__right-icon search-icon" />
      </template>
    </van-cell>
    <van-cell title="Facebook" is-link>
      <template #right-icon>
        <van-loading v-if="isLoadingFacebook" size="20" color="#1989fa" />
        <van-icon v-else name="arrow" class="van-cell__right-icon search-icon" />
      </template>
    </van-cell>
    <van-cell title="Tiktok" is-link>
      <template #right-icon>
        <van-loading v-if="isLoadingTiktok" size="20" color="#1989fa" />
        <van-icon v-else name="arrow" class="van-cell__right-icon search-icon" />
      </template>
    </van-cell>
  </van-cell-group>
  <tab-bar-view>
    <template #item>
      <van-tabbar-item />
      <van-tabbar-item />
    </template>
  </tab-bar-view>
</template>