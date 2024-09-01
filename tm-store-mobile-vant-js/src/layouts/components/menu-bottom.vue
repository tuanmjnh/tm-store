<template>
  <q-footer bordered>
    <q-tabs v-model="tabs" no-caps active-color="primary" indicator-color="transparent">
      <template v-for="e in menus" :key="e.name">
        <q-tab :name="e.name" :icon="e.meta.icon" @click="onClickTab(e)">
          <!-- <q-badge color="red" floating>2</q-badge> :class="tab===e.name?'text-primary':''" -->
        </q-tab>
      </template>
    </q-tabs>
    <!-- QR Code Scanner dialog -->
    <!-- <q-dialog v-model="isDialogQRCode" :maximized="true">
    <tm-html5qrcode :title="$t('qrCode.qrCodeScanner')" :cancelLabel="$t('global.cancel')" @onDecode="onDecodeQR" @onError="onErrorQR" />
  </q-dialog> -->
  </q-footer>
  <q-page-container v-if="$q.platform.is.mobile" id="page-container">
    <q-tab-panels v-model="tabs" animated>
      <q-tab-panel name="dashboard">
        <tab-dashboard />
      </q-tab-panel>
      <q-tab-panel name="orders">
        <tab-orders />
      </q-tab-panel>
      <q-tab-panel name="products">
        <tab-products />
      </q-tab-panel>
      <q-tab-panel name="reports">
        <tab-reports />
      </q-tab-panel>
    </q-tab-panels>
  </q-page-container>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from "vue"
// import { useRoute, useRouter } from 'vue-router'
export default defineComponent({
  name: "MenuBottom",
  components: {
    tabDashboard: defineAsyncComponent(() => import('pages/dashboard/index.vue')),
    tabOrders: defineAsyncComponent(() => import('pages/orders/index.vue')),
    tabProducts: defineAsyncComponent(() => import('pages/products/index.vue')),
    tabReports: defineAsyncComponent(() => import('pages/reports/index.vue')),
  },
  setup() {
    // const $route = useRoute()
    // const $router = useRouter()
    // const tabs = computed({
    //   get: () => $route.name,
    //   set: val => val
    // })
    const tabs = ref('dashboard')
    const menus = [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: { title: 'dashboard', icon: 'dashboard' }
      },
      {
        path: '/orders',
        name: 'orders',
        meta: { title: 'orders', icon: 'class' }
      },
      {
        path: '/warehouse',
        name: 'products',
        meta: { title: 'warehouse', icon: 'store' }
      },
      // {
      //   path: '/qrcode',
      //   name: 'qrcode',
      //   meta: { title: 'qrCodeScanner', icon: 'qr_code_scanner' }
      // },
      {
        path: '/warehouse/report',
        name: 'reports',
        meta: { title: 'report', icon: 'pie_chart' }
      }
      // {
      //   path: '/notification',
      //   name: 'notification',
      //   meta: { title: 'notification', icon: 'notifications' }
      // },
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   meta: { title: 'profile', icon: 'account_box' }
      // }
    ]
    const isDialogQRCode = ref(false)
    return {
      tabs, menus, isDialogQRCode,
      onClickTab(val) {
        if (val.name === 'qrcode') isDialogQRCode.value = !isDialogQRCode.value
        // else $router.push(val.path)
        tabs.value = val.name
        // emit('on-change', val)
      },
      onDecodeQR(val) {
        // console.log(val)
        isDialogQRCode.value = !isDialogQRCode.value
      },
      onErrorQR(val) {
        // console.log(val)
      }
    }
  }
})
</script>
<style scoped>
.q-tab-panels .q-panel .q-tab-panel {
  padding: 0px !important;
}
</style>
