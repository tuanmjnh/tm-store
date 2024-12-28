<script setup lang="ts">
import { IProductType, IProductTypeOption, IProductTypeData } from '@/store/interfaces/product'
import { useProductStore } from '@/store'
const productStore = useProductStore()
const typeOneSelected = ref(null)
const formUpdateAll = ref({ price: 0, priceImport: 0, quantity: 0 })
const emit = defineEmits<{
  (e: 'onClose', value: any): any,
  (e: 'onUpdate', value: any): any,
  (e: 'onUpdateAll', value: any): any,
  (e: 'update:typeView', value: number): number
}>()
const props = defineProps<{
  types: Array<any>,//IProductType[],
  typeData: Object,
  typeView: number
}>()
const onClose = async () => {
  const v = props.typeView - 1
  if (v < 0) emit('onClose', true)
  else emit('update:typeView', v)
}
const onChangeTypeView = (arg) => {
  emit('update:typeView', arg)
}
const onSelectTypeOption = (arg, index) => {
  if (arg && arg.length && index > -1) {
    for (let i = 0; i < arg.length; i++) {
      if (i === index) arg[i].selected = true
      else arg[i].selected = false
    }
    typeOneSelected.value = arg[index]
  }
}
onSelectTypeOption(props.types[0].options, 0)
const onUpdate = (arg) => {
  emit('onUpdate', true)
}
const onUpdateAll = () => {
  productStore.updateAllTypeData(props.types, props.typeData, formUpdateAll.value).then(x => {
    formUpdateAll.value = { price: 0, priceImport: 0, quantity: 0 }
    emit('onUpdateAll', true)
    onClose()
  })
}
</script>
<template>
  <div v-if="typeView == 0">
    <div class="title">
      <div class="flex justify-between">
        <svg @click="onClose" class="ml-5" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
          viewBox="0 0 48 48">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
            d="M5.799 24h36m-24 12l-12-12l12-12" />
        </svg>
        <div>{{ $t('product.type') }}</div>
        <div class="mr-5"></div>
      </div>
    </div>
    <div class="overscroll-none overflow-auto content">
      <div class="pl-6 pr-6">
        <div class="pt-5 pb-8" v-for="(e, i) in types">
          <div class="flex justify-between pb-5">
            <input type="text" v-model="e.label" :placeholder="$t('product.typeGroup')"
              class="block p-2 text-gray-900 text-xs bg-transparent dark:text-sky-500">
            <div class="flex space-x-3">
              <svg class="text-sky-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"
                @click="productStore.addTypeOption(e.options)">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
                  d="m24.06 10l-.036 28M10 24h28" />
              </svg>
              <svg class="text-rose-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"
                @click="productStore.removeTypeGroup(types, i)">
                <g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4">
                  <path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z" />
                  <path stroke-linecap="round" d="M29.657 18.343L18.343 29.657m0-11.314l11.314 11.314" />
                </g>
              </svg>
            </div>
          </div>
          <div class="flex justify-between pb-5" v-for="(o, j) in e.options">
            <input type="text" :value="o.label" :placeholder="$t('product.typeOption')"
              class="block p-2 text-gray-900 border border-gray-300 rounded-lg bg-transparent text-xs focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <div class="flex space-x-3">
              <svg class="text-rose-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"
                @click="productStore.removeTypeOption(e.options, o.id)">
                <g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4">
                  <path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z" />
                  <path stroke-linecap="round" d="M29.657 18.343L18.343 29.657m0-11.314l11.314 11.314" />
                </g>
              </svg>
            </div>
          </div>
          <hr class="border-gray-300 dark:border-gray-100">
        </div>
      </div>
      <div v-if="types.length < 2" class="flex justify-center mt-6">
        <button type="button" @click="productStore.addTypeGroup(types)"
          class="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg dark:bg-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
              d="m24.06 10l-.036 28M10 24h28" />
          </svg>
          {{ $t('product.addType') }}
        </button>
      </div>
    </div>
    <div class="footer pt-2 fixed right-0 left-0 bottom-0">
      <div class="flex justify-center">
        <button v-if="types.length" type="button" @click="onChangeTypeView(1)"
          class="w-full items-center text-center content-center px-3 py-3 text-xs font-medium text-white bg-sky-500 dark:bg-sky-600">
          <span class="mr-2">{{ $t('global.next') }}</span>
          <!-- <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
              d="M42 24H6m24-12l12 12l-12 12" />
          </svg> -->
        </button>
      </div>
    </div>
  </div>
  <div v-if="typeView == 1">
    <div class="title">
      <div class="flex justify-between">
        <svg @click="onClose" class="ml-5" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
          viewBox="0 0 48 48">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
            d="M5.799 24h36m-24 12l-12-12l12-12" />
        </svg>
        <div>{{ $t('product.typeUpdate') }}</div>
        <div class="mr-5"></div>
      </div>
      <div v-if="types && types.length > 1" class="flex justify-center pt-5">
        <div v-if="types[0] && types[0].options.length" class="inline-flex rounded-md shadow-sm" role="group">
          <button type="button" v-for="(e, i) in types[0].options" @click="onSelectTypeOption(types[0].options, i)"
            :class="['px-2 py-1 text-xs font-medium text-gray-900 bg-white border dark:bg-gray-800  dark:text-white', e.selected ? 'border-blue-500' : ' border-gray-500 dark:border-gray-800']">
            {{ e.label }}
          </button>
        </div>
      </div>
      <hr class="border-gray-300 dark:border-gray-100 mt-5">
    </div>
    <div class="overscroll-none overflow-auto content2">
      <div class="pl-6 pr-6">
        <div v-if="types && types.length == 1" class="pt-5">
          <div v-for="(e, i) in types[0].options" class="pb-5">
            <div class="relative inline-flex items-center w-full py-2 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-1" width="20" height="20" viewBox="0 0 48 48">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                  <path d="M10 44h28a2 2 0 0 0 2-2V14H30V4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2M30 4l10 10" />
                  <circle cx="18" cy="17" r="4" />
                  <path d="M15 28v9h18V21l-9.51 10.5z" />
                </g>
              </svg>
              <span class="text-gray-900 dark:text-white"> {{ e.label }}</span>
            </div>
            <div class="flex-row">
              <div class="flex justify-center justify-items-center content-center items-center">
                <!-- <span>{{ typeData[e.id].priceImport }}</span> -->
                <input type="number" v-model="typeData[e.id].priceImport" :placeholder="$t('product.priceImport')"
                  class="block w-full p-2 mb-1 text-gray-900 text-xs bg-transparent dark:text-sky-500 border border-gray-300">
                <!-- <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                  <g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4">
                    <path stroke-linecap="round" d="M42 26v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14" />
                    <path d="M14 26.72V34h7.317L42 13.308L34.695 6z" />
                  </g>
                </svg> -->
              </div>
              <div class="flex justify-center justify-items-center content-center items-center">
                <input type="number" v-model="typeData[e.id].price" :placeholder="$t('product.priceSale')"
                  class="block w-full p-2 mb-1 text-gray-900 text-xs bg-transparent dark:text-sky-500 border border-gray-300">
              </div>
              <div class="flex justify-center justify-items-center content-center items-center">
                <input type="number" v-model="typeData[e.id].quantity" :placeholder="$t('product.quantity')"
                  class="block w-full p-2 mb-1 text-gray-900 text-xs bg-transparent dark:text-sky-500 border border-gray-300">
              </div>
            </div>
          </div>
        </div>
        <div v-if="types && types.length > 1" class="pt-5">
          <div v-for="(e, i) in types[1].options" class="pb-5">
            <div class="relative inline-flex items-center w-full py-2 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-1" width="20" height="20" viewBox="0 0 48 48">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                  <path d="M10 44h28a2 2 0 0 0 2-2V14H30V4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2M30 4l10 10" />
                  <circle cx="18" cy="17" r="4" />
                  <path d="M15 28v9h18V21l-9.51 10.5z" />
                </g>
              </svg>
              <span class="text-gray-900 dark:text-white"> {{ e.label }}</span>
            </div>
            <div class="flex-row pt-2">
              <div class="relative z-0 w-full mb-5 group">
                <input type="number" v-model="typeData[typeOneSelected.id][e.id].priceImport"
                  class="block py-2 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required />
                <label for="floating_email"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  {{ $t('product.priceImport') }}
                </label>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <input type="number" v-model="typeData[typeOneSelected.id][e.id].price"
                  class="block py-2 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required />
                <label for="floating_email"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  {{ $t('product.priceSale') }}
                </label>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <input type="number" v-model="typeData[typeOneSelected.id][e.id].quantity"
                  class="block py-2 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required />
                <label for="floating_email"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  {{ $t('product.quantity') }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer pt-2 fixed right-0 left-0 bottom-0">
      <div class="flex justify-center">
        <!-- <button v-if="types.length" type="button" @click="onChangeTypeView(1)"
          class="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-sky-500 rounded-lg dark:bg-sky-600">
          <span class="mr-2">{{ $t('global.update') }}</span>
        </button> -->
        <button v-if="types.length" type="button" @click="onChangeTypeView(2)"
          class="w-full items-center text-center content-center px-3 py-3 text-xs font-medium text-white bg-indigo-500 dark:bg-indigo-600">
          <span class="mr-2">{{ $t('product.typeUpdates') }}</span>
        </button>
        <button v-if="types.length" type="button" @click="onUpdate"
          class="w-full items-center text-center content-center px-3 py-3 text-xs font-medium text-white bg-sky-500 dark:bg-sky-600">
          <span class="mr-2">{{ $t('global.update') }}</span>
        </button>
      </div>
    </div>
  </div>
  <div v-if="typeView == 2">
    <div class="title">
      <div class="flex justify-between">
        <svg @click="onClose" class="ml-5" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
          viewBox="0 0 48 48">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
            d="M5.799 24h36m-24 12l-12-12l12-12" />
        </svg>
        <div>{{ $t('product.typeUpdate') }}</div>
        <div class="mr-5"></div>
      </div>
      <hr class="border-gray-300 dark:border-gray-100 mt-5">
    </div>
    <div class="overscroll-none overflow-auto content2">
      <div class="pl-6 pr-6">
        <div class="pt-6">
          <div class="relative z-0 w-full mb-5 group">
            <input type="number" v-model="formUpdateAll.priceImport"
              class="block py-2 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required />
            <label for="floating_email"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              {{ $t('product.priceImport') }}
            </label>
          </div>
          <div class="relative z-0 w-full mb-5 group">
            <input type="number" v-model="formUpdateAll.price"
              class="block py-2 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required />
            <label for="floating_email"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              {{ $t('product.priceSale') }}
            </label>
          </div>
          <div class="relative z-0 w-full mb-5 group">
            <input type="number" v-model="formUpdateAll.quantity"
              class="block py-2 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required />
            <label for="floating_email"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              {{ $t('product.quantity') }}
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="footer pt-2 fixed right-0 left-0 bottom-0">
      <div class="flex justify-center">
        <button v-if="types.length" type="button" @click="onUpdateAll"
          class="w-full items-center text-center content-center px-3 py-3 text-xs font-medium text-white bg-sky-500 dark:bg-sky-600">
          <span class="mr-2">{{ $t('global.update') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>