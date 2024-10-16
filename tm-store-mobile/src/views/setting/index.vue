<script setup lang="ts">
import { useAppStore } from '@/store'
import { languages } from '@/i18n'
const storeApp = useAppStore()
const isDialogLanguage = ref(false)

//Dark Mode
// const checked = computed(() => storeApp.darkMode)
const checked = ref<boolean>(isDark.value)
// watch(() => isDark.value, (newMode) => { checked.value = newMode }, { immediate: true })
// const onToggleDark = ()=> {
//   toggleDark()
// }

const onSetLanguage = (language) => {
  if (storeApp.language != language.value) storeApp.setLanguage(language.value)
  isDialogLanguage.value = false
}
const languge = computed(() => {
  const rs = languages.find(x => x.value === storeApp.language)
  if (rs) return rs
  else languages && languages.length ? languages[0] : { order: 0, value: 'undefined', label: 'undefined' }
})
</script>
<template>
  <van-cell-group>
    <van-cell :title="$t('global.darkMode')">
      <template #right-icon>
        <VanSwitch v-model="checked" size="20px" aria-label="on/off Dark Mode" @click="storeApp.toggleDarkMode()" />
      </template>
    </van-cell>
    <van-cell :title="$t('setting.title')" :value="languge.label" is-link
      @click="isDialogLanguage = !isDialogLanguage" />
    <van-cell :title="$t('global.connect')" @click="$router.push('connect')" is-link />
  </van-cell-group>
  <van-action-sheet v-model:show="isDialogLanguage" :cancel-text="$t('global.cancel')"
    :description="$t('setting.switchTitle')" close-on-click-action>
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