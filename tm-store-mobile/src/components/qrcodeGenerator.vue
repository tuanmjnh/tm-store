<script setup lang="ts">
import QRCode from 'easyqrcodejs'
import { NewGuid } from '@/utils/tm-crypto'
import { debounce } from 'lodash'
const emit = defineEmits<{
  (e: 'onInit', values: any): any
  (e: 'onCancel', values: any): any
  (e: 'onGenerator', values: any): any
  (e: 'onScanner', values: any): any
  (e: 'onSubmit', values: any): any
  (e: 'update:modelValue', values: any): void
}>()
const props = withDefaults(
  defineProps<{
    modelValue: string
    defaultValue?: string
    title?: string
    width?: number
    height?: number
    logoWidth?: number
    logoHeight?: number
    colorDark?: string
    colorLight?: string
    logo?: string
    lblScanner?: string
    lblSubmit?: string
    lblCancel?: string
  }>(),
  {
    title: 'QR Code',
    width: 100,
    height: 100,
    colorDark: "#000000",
    colorLight: "#ffffff",
    // correctLevel: QRCode.CorrectLevel.H, // L, M, Q, H
    logoWidth: 18,
    logoHeight: 18,
    lblScanner: 'Scanner',
    lblSubmit: 'Submit',
    lblCancel: 'Cancel'
  })

const qrCodeInstant = ref(null)
const options = {
  // ====== Basic
  text: props.modelValue || props.defaultValue,
  width: props.width,
  height: props.height,
  colorDark: props.colorDark,
  colorLight: props.colorLight,
  // correctLevel: QRCode.CorrectLevel.H, // L, M, Q, H
  logo: props.logo,
  logoWidth: props.logoWidth,
  logoHeight: props.logoHeight
  // ====== dotScale
  /*
  dotScale: 1, // For body block, must be greater than 0, less than or equal to 1. default is 1

  dotScaleTiming: 1, // Dafault for timing block , must be greater than 0, less than or equal to 1. default is 1
  dotScaleTiming_H: undefined, // For horizontal timing block, must be greater than 0, less than or equal to 1. default is 1
  dotScaleTiming_V: undefined, // For vertical timing block, must be greater than 0, less than or equal to 1. default is 1

  dotScaleA: 1, // Dafault for alignment block, must be greater than 0, less than or equal to 1. default is 1
  dotScaleAO: undefined, // For alignment outer block, must be greater than 0, less than or equal to 1. default is 1
  dotScaleAI: undefined, // For alignment inner block, must be greater than 0, less than or equal to 1. default is 1
  */

  // ====== Quiet Zone
  /*
  quietZone: 0,
  quietZoneColor: "rgba(0,0,0,0)",
  */

  // ====== Logo
  /*
  logo: "../demo/logo.png", // Relative address, relative to `easy.qrcode.min.js`
  logo: "http://127.0.0.1:8020/easy-qrcodejs/demo/logo.png",
  logoWidth: 80, // fixed logo width. default is `width/3.5`
  logoHeight: 80, // fixed logo height. default is `heigth/3.5`
  logoMaxWidth: undefined, // Maximum logo width. if set will ignore `logoWidth` value
  logoMaxHeight: undefined, // Maximum logo height. if set will ignore `logoHeight` value
  logoBackgroundColor: '#fffff', // Logo backgroud color, Invalid when `logBgTransparent` is true; default is '#ffffff'
  logoBackgroundTransparent: false, // Whether use transparent image, default is false
  */

  // ====== Backgroud Image
  /*
  backgroundImage: '', // Background Image
  backgroundImageAlpha: 1, // Background image transparency, value between 0 and 1. default is 1.
  autoColor: false, // Automatic color adjustment(for data block)
  autoColorDark: "rgba(0, 0, 0, .6)", // Automatic color: dark CSS color
  autoColorLight: "rgba(255, 255, 255, .7)", // Automatic color: light CSS color
  */

  // ====== Colorful
  // === Posotion Pattern(Eye) Color
  /*
  PO: '#e1622f', // Global Posotion Outer color. if not set, the defaut is `colorDark`
  PI: '#aa5b71', // Global Posotion Inner color. if not set, the defaut is `colorDark`
  PO_TL:'', // Posotion Outer color - Top Left
  PI_TL:'', // Posotion Inner color - Top Left
  PO_TR:'', // Posotion Outer color - Top Right
  PI_TR:'', // Posotion Inner color - Top Right
  PO_BL:'', // Posotion Outer color - Bottom Left
  PI_BL:'', // Posotion Inner color - Bottom Left
  */
  // === Alignment Color
  /*
  AO: '', // Alignment Outer. if not set, the defaut is `colorDark`
  AI: '', // Alignment Inner. if not set, the defaut is `colorDark`
  */
  // === Timing Pattern Color
  /*
  timing: '#e1622f', // Global Timing color. if not set, the defaut is `colorDark`
  timing_H: '', // Horizontal timing color
  timing_V: '', // Vertical timing color
  */

  // ====== Title
  /*
  title: 'QR Title', // content
  titleFont: "normal normal bold 18px Arial", //font. default is "bold 16px Arial"
  titleColor: "#004284", // color. default is "#000"
  titleBackgroundColor: "#fff", // background color. default is "#fff"
  titleHeight: 70, // height, including subTitle. default is 0
  titleTop: 25, // draws y coordinates. default is 30
  */

  // ====== SubTitle
  /*
  subTitle: 'QR subTitle', // content
  subTitleFont: "normal normal normal 14px Arial", // font. default is "14px Arial"
  subTitleColor: "#004284", // color. default is "4F4F4F"
  subTitleTop: 40, // draws y coordinates. default is 0
  */

  // ===== Event Handler
  /*
  onRenderingStart: undefined,
  onRenderingEnd: undefined,
  */

  // ===== Versions
  /*
  version: 0, // The symbol versions of QR Code range from Version 1 to Version 40. default 0 means automatically choose the closest version based on the text length.
  */

  // ===== Binary(hex) data mode
  /*
  binary: false, // Whether it is binary mode, default is text mode.
  */

  // ===== Tooltip
  /*
  tooltip: false, // Whether set the QRCode Text as the title attribute value of the QRCode div
  */

  // ==== CORS
  /*
  crossOrigin: null, // String which specifies the CORS setting to use when retrieving the image. null means that the crossOrigin attribute is not set.
  */

  // =====  Drawing method
  /*
  drawer: 'canvas', // Which drawing method to use. 'canvas', 'svg'. default is 'canvas'
  */

  // =====  UTF-8 without BOM
  /*
  utf8WithoutBOM: true
  */
}
const onInit = (arg?) => {
  if (qrCodeInstant.value) qrCodeInstant.value._el.children[0].remove()

  if (arg) {
    const args = { ...{}, ...options }
    args.text = arg
    qrCodeInstant.value = new QRCode(document.getElementById("tm-qrcode"), args)
    emit('onInit', qrCodeInstant.value)
  } else {
    qrCodeInstant.value = new QRCode(document.getElementById("tm-qrcode"), options)
    emit('onInit', qrCodeInstant.value)
  }
}
// watch(() => props.modelValue, (state, prevState) => {
//    onInit(state)
// }, { deep: true, immediate: true })

