<script setup lang="ts">
import { lazyLoadImage } from '@/utils/images'
const emit = defineEmits<{
  (e: 'onSelect', value: any): any
  (e: 'onClick', value: any): any
  (e: 'onDelete', value: any): any
  (e: 'onDeleted', value: any): any
  (e: 'update:selected', value: any[]): any
  (e: 'update:modelValue', value: any[]): any
  (e: 'update:isLoading', value: boolean): any
}>()//defineEmits(['onSelect', 'onPreview', 'onDelete'])
const props = withDefaults(
  defineProps<{
    modelValue: Array<any> | null
    selected?: Array<any>
    imageError?: string
    height?: string
    rounded?: string
    border?: string
    multiple?: boolean
    isDelete?: boolean
    isTooltip?: boolean
    isCenter?: boolean
    isLoading?: boolean
    thumbnailView?: boolean
    thumbnailSize?: string
    isTrashed?: boolean
    isPreview?: boolean
    titleDelete?: string
    lblOk?: string
    lblCancel?: string
  }>(),
  {
    modelValue: null,
    selected: undefined,
    imageError: '/src/assets/svg/image.svg',
    height: '',
    rounded: 'rounded-lg',
    border: 'border-2 border-solid',
    multiple: false,
    isDelete: true,
    isTooltip: false,
    isCenter: false,
    thumbnailView: false,
    thumbnailSize: 'w128',
    isTrashed: false,
    isPreview: true,
    titleDelete: 'Are you sure you want to delete this record?',
    lblOk: 'Confirm',
    lblCancel: 'Cancel'
  })

onMounted(() => { lazyLoadImage('tm-view-box-gallery') })
watch(() => props.modelValue, n => { lazyLoadImage('tm-view-box-gallery') }, { immediate: true, deep: true })

