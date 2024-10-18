<script setup lang="ts">
import tabBarView from "@/components/tabBarView.vue"
import { GoogleOAuthSignIn } from '@/services/google/oauth2'
import { useAppStore, useConnectsStore } from '@/store'
const appStore = useAppStore()
const connectsStore = useConnectsStore()
const connects = computed(() => connectsStore.$state)//ref(typeStore.getByKey('connect'))
const onConnects = (args) => {
  if (args.key == 'google' && !args.access_token) GoogleOAuthSignIn()
}
</script>
<template>
  <van-cell-group>
    <van-cell v-for="(e, i) in connects" :key="i" :title="e.name" :label="e.profile.email" :is-link="!e.access_token"
      @click="onConnects(e)">
      <template v-if="!e.access_token" #right-icon>
        <van-loading v-if="appStore.loading.post" size="20" color="#1989fa" />
        <van-icon v-else name="arrow" class="van-cell__right-icon search-icon" />
      </template>
      <template v-else #right-icon>
        <van-image width="50" height="50" fit="cover" :src="e.profile.picture" />
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