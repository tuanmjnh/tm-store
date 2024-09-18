<script setup lang="ts">
import { useAppStore } from '@/store'
const storeApp = useAppStore()
</script>
<template>
  <icon-park-outline-sun v-if="storeApp.darkMode" @click="storeApp.toggleDarkMode()" />
  <icon-park-outline-moon v-else @click="storeApp.toggleDarkMode()" />
</template>