<script setup lang="ts">
import tabBarView from "@/components/tabBarView.vue"
import { GoogleOAuthSignIn } from '@/services/google/oauth2'
import { useAppStore, useConnectsStore } from '@/store'
import { $t } from '@/i18n'
import svgImage from '@/components/svgImage.vue'
const appStore = useAppStore()
const connectsStore = useConnectsStore()
const connects = computed(() => connectsStore.$state)//ref(typeStore.getByKey('connect'))
// watch(appStore.loading, val => {
//   console.log(val.post)
// }, { deep: true, immediate: true })
const isDialogRemove = ref(false)
const actions = ref([{ name: $t('global.removeConnect'), color: '#f56c6c' }]) as any
connectsStore.googleGetAuth()
const onConnects = (args) => {
  if (args.key == 'google') {
    if (args.access_token) {
      actions.value[0] = { ...args, ...actions.value[0] }
      actions.value[0].subname = args.name
      isDialogRemove.value = true
    } else GoogleOAuthSignIn()
  }
}
const onConfirmRemove = (args) => {
  if (args.key == 'google') connectsStore.googleRemoveAuth()
}
</script>
<template>
  <van-cell-group>
    <van-cell v-for=" (e, i) in connects" :key="i" :title="e.name" :label="e.profile?.name" is-link
      @click="onConnects(e)">
      <template v-if="!e.access_token" #right-icon>
        <van-loading v-if="appStore.loading.post" size="20" color="#1989fa" />
        <van-icon v-else name="arrow" class="van-cell__right-icon search-icon" />
      </template>
      <template v-else #right-icon>
        <svgImage width="50" height="50" fit="cover" :src="e.profile.picture" />
      </template>
      <template v-if="e.name" #title>
        {{ e.profile?.email ? `${e.name} - ${e.profile.email}` : e.name }}
      </template>
    </van-cell>
  </van-cell-group>
  <tab-bar-view>
    <template #item>
      <van-tabbar-item />
      <van-tabbar-item />
    </template>
  </tab-bar-view>
  <van-action-sheet v-model:show="isDialogRemove" :cancel-text="$t('global.cancel')" close-on-click-action
    :actions="actions" @select="onConfirmRemove">
  </van-action-sheet>
</template>