<script setup lang="ts">
import vueQrcodeReader from '@/components/vueQrcodeReader.vue'
import { useAppStore } from '@/store'
import { showNotify } from 'vant'
const storeApp = useAppStore()
const filterSearch = ref(storeApp.filter)
const isDialogQRCode = ref(false)
watch(filterSearch, val => { storeApp.filter = val }, { immediate: true })
const result = ref('')
const onQRCodeDetect = async (args) => {
  // console.log(code)
  // window.alert(code.result)
  result.value = args.code
}
const onQRCodeError = async (args) => {
  // console.log(args)
  showNotify({ type: 'danger', message: `[${args.name}] - ${args.value}` })
}
</script>
<template>
  <van-search v-model="filterSearch" right-icon="qr" :placeholder="$t('global.inputPlaceholder')"
    @click-right-icon="isDialogQRCode = true" />
  <van-dialog v-model:show="isDialogQRCode" :title="$t('qrCode.qrCodeScanner')" class="full-screen"
    :show-cancel-button="false" :show-confirm-button="false" close-on-click-action>
    {{ result }}
    <vueQrcodeReader :lbl-cancel="$t('global.back')" @on-cancel="isDialogQRCode = false" @on-detect="onQRCodeDetect"
      @on-error="onQRCodeError" />
  </van-dialog>
</template>