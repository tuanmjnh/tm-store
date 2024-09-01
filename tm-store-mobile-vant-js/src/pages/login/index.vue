<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import stores from '@/stores'
// library core
const $route = useRoute()
const $router = useRouter()
const storeApp = stores.app()
const storeSetting = stores.setting()
const storeAuthenticate = stores.authenticate()

// Data
const languages = computed(() => storeApp.languages)
const AppName = import.meta.env.VITE_APP_TITLE
const data = ref({
  username: '',
  password: '',
  remember: true
})
const passwordType = ref('password')
const isCapsTooltip = ref(false)
const isShowLanguage = ref(false)
// Return data for html
const onSetGlobalData = () => {
  return new Promise(async (resolve, reject) => {
    if (storeAuthenticate.user) {
      if (!$store.state.types.items) await $store.dispatch('types/getAll')// .then(() => { console.log(store.state.types.items) })
      // if (!$store.state.roles.items) await $store.dispatch('roles/getAll')// .then(() => { console.log(store.state.roles.items) })
    }
    return resolve(true)
  })
}
const onSetLanguage = (item) => {
  if (storeSetting.language !== item) {
    storeSetting.setLanguage(`${item.cc_iso}-${item.cc}`)
    isShowLanguage.value = !isShowLanguage.value
  }
}
const onToggleDarkMode = () => {
  storeSetting.setDarkMode(!storeSetting.darkMode)
}
const onCheckCapslock = ({ shiftKey, key } = {}) => {
  if (key && key.length === 1) {
    if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) isCapsTooltip.value = true
    else isCapsTooltip.value = false
  }
  if (key === 'CapsLock' && isCapsTooltip.value === true) isCapsTooltip.value = false
}
const onSubmit = async () => {
  storeAuthenticate.verify(data.value).then(async rs => {
    if (rs) {
      const redirect = $route.query && $route.query.redirect ? $route.query.redirect : '/'
      $router.push(redirect).catch((e) => { })
      await onSetGlobalData()
    }
  })
}
</script>
<template>
  <div class="bg-gradient">
    <van-form @submit="onSubmit" class="van-form-square-top">
      <div class="form-header">
        <div class="title font-size-20 font-bold">{{AppName}}</div>
        <div class="right">
          <van-space>
            <span :class="`fi fi-${storeSetting.language}`" @click="isShowLanguage=!isShowLanguage" />
            <van-icon @click="onToggleDarkMode">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            </van-icon>
          </van-space>
          <!-- <van-icon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
            </svg>
          </van-icon> -->
        </div>
      </div>
      <van-cell-group inset>
        <!-- <van-field :label="AppName"></van-field> -->
        <van-field v-model="data.username" name="Username" :label="$t('login.username')" :placeholder="$t('login.username')"
                   :rules="[{ required: true, message: 'Username is required' }]" />
        <van-field v-model="data.password" :type="passwordType" name="Password" :label="$t('login.password')" :placeholder="$t('login.password')"
                   :rules="[{ required: true, message: 'Password is required' }]">
          <template #right-icon>
            <van-icon v-if="passwordType==='password'" name="closed-eye" @click="passwordType='text'" />
            <van-icon v-else name="eye-o" @click="passwordType='password'" />
          </template>
        </van-field>
        <van-field name="checkbox" :label="$t('login.remember')">
          <template #input>
            <van-checkbox v-model="data.remember" shape="square" />
          </template>
          <template #right-icon>
            <van-icon name="warning-o" />
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit" :loading="storeApp.loading.post"
                    :disable="storeApp.loading.post">
          {{$t('login.login')}}
        </van-button>
      </div>
      <!-- <van-dropdown-menu>
        <van-dropdown-item v-model="value2" :options="option2">
          <van-cell center title="Title">
            <template #right-icon>
              <van-switch v-model="switch1" />
            </template>
          </van-cell>
        </van-dropdown-item>
      </van-dropdown-menu> -->
    </van-form>
  </div>
  <van-action-sheet v-model:show="isShowLanguage" :cancel-text="$t('global.cancel')" :description="$t('navbar.switchLanguage')"
                    close-on-click-action @select="onSetLanguage">
    <van-cell-group inset>
      <van-cell v-for="(e,i) in languages" :key="i" @click="onSetLanguage(e)">
        <template #title>
          <van-space>
            <span :class="`fi fi-${e.cc_iso}-${e.cc}`" />
            <span class="custom-title">{{e.name_l}}</span>
          </van-space>
        </template>
        <template #right-icon v-if="`${e.cc_iso}-${e.cc}`===storeSetting.language">
          <van-icon class="active">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </van-icon>
        </template>
      </van-cell>
    </van-cell-group>
  </van-action-sheet>
</template>

<style lang="less" scoped>
.bg-gradient {
  height: 100%;
  .van-form {
    position: relative;
    top: 30%;
  }
}
[data-theme="light"] .bg-gradient {
  background-image: linear-gradient(120deg, #3498db, #8e44ad);
}
</style>