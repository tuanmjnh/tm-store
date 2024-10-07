<script setup lang="ts">
defineProps<{
  /** Exception Type 403 404 500 */
  type: '403' | '404' | '500'
}>()
const router = useRouter()
</script>

<template>
  <div class="flex flex-col justify-center items-center h-svh">
    <img v-if="type === '403'" src="@/assets/svg/error-403.svg" alt="" class="w-1/3">
    <img v-if="type === '404'" src="@/assets/svg/error-404.svg" alt="" class="w-1/3">
    <img v-if="type === '500'" src="@/assets/svg/error-500.svg" alt="" class="w-1/3">
    <van-button type="primary" @click="router.push('/')">
      {{ $t('route.appRoot') }}
    </van-button>
  </div>
</template>
