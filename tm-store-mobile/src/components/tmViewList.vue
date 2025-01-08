<script setup lang="ts">
import tmSwipe from './tmSwipe.vue'
import { lazyLoadImage } from '@/utils/images'
const emit = defineEmits<{
  (e: 'onSelect', image: any): void
  (e: 'onPreview', image: any): void
  (e: 'onDelete', image: any): void
  (e: 'onDeleted', image: any): void
  (e: "update:selected", values: any[]): void
  (e: "update:modelValue", values: any[]): void
}>()//defineEmits(['onSelect', 'onPreview', 'onDelete'])
const props = withDefaults(
  defineProps<{
    modelValue: Array<any> | null
    selected?: Array<any>
    imageError?: string
    height?: string
    rounded?: string
    multiple?: boolean
    isDelete?: boolean
    isTooltip?: boolean
    isLoading?: boolean
    thumbnailView?: boolean
    thumbnailSize?: string
    isTrashed?: boolean
    isPreview?: boolean
    titleDelete?: string
    lblOk?: string
    lblCancel?: string,
    swipeLeftValue?: string
    swipeRightValue?: string
    swipeReset?: boolean
  }>(),
  {
    modelValue: null,
    selected: undefined,
    imageError: '/src/assets/svg/image.svg',
    height: 'h-28',
    rounded: 'rounded-lg',
    isDelete: true,
    isTooltip: false,
    thumbnailView: false,
    thumbnailSize: 'w128',
    isTrashed: false,
    isPreview: true,
    titleDelete: 'Are you sure you want to delete this record?',
    lblOk: 'Confirm',
    lblCancel: 'Cancel',
    swipeLeftValue: 'max',
    swipeRightValue: 'max',
    swipeReset: false
  })

onMounted(() => { lazyLoadImage('tm-view-list-gallery') })
watch(() => props.modelValue, n => {
  lazyLoadImage('tm-view-box-gallery')
}, { immediate: true, deep: true })

const isDialogPreview = ref(false)
const isDialogDelete = ref(false)
const selectedItem = ref({ item: null, index: -1 })

const onToggleSelect = (arg) => {
  if (props.multiple) {
    const items = props.selected == null ? [] : props.selected
    const index = props.selected.indexOf(arg)
    if (index > -1) items.splice(index, 1)
    else items.push(arg)
    emit("update:selected", items)
  } else {
    emit("update:selected", props.selected.indexOf(arg) > -1 ? [] : [arg])
  }
}
const onDelete = (arg, index) => {
  isDialogDelete.value = true
  selectedItem.value.item = arg
  selectedItem.value.index = index
  emit('onDelete', selectedItem.value)
}
const onConfirmDelete = () => {
  isDialogDelete.value = false
  if (selectedItem.value.item && selectedItem.value.index > -1) {
    const items = props.modelValue == null ? [] : props.modelValue
    items.splice(selectedItem.value.index, 1)
    emit("update:modelValue", items)
    emit('onDeleted', selectedItem.value)
  }
}
const onCancelDelete = () => {
  isDialogDelete.value = false
  selectedItem.value.item = null
  selectedItem.value.index = -1
}
const onShowPreview = (arg, index) => {
  selectedItem.value.item = arg
  selectedItem.value.index = index
  isDialogPreview.value = true
}
const onHidePreview = () => {
  selectedItem.value.item = null
  selectedItem.value.index = -1
  isDialogPreview.value = false
}
</script>
<template>
  <div class="overscroll-none overflow-auto min-h-60" style="height: calc(100vh - 225px);">
    <ul id="tm-view-list-gallery" class="space-y-4 text-left text-gray-500 dark:text-gray-400">
      <!-- <li v-for="(e, i) in modelValue" :key="i" class="flex items-center space-x-3 rtl:space-x-reverse">
        <svg class="flex-shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M1 5.917 5.724 10.5 15 1.5" />
        </svg>
        <span>{{ e.name }}</span>
      </li> -->

      <li v-for="(e, i) in modelValue" :key="i" class="pb-3 sm:pb-4">
        <!-- <div class="flex items-center space-x-4 rtl:space-x-reverse relative overflow-hidden"> -->
        <tm-swipe>
          <template #content>
            <div class="flex-shrink-0">
              <img class="lazy-image w-8 h-8 rounded-full" :alt="e.alt || e.name" :data-src="e.src || e.thumbnailLink"
                src="/src/assets/svg/image.svg" onerror="this.src='/src/assets/svg/image.svg'"
                @click="onShowPreview(e, i)">
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                {{ e.name }}
              </p>
              <!-- <p class="text-sm text-gray-500 truncate dark:text-gray-400">
            {{ e.alt }}
          </p> -->
            </div>
            <div class="inline-flex items-center text-base font-semibold text-gray-500 dark:text-white">
              {{ e.type }}
            </div>
          </template>
          <!-- class="text-xs font-medium text-center inline-flex items-center text-white bg-red-600/50 hover:bg-red-700/50">  -->
          <template #right>
            <div v-if="isTrashed" @click="onDelete(e, i)" class="block px-4 py-2 text-white transition duration-100 ease-in-out bg-red-600/50 border border-transparent
            rounded disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18 17.94 6M18 18 6.06 6" />
              </svg>
            </div>
          </template>
        </tm-swipe>
        <!-- </div> -->
      </li>
    </ul>
  </div>
  <van-dialog v-model:show="isDialogPreview" :title="selectedItem.item ? selectedItem.item.name : ''"
    :show-confirm-button="false" closeOnClickOverlay>
    <div class="inset-0 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-1 text-center">
        <div
          class="h-full w-full max-w-md transform overflow-hidden rounded-2xltext-left align-middle shadow-xl transition-all">
          <img v-if="selectedItem.item" :src="selectedItem.item.src || selectedItem.item.thumbnailLink"
            class="block h-full w-full object-cover object-center border-2 border-solid" />
        </div>
      </div>
    </div>
  </van-dialog>

  <van-dialog v-model:show="isDialogDelete" :title="titleDelete" show-cancel-button :cancelButtonText="lblCancel"
    :confirmButtonText="lblOk" @close="onCancelDelete" @confirm="onConfirmDelete">
  </van-dialog>
</template>