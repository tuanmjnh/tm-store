<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore, useAuthStore } from '@/store'
import switchLanguage from "@/components/common/switchLanguage.vue";
import switchDarkMode from "@/components/common/switchDarkMode.vue";
// library core
const $route = useRoute()
const $router = useRouter()
const storeApp = useAppStore()
const storeAuth = useAuthStore()
// Data
const AppName = import.meta.env.VITE_APP_TITLE
const data = ref({
  username: 'admin',
  password: 'Bk123456@',
  remember: true
})
const passwordType = ref('password')
const isCapsTooltip = ref(false)

// Return data for html
const onSetGlobalData = () => {
  return new Promise(async (resolve, reject) => {
    if (storeAuth.user) {
      if (!$store.state.types.items) await $store.dispatch('types/getAll')// .then(() => { console.log(store.state.types.items) })
      // if (!$store.state.roles.items) await $store.dispatch('roles/getAll')// .then(() => { console.log(store.state.roles.items) })
    }
    return resolve(true)
  })
}
const onCheckCapslock = ({ shiftKey, key } = {}) => {
  if (key && key.length === 1) {
    if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) isCapsTooltip.value = true
    else isCapsTooltip.value = false
  }
  if (key === 'CapsLock' && isCapsTooltip.value === true) isCapsTooltip.value = false
}
const onSubmit = async () => {
  storeAuth.verify(data.value).then(async rs => {
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
        <div class="title font-size-20 font-bold">{{ AppName }}</div>
        <div class="right">
          <van-space>
            <switch-language />
            <switch-dark-mode />
          </van-space>
        </div>
      </div>
      <van-cell-group inset>
        <!-- <van-field :label="AppName"></van-field> -->
        <van-field v-model="data.username" name="Username" :label="$t('login.username')"
          :placeholder="$t('login.username')" :rules="[{ required: true, message: 'Username is required' }]" />
        <van-field v-model="data.password" :type="passwordType" name="Password" :label="$t('login.password')"
          :placeholder="$t('login.password')" :rules="[{ required: true, message: 'Password is required' }]">
          <template #right-icon>
            <van-icon v-if="passwordType === 'password'" name="closed-eye" @click="passwordType = 'text'" />
            <van-icon v-else name="eye-o" @click="passwordType = 'password'" />
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
          {{ $t('login.signIn') }}
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.bg-gradient {
  height: calc(100vh);

  .van-form {
    position: relative;
    top: 30%;
  }
}

.van-theme-light .bg-gradient {
  background-image: linear-gradient(120deg, #3498db, #8e44ad);
}
</style>