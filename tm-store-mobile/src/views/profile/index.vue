<script setup lang="ts">
import moment from 'moment';
import { useAppStore, useAuthStore } from '@/store'
const storeApp = useAppStore()
const authStore = useAuthStore()
const userInfo = computed(() => authStore.userInfo)
</script>
<template>
  <van-cell-group>
    <van-cell :title="$t('user.fullName')" :value="userInfo.fullName" />
    <van-cell :title="$t('user.phone')" :value="userInfo.phone" />
    <van-cell :title="$t('user.email')" :value="userInfo.email" />
    <van-cell :title="$t('user.dateBirth')" :value="moment(userInfo.dateBirth).format(storeApp.format.date)" />
    <van-cell :title="$t('user.personNumber')" :value="userInfo.personNumber" />
    <van-cell :title="$t('user.gender')" :value="userInfo.gender" />
    <van-cell :title="$t('user.address')" :value="userInfo.address" />
    <van-cell :title="$t('user.verify')">
      <template #right-icon>
        <VanSwitch v-model="userInfo.verified" disabled size="20px" aria-label="Verified" />
      </template>
    </van-cell>
  </van-cell-group>
</template>