onMounted(() => {
  onInit()
})
const onChangeCodeInput = debounce((event) => {
  onInit(event.target.value)
  emit('update:modelValue', event.target.value)
}, 300)
const onQRcodeScanner = () => {
  emit('onScanner', true)
}
const onGenerator = (args) => {
  // const qrCode = NewGuid()
  onInit(args)
  emit('onGenerator', true)
  emit('update:modelValue', args)
}
const onSubmit = () => {
  emit('onSubmit', props.modelValue)
}
const onCancel = () => {
  emit('onCancel', true)
}
</script>
<template>
  <div id="tm-qrcode" class="flex justify-center mt-3 mb-3"></div>
  <div class="p-3">
    <div class="relative">
      <input :value="modelValue" @input="onChangeCodeInput"
        class="w-full bg-transparent placeholder:text-slate-400 border border-slate-200 pl-3 pr-10 py-2 transition duration-300 ease text-gray-900 text-xs dark:text-sky-500"
        :placeholder="$t('qrCode.qrCode')" />
      <!-- <button @click="onQRcodeScanner"
        class="absolute right-20 top-1 rounded bg-slate-800 p-1 border border-transparent text-center text-xs text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
          <g fill="none" stroke="currentColor" stroke-width="4">
            <path stroke-linejoin="round" d="M18 6H6v12h12zm0 24H6v12h12zm24 0H30v12h12zm0-24H30v12h12z" />
            <path stroke-linecap="round" d="M24 6v18m0 6v12m0-18H6m36 0H30" />
          </g>
        </svg>
      </button> -->
      <button @click="onGenerator(defaultValue)"
        class="absolute right-9 top-1 rounded bg-slate-800 p-1 border border-transparent text-center text-xs text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
          <g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4">
            <path d="M41 14L24 4L7 14v20l17 10l17-10z" />
            <path stroke-linecap="round" d="M16 18.998L23.993 24l8.002-5.002M24 24v9" />
          </g>
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
    <!-- <button type="button" @click="onSubmit"
      class="w-full items-center text-center content-center px-3 py-3 text-xs font-medium text-white bg-sky-500 dark:bg-sky-600">
      <span class="mr-2">{{ lblSubmit }}</span>
    </button> -->
    <button type="button" @click="onQRcodeScanner"
      class="w-full items-center text-center content-center px-3 py-3 text-xs font-medium text-white bg-sky-500 dark:bg-sky-600">
      <span class="mr-2">{{ lblScanner }}</span>
    </button>
  </div>
</template>

<style></style>
