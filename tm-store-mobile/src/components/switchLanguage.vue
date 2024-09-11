<script setup lang="ts">
import { useAppStore } from '@/store'
import { languages } from '@/i18n'
const storeApp = useAppStore()
const isDialog = ref(false)
const onSetLanguage = (language) => {
  if (storeApp.language != language.value) storeApp.setLanguage(language.value)
  isDialog.value = false
}
</script>
<template>
  <!-- <span :class="`fi fi-${storeApp.language}`" @click="isDialog = !isDialog" /> -->
  <icon-park-outline-translate @click="isDialog = !isDialog" />
  <van-action-sheet v-model:show="isDialog" :cancel-text="$t('global.cancel')" :description="$t('setting.switchTitle')" 
    close-on-click-action>
    <van-cell-group inset>
      <van-cell v-for="(e, i) in languages" :key="i" @click="onSetLanguage(e)">
        <template #title>
          <van-space>
            <span class="custom-title">{{ e.label }}</span>
          </van-space>
        </template>
        <template #right-icon v-if="e.value === storeApp.language">
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