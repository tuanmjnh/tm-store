<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import stores from '@/stores'
const storeSettings = stores.settings()
const { t } = useI18n({ useScope: 'global' })
const onToggleDarkMode = () => {
  storeSettings.setDarkMode(!storeSettings.darkMode)
}
const search = ref('')
</script>
<template>
  <van-nav-bar fixed placeholder>
    <template #left>
      <van-search v-model="search" :placeholder="$t('global.search')" />
    </template>
    <template #right>
      <van-space>
        <van-icon name="qr" size="20" />
        <van-icon name="setting-o" size="20" />
        <!-- <van-icon @click="onToggleDarkMode">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      </van-icon> -->
      </van-space>
    </template>
  </van-nav-bar>
</template>
<style scoped></style>