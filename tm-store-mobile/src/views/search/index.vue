<script setup lang="ts">
import { useAppStore } from '@/store'
const storeApp = useAppStore()
// const filterStore = computed(() => storeApp.filter)
const filterSearch = ref(storeApp.filter)
watch(filterSearch, val => { storeApp.filter = val }, { immediate: true })
</script>
<template>
  <van-search v-model="filterSearch" :placeholder="$t('global.inputPlaceholder')" />
  <!-- <van-form>
    <van-cell-group inset>
      <van-field v-model="filterSearch" name="search" :placeholder="$t('app.searchPlaceholder')" />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">{{ $t('app.search') }}</van-button>
    </div>
  </van-form> -->
</template>