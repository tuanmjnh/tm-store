<script setup>
import { ref, reactive } from "vue"
const active = ref(0)
const tabbarData = reactive([
  {
    icon: "wap-home-o",
    // title: "Home",
    to: {
      name: "dashboard"
    }
  },
  {
    icon: "bill-o",
    // title: "orders",
    to: {
      name: "orders"
    }
  },
  {
    icon: "shop-o",
    // title: "products",
    to: {
      name: "products"
    }
  },
  {
    icon: "label-o",
    // title: "reports",
    to: {
      name: "reports"
    }
  },
  {
    icon: "user-o",
    // title: "user",
    to: {
      name: "users"
    }
  }
])
</script>
<template>
  <van-tabbar v-model="active" :placeholder="true" :route="true" fixed>
    <van-tabbar-item v-for="(item, index) in tabbarData" :key="index" :icon="item.icon" :to="item.to">
      {{ item.title }}
    </van-tabbar-item>
  </van-tabbar>
</template>
<style scoped></style>