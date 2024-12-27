<script setup lang="ts">
import { IProductType, IProductTypeOption, IProductTypeData } from '@/store/interfaces/product'
import { useProductStore } from '@/store'
const productStore = useProductStore()
const emit = defineEmits<{
  (e: 'onClose', value: any): any,
  (e: 'update:typeView', value: number): number
}>()
const props = defineProps<{
  types: Array<any>,//IProductType[],
  typeData: IProductTypeData,
  typeView: number
}>()
const onClose = async (arg) => {
  if (props.typeView) emit('update:typeView', 0)
  else emit('onClose', true)
}
const onChangeTypeView = (arg) => {
  emit('update:typeView', arg)
}
const onSelectTypeOption = (arg, index) => {
  if (arg && arg.length && index > -1)
    for (let i = 0; i < arg.length; i++) {
      if (i === index) arg[i].selected = true
      else arg[i].selected = false
    }
}
onSelectTypeOption(props.types[0].options, 0)
</script>
<template>
  <div v-if="typeView">
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
    </div>
    <div class="overscroll-none overflow-auto content">
      <div class="pl-6 pr-6">
        <div v-if="types && types.length" class="flex justify-center pt-5">
          <div v-if="types[0] && types[0].options.length" class="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" v-for="(e, i) in types[0].options" @click="onSelectTypeOption(types[0].options, i)"
              :class="['px-2 py-1 text-xs font-medium text-gray-900 bg-white border dark:bg-gray-800  dark:text-white', e.selected ? 'border-blue-500' : ' border-gray-500 dark:border-gray-800']">
              {{ e.label }}
            </button>
          </div>
        </div>
        <hr class="border-gray-300 dark:border-gray-100 mt-5">
        <div v-if="types && types.length > 1" class="flex justify-center pt-5">
          <div v-if="types[1] && types[1].options.length" class="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" v-for="(e, i) in types[1].options" @click="onSelectTypeOption(types[1].options, i)"
              :class="['px-2 py-1 text-xs font-medium text-gray-900 bg-white border dark:bg-gray-800  dark:text-white', e.selected ? 'border-blue-500' : ' border-gray-500 dark:border-gray-800']">
              {{ e.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="flex justify-center">
        <button v-if="types.length" type="button" @click="onChangeTypeView(1)"
          class="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-sky-500 rounded-lg dark:bg-sky-600">
          <span class="mr-2">{{ $t('global.update') }}</span>
        </button>
      </div>
    </div>
  </div>
  <div v-else>
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
            <!-- <span class="text-sm font-bold text-sky-500">{{ e.label }}</span> -->
            <input type="text" v-model="e.label" :placeholder="$t('product.typeGroup')"
              class="block p-2 text-gray-900 text-xs bg-transparent dark:text-sky-500">
            <div class="flex space-x-3">
              <svg class="text-sky-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"
                @click="productStore.addTypeOption(e.options)">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
                  d="m24.06 10l-.036 28M10 24h28" />
              </svg>
              <!-- <svg class="text-green-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                <g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4">
                  <path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z" />
                  <path stroke-linecap="round" d="M24 16v16m-8-8h16" />
                </g>
              </svg> -->
              <!-- <svg class="text-green-600" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                <g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4">
                  <path stroke-linecap="round" d="M7 42h36" />
                  <path d="M11 26.72V34h7.317L39 13.308L31.695 6z" />
                </g>
              </svg> -->
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
            <!-- <span class="text-sm">{{ o.label }}</span> -->
            <input type="text" :value="o.label" :placeholder="$t('product.typeOption')"
              class="block p-2 text-gray-900 border border-gray-300 rounded-lg bg-transparent text-xs focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <div class="flex space-x-3">
              <!-- <svg class="text-green-600" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                <g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4">
                  <path stroke-linecap="round" d="M7 42h36" />
                  <path d="M11 26.72V34h7.317L39 13.308L31.695 6z" />
                </g>
              </svg> -->
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
    <div class="footer">
      <div class="flex justify-center">
        <button v-if="types.length" type="button" @click="onChangeTypeView(1)"
          class="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-sky-500 rounded-lg dark:bg-sky-600">
          <span class="mr-2">{{ $t('global.next') }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
              d="M42 24H6m24-12l12 12l-12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>