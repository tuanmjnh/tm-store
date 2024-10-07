<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import tmSwipe from './tmSwipe.vue'
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
    modelValue: Array<any>
    selected?: Array<any>
    imageError?: string
    height?: string
    rounded?: string
    multiple?: boolean
    isDelete?: boolean
    isTooltip?: boolean
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
  <ul class="space-y-4 text-left text-gray-500 dark:text-gray-400">
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
            <img class="w-8 h-8 rounded-full" :src="e.src" :alt="e.alt" @click="onShowPreview(e, i)">
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
            <svg class="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18 17.94 6M18 18 6.06 6" />
            </svg>
          </div>
        </template>
      </tm-swipe>
      <!-- </div> -->
    </li>
  </ul>
  <TransitionRoot v-if="isPreview" appear :show="isDialogPreview" as="template">
    <Dialog as="div" @close="onHidePreview" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/90" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-1 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="h-full w-full max-w-md transform overflow-hidden rounded-2xltext-left align-middle shadow-xl transition-all">
              <img v-if="selectedItem.item" :src="selectedItem.item.src"
                class="block h-full w-full object-cover object-center border-2 border-solid" />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  <TransitionRoot appear :show="isDialogDelete" as="template">
    <Dialog as="div" @close="onCancelDelete" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                {{ titleDelete }}
              </DialogTitle>
              <div class="mt-2">
                <p class="font-bold text-gray-500">
                  {{ selectedItem && selectedItem.item ? selectedItem.item.name : '' }}
                </p>
              </div>
              <div class="mt-4 flex justify-end">
                <button type="button"
                  class="inline-flex rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 mr-3"
                  @click="onConfirmDelete">
                  {{ lblOk }}
                </button>
                <button type="button"
                  class="inline-flex rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900"
                  @click="onCancelDelete">
                  {{ lblCancel }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  <!-- <Dialog :open="isDialogDelete" @close="onCancelDelete">
    <DialogPanel>
      <DialogTitle>Deactivate account</DialogTitle>
      <DialogDescription>
        This will permanently deactivate your account
      </DialogDescription>

      <p>
        Are you sure you want to deactivate your account? All of your data will be
        permanently removed. This action cannot be undone.
      </p>

      <button @click="onCancelDelete()">Deactivate</button>
      <button @click="onCancelDelete()">Cancel</button>
    </DialogPanel>
  </Dialog> -->
</template>