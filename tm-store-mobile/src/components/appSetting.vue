<script setup lang="ts">
import switchLanguage from "./switchLanguage.vue";
import switchDarkMode from "./switchDarkMode.vue";
import { useAppStore } from '@/store'
const storeApp = useAppStore()
const isDialog = ref(false)
const cell = [
  { label: 'Dark mode' },
  { label: 'Language' },
]
const onSetLanguage = () => {

}
</script>
<template>
  <!-- <span :class="`fi fi-${storeApp.language}`" @click="isDialog = !isDialog" /> -->
  <!-- <icon-park-outline-setting @click="isDialog = !isDialog" /> -->
  <!-- <van-cell-group inset>
    <van-cell title="Cell title" value="Content" />
    <van-cell title="Cell title" value="Content" label="Description" />
  </van-cell-group> -->
  <van-action-sheet v-model:show="isDialog" :cancel-text="$t('global.cancel')" :description="$t('language.switchTitle')"
    close-on-click-action>
    <van-cell-group inset>
      <van-cell @click="onSetLanguage()">
        <template #title>
          <van-space>
            <span class="custom-title">Dark mode</span>
          </van-space>
        </template>
        <template #right-icon>
          <van-icon class="active">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </van-icon>
        </template>
      </van-cell>
    </van-cell-group>
  </van-action-sheet>
</template>