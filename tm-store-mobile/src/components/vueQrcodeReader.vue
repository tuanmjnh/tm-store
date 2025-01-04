<script setup lang="ts">
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
interface IQRCodeOptions {
  facingMode: string
  code: string
  noRearCamera: boolean
  noFrontCamera: boolean
  paused: boolean
  torchActive: boolean
  torchNotSupported: boolean
  showScanConfirmation: boolean
}
interface IQRCodeError {
  name: string
  value: string
}
const emit = defineEmits<{
  (e: 'onCancel', values: any): any
  (e: 'onDetect', values: any): IQRCodeOptions
  (e: 'onError', values: any): IQRCodeError
}>()
const props = withDefaults(
  defineProps<{
    width?: number
    height?: number
    lblCancel?: string
  }>(),
  {
    width: 100,
    height: 100,
    lblCancel: 'Cancel'
  })
const QRCodeOptions = ref<IQRCodeOptions>({
  facingMode: 'environment',// environment, user, null
  code: '',
  noRearCamera: false,
  noFrontCamera: false,
  paused: false,
  torchActive: false,
  torchNotSupported: false,
  showScanConfirmation: false
})
/*** barcode formats ***/
const barcodeFormats = ref({
  aztec: true,
  code_128: true,
  code_39: true,
  code_93: true,
  codabar: true,
  databar: true,
  databar_expanded: true,
  data_matrix: true,
  dx_film_edge: true,
  ean_13: true,
  ean_8: true,
  itf: true,
  maxi_code: true,
  micro_qr_code: true,
  pdf417: true,
  qr_code: true,
  rm_qr_code: true,
  upc_a: true,
  upc_e: true,
  linear_codes: true,
  matrix_codes: true
})
const selectedBarcodeFormats = computed(() => {
  return Object.keys(barcodeFormats.value).filter((format) => barcodeFormats.value[format])
})
const qrcodeCaptureRef = ref(null)
const selected = ref(null as MediaDeviceInfo | null)
const devices = ref([] as MediaDeviceInfo[])
onMounted(async () => {
  devices.value = (await navigator.mediaDevices.enumerateDevices()).filter(({ kind }) => kind === 'videoinput')
  if (devices.value.length > 0) selected.value = devices.value[0]
  if (qrcodeCaptureRef.value) qrcodeCaptureRef.value.$el.removeAttribute('capture')
})
const timeout = (ms) => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
const paintBoundingBox = (detectedCodes, ctx) => {
  for (const detectedCode of detectedCodes) {
    const {
      boundingBox: { x, y, width, height }
    } = detectedCode

    ctx.lineWidth = 2
    ctx.strokeStyle = '#007bff'
    ctx.strokeRect(x, y, width, height)
  }
}
const onQRCodeDetect = async (detectedCodes) => {
  QRCodeOptions.value.code = JSON.stringify(detectedCodes.map((code) => code.rawValue))
  QRCodeOptions.value.paused = true
  await timeout(500)
  QRCodeOptions.value.paused = false
  // window.alert(QRCodeOptions.value.code)
  emit('onDetect', QRCodeOptions.value)
}
const onQRCodeSwitchCamera = () => {
  switch (QRCodeOptions.value.facingMode) {
    case 'environment':
      QRCodeOptions.value.facingMode = 'user'
      break
    case 'user':
      QRCodeOptions.value.facingMode = 'environment'
      break
  }
}
const onQRCodeCameraOn = (capabilities) => {
  QRCodeOptions.value.showScanConfirmation = false
  QRCodeOptions.value.torchNotSupported = !capabilities.torch
}
const onQRCodeCameraOff = () => {
  QRCodeOptions.value.showScanConfirmation = true
}
const onQRCodeError = (err) => {
  const error = { name: '', value: '' }
  // error.value = `[${err.name}]: `
  error.name = err.name
  if (err.name === 'NotAllowedError') {
    error.value = 'you need to grant camera access permission'
  } else if (err.name === 'NotFoundError') {
    error.value = 'no camera on this device'
  } else if (err.name === 'NotSupportedError') {
    error.value = 'secure context required (HTTPS, localhost)'
  } else if (err.name === 'NotReadableError') {
    error.value = 'is the camera already in use?'
  } else if (err.name === 'OverconstrainedError') {
    error.value = 'installed cameras are not suitable'
  } else if (err.name === 'StreamApiNotSupportedError') {
    error.value = 'Stream API is not supported in this browser'
  } else if (err.name === 'InsecureContextError') {
    error.value = 'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
  } else {
    error.value += err.message
  }
  emit('onError', error)
  // window.alert(error.value)
}
const onCancel = () => {
  QRCodeOptions.value.paused = true
  emit('onCancel', true)
}
</script>
<template>
  <qrcode-stream class="mt-3" :constraints="QRCodeOptions" :paused="QRCodeOptions.paused"
    :torch="QRCodeOptions.torchActive" :track="paintBoundingBox" :formats="selectedBarcodeFormats"
    @detect="onQRCodeDetect" @camera-on="onQRCodeCameraOn" @camera-off="onQRCodeCameraOff" @error="onQRCodeError">
    <div class="absolute top-full w-full text-center mt-16">
      <button @click="onQRCodeSwitchCamera">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48">
          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
            <path d="M12 11h5l2-4h10l2 4h5v16H12z" />
            <circle cx="24" cy="18" r="4" />
            <path
              d="M24 38C12.954 38 4 33.523 4 28c0-1.422.594-2.775 1.664-4M24 38l-4-4m4 4l-4 4m12-4.832C39.064 35.625 44 32.1 44 28c0-1.422-.594-2.775-1.664-4" />
          </g>
        </svg>
      </button>
      <button @click="qrcodeCaptureRef.$el.click()" class="ml-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48">
          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
            <path d="M39 6H9a3 3 0 0 0-3 3v30a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3" />
            <path d="M18 23a5 5 0 1 0 0-10a5 5 0 0 0 0 10m24 13L31 26l-10 9l-7-6l-8 6" />
          </g>
        </svg>
      </button>
      <button v-if="!QRCodeOptions.torchNotSupported" class="ml-10"
        @click="QRCodeOptions.torchActive = !QRCodeOptions.torchActive">
        <svg :class="[QRCodeOptions.torchActive ? 'text-sky-600' : '']" xmlns="http://www.w3.org/2000/svg" width="25"
          height="25" viewBox="0 0 48 48">
          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="4">
            <path stroke-linejoin="round" d="M31 4H16l-6 23h8l-4 17l26-28H28z" />
            <path d="m21 11l-2 8" />
          </g>
        </svg>
      </button>
      <qrcode-capture ref="qrcodeCaptureRef" class="hidden" @detect="onQRCodeDetect" />
    </div>
  </qrcode-stream>
  <div class="footer pt-2 fixed right-0 left-0 bottom-0">
    <div class="flex justify-center">
      <button @click="onCancel"
        class="w-full items-center text-center content-center px-3 py-3 text-xs font-medium text-white bg-sky-500 dark:bg-sky-600">
        <span class="mr-2">{{ lblCancel }}</span>
      </button>
    </div>
  </div>
</template>

<style></style>