const isDialogPreview = ref(false)
const isDialogDelete = ref(false)
const selectedItem = ref({ item: null, index: -1 })
const onToggleSelect = (arg) => {
  if (props.multiple) {
    const items = props.selected == null ? [] : props.selected
    const index = props.selected.indexOf(arg)
    if (index > -1) items.splice(index, 1)
    else items.push(arg)
    emit('update:selected', items)
    emit('onSelect', items)
  } else {
    // console.log(arg)
    const items = props.selected.indexOf(arg) > -1 ? [] : [arg]
    emit('update:selected', items)
    emit('onSelect', items)
  }
}
const onDelete = (arg, index) => {
  selectedItem.value.item = arg
  selectedItem.value.index = index
  isDialogDelete.value = true
  emit('onDelete', selectedItem.value)
}
const onConfirmDelete = () => {
  isDialogDelete.value = false
  if (selectedItem.value.item && selectedItem.value.index > -1) {
    const items = props.modelValue == null ? [] : props.modelValue
    items.splice(selectedItem.value.index, 1)
    emit('update:modelValue', items)
    emit('onDeleted', selectedItem.value)
  }
}
const onCancelDelete = () => {
  isDialogDelete.value = false
  selectedItem.value.item = null
  selectedItem.value.index = -1
}
const onClick = (arg, index) => {
  selectedItem.value.item = arg
  selectedItem.value.index = index
  if (props.isPreview) isDialogPreview.value = true
  else emit('onClick', toRaw(selectedItem.value))
}
const onHidePreview = () => {
  selectedItem.value.item = null
  selectedItem.value.index = -1
  isDialogPreview.value = false
}
</script>
<template>
  <div class="overscroll-none overflow-auto min-h-60" style="height: calc(100vh - 225px);">
    <div id="tm-view-box-gallery" v-if="modelValue?.length > 0"
      :class="['flex flex-wrap md:-m-2', isCenter ? 'content-center justify-center' : '']">
      <div v-for="(e, i) in modelValue" :key="i" class="flex w-1/2 min-h-48 flex-wrap">
        <div class="relative w-full h-48 p-1 md:p-2">
          <div v-if="isLoading"
            class="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center">
            <div class="flex items-center justify-center w-full h-44 bg-gray-300 sm:w-96 dark:bg-gray-700 rounded">
              <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                <path
                  d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            </div>
          </div>
          <template v-else-if="selected != undefined">
            <img v-if="e.src || e.thumbnailLink" :alt="e.alt || e.name" @click="onToggleSelect(e)"
              :class="['lazy-image block h-full w-full object-cover object-center border-2 border-solid', rounded, height,
                selected.indexOf(e) > -1 ? 'border-blue-900 dark:border-blue-700 shadow shadow-blue-500/50' : 'border-slate-800/30 dark:border-slate-700']" :data-src="e.src || e.thumbnailLink"
              onerror="this.src='/src/assets/svg/image.svg'" src="/src/assets/svg/image.svg" />
            <!-- <img v-else @click=" onToggleSelect(e)"
            :class="['lazy-image block h-full w-full object-cover object-center border-2 border-solid dark:border-slate-700 border-slate-800/30', rounded, height,
              selected.indexOf(e) > -1 ? 'border-blue-900 dark:border-blue-700 shadow shadow-blue-500/50' : 'border-slate-800/30 dark:border-slate-700']"
            :data-src="imageError" src="/src/assets/svg/image.svg" /> -->
            <div v-else @click=" onToggleSelect(e)"
              class="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center">
              <div
                :class="['flex items-center justify-center w-full h-44 bg-gray-300 sm:w-96 dark:bg-gray-700', rounded, selected.indexOf(e) > -1 ? 'border-blue-900 dark:border-blue-700 shadow shadow-blue-500/50' : 'border-slate-800/30 dark:border-slate-700']">
                <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path
                    d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
              </div>
            </div>
            <div @click="onClick(e, i)"
              :class="['absolute top-1 right-7 bg-sky-600/50 hover:bg-sky-700/50 rounded-tl-none rounded-tr-none rounded-br-none', rounded]">
              <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 4H4m0 0v4m0-4 5 5m7-5h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5m7 5h4m0 0v-4m0 4-5-5" />
              </svg>
            </div>
          </template>
          <template v-else>
            <div v-if="isLoading"
              class="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center">
              <div class="flex items-center justify-center w-full h-44 bg-gray-300 sm:w-96 dark:bg-gray-700 rounded">
                <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path
                    d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
              </div>
            </div>
            <img v-else-if="e.src || e.thumbnailLink" :alt="e.alt || e.name" @click="onClick(e, i)"
              :class="['lazy-image block h-full w-full object-cover object-center dark:border-slate-700 border-slate-800/30', border, rounded, height]"
              :data-src="e.src || e.thumbnailLink" src="/src/assets/svg/image.svg"
              onerror="this.src='/src/assets/svg/image.svg'" />
            <img v-else="e.alt ||e.name" @click="onClick(e, i)"
              :class="['lazy-image block h-full w-full object-cover object-center dark:border-slate-700 border-slate-800/30', border, rounded, height]"
              :data-src="imageError" src="/src/assets/svg/image.svg" />
          </template>
          <div v-if="isTrashed" @click="onDelete(e, i)"
            :class="['absolute top-1 right-1 bg-red-600/50 hover:bg-red-700/50 rounded-tl-none rounded-bl-none rounded-br-none', rounded]">
            <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18 17.94 6M18 18 6.06 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
  <van-dialog v-model:show="isDialogPreview" :title="selectedItem.item ? selectedItem.item.name : ''"
    :show-confirm-button="false" closeOnClickOverlay>
    <div class="inset-0 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-1 text-center">
        <div
          class="h-full w-full max-w-md transform overflow-hidden rounded-2xltext-left align-middle shadow-xl transition-all">
          <img v-if="selectedItem.item" :src="selectedItem.item.src || selectedItem.item.thumbnailLink"
            class="lazy-image block h-full w-full object-cover object-center border-2 border-solid" />
        </div>
      </div>
    </div>
  </van-dialog>

  <van-dialog v-model:show="isDialogDelete" :title="titleDelete" show-cancel-button :cancelButtonText="lblCancel"
    :confirmButtonText="lblOk" @close="onCancelDelete" @confirm="onConfirmDelete">
  </van-dialog>
</template>