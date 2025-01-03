<script setup lang="ts">
import JsBarcode from 'jsbarcode'
import { NewGuid } from '@/utils/tm-crypto'
import { debounce } from 'lodash'
const emit = defineEmits<{
  (e: 'onInit', values: any): void
  (e: 'onCancel', values: any): void
  (e: 'onGenerator', values: any): void
  (e: 'onSubmit', values: any): void
  (e: 'update:modelValue', values: any): void
}>()
const props = withDefaults(
  defineProps<{
    modelValue: string
    defaultValue?: string
    title?: string
    format?: string
    width?: number
    height?: number
    logoWidth?: number
    logoHeight?: number
    colorDark?: string
    colorLight?: string
    logo?: string
    displayValue?: boolean
    lblSubmit?: string
    lblCancel?: string
  }>(),
  {
    title: 'QR Code',
    format: 'CODE128',
    width: 2,
    height: 80,
    colorDark: "#000000",
    colorLight: "#ffffff",
    // correctLevel: QRCode.CorrectLevel.H, // L, M, Q, H
    logoWidth: 18,
    logoHeight: 18,
    displayValue: false,
    lblSubmit: 'Submit',
    lblCancel: 'Cancel'
  })
const onInit = (value?) => {
  if (!value) value = props.defaultValue
  const EL = document.getElementById('tm-barcode')
  const oldCanvasEL = EL.querySelector('canvas')
  if (oldCanvasEL) EL.removeChild(oldCanvasEL)
  const canvasEL = document.createElement('canvas')
  EL.appendChild(canvasEL)
  const rs = JsBarcode(canvasEL, value, {
    format: props.format,
    width: props.width,
    height: props.height,
    displayValue: props.displayValue
  })
  emit('onInit', rs)
}

onMounted(() => {
  onInit()
})
const onChangeCodeInput = debounce((event) => {
  onInit(event.target.value)
}, 300)
const onGenerator = (arg) => {
  // const qrCode = NewGuid()
  onInit(arg)
  emit('onGenerator', true)
  emit('update:modelValue', arg)
}
const onSubmit = () => {
  emit('onSubmit', props.modelValue)
}
const onCancel = () => {
  emit('onCancel', true)
}
</script>
<template>
  <div id="tm-barcode" class="flex justify-center mt-3 mb-3"></div>
  <div class="p-3">
    <div class="relative">
      <input :value="modelValue" @input="onChangeCodeInput"
        class="w-full bg-transparent placeholder:text-slate-400 border border-slate-200 pl-3 pr-10 py-2 transition duration-300 ease text-gray-900 text-xs dark:text-sky-500"
        :placeholder="$t('qrCode.qrCode')" />
      <button @click="onGenerator(defaultValue)"
        class="absolute right-9 top-1 rounded bg-slate-800 p-1 border border-transparent text-center text-xs text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
            d="M4 20h40M6 6v8m0 11.996v12.003M20.4 6v8m0 12v16M34.8 6v8M42 6v8m-7.2 12v8M13.2 6v8m0 12v8M27.6 6v8m0 12v8M42 26v12" />
        </svg>
      </button>
      <button @click="onGenerator(NewGuid())"
        class="absolute right-1 top-1 rounded bg-slate-800 p-1 border border-transparent text-center text-xs text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="4">
            <path stroke-linejoin="round" d="M16 12L4 24.432L16 36m16-24l12 12.432L32 36" />
            <path d="M24 17v14" />
            <path stroke-linejoin="round" d="m18 25l6 6l6-6" />
          </g>
        </svg>
      </button>
    </div>
  </div>
  <hr class="border-gray-300 dark:border-gray-100">
  <div class="flex justify-center">
    <button type="button" @click="onCancel"
      class="w-full items-center text-center content-center px-3 py-3 text-xs font-medium text-white">
      <span class="mr-2">{{ lblCancel }}</span>
    </button>
    <button type="button" @click="onSubmit"
      class="w-full items-center text-center content-center px-3 py-3 text-xs font-medium text-white bg-sky-500 dark:bg-sky-600">
      <span class="mr-2">{{ lblSubmit }}</span>
    </button>
  </div>
</template>

<style></style>
