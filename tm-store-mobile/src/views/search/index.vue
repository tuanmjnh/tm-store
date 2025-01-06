<script setup lang="ts">
import vueQrcodeReader from '@/components/vueQrcodeReader.vue'
import productsView from '@/views/products/view.vue'
import { showNotify } from 'vant'
import { debounce } from 'lodash'
// const filterSearch = ref(storeApp.filter)
const isDialogQRCode = ref(false)
const textSearch = ref(null)
const form = ref({
  text: '',
  code: '',
  flag: 1
})
// watch(filterSearch, val => { storeApp.filter = val }, { immediate: true })
// const result = ref('')
const onQRCodeDetect = async (args) => {
  // console.log(code)
  // window.alert(code.result)
  // result.value = args.code
  if (args.code) {
    args.code = JSON.parse(args.code)
    if (args.code && args.code.length) {
      form.value.text = args.code[0]
      isDialogQRCode.value = false
      // const p = await productStore.find({ qrcode: args.code[0] })
      // if (p && p.data) router.push(`/product/edit/${p.data._id}`)
    }
  }
}
const onQRCodeError = async (args) => {
  // console.log(args)
  showNotify({ type: 'danger', message: `[${args.name}] - ${args.value}` })
}
const onSearch = debounce((args) => {
  form.value.text = args
}, 600)
const onClear = debounce((args) => {
  form.value.text = ''
}, 200)
</script>
<template>
  <van-search v-model="textSearch" right-icon="qr" :placeholder="$t('global.inputPlaceholder')"
    @click-right-icon="isDialogQRCode = true" @update:model-value="onSearch" @clear="onClear" />
  <productsView v-model="form.text" />
  <van-dialog v-model:show="isDialogQRCode" :title="$t('qrCode.qrCodeScanner')" class="full-screen"
    :show-cancel-button="false" :show-confirm-button="false" close-on-click-action>
    <!-- {{ result }} -->
    <vueQrcodeReader :lbl-cancel="$t('global.back')" @on-cancel="isDialogQRCode = false" @on-detect="onQRCodeDetect"
      @on-error="onQRCodeError" />
  </van-dialog>
</template>