<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { $t } from '@/i18n';
import router from '@/router';
const $route = useRoute()
const active = ref($route.name.toString());
const tabbarData = reactive([
  {
    icon: 'wap-home-o',
    title: 'route.root',
    name: 'dashboard'
  },
  {
    icon: 'search',
    title: 'route.search',
    name: 'search'
  },
  {
    icon: 'user-o',
    title: 'route.profile',
    name: 'profile'
  }
]);
const onChange = (item) => {
  if (router.hasRoute(item.name))
    router.push({ name: item.name }).catch(e => { })
  else
    router.push({ name: '404' }).catch(e => { })
}
</script>
<template>
  <van-tabbar v-if="$route.meta.level === 1" v-model="active" placeholder fixed>
    <van-tabbar-item v-for="(item, index) in tabbarData" :key="index" :name="item.name" :icon="item.icon"
      @click="onChange(item)">
      {{ $t(item.title) }}
    </van-tabbar-item>
  </van-tabbar>
</template>
