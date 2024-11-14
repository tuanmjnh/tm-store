<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
const emit = defineEmits<{
  (e: 'onSelect', image: any): any
  (e: 'onClick', image: any): any
  (e: 'onDelete', image: any): any
  (e: 'onDeleted', image: any): any
  (e: "update:selected", values: any[]): any
  (e: "update:modelValue", values: any[]): any
}>()//defineEmits(['onSelect', 'onPreview', 'onDelete'])
const props = withDefaults(
  defineProps<{
    modelValue: Array<any>
    selected?: Array<any>
    imageError?: string
    height?: string
    rounded?: string
    border?: string
    multiple?: boolean
    isDelete?: boolean
    isTooltip?: boolean
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
    height: 'h-28',
    rounded: 'rounded-lg',
    border: 'border-2 border-solid',
    multiple: false,
    isDelete: true,
    isTooltip: false,
    thumbnailView: false,
    thumbnailSize: 'w128',
    isTrashed: false,
    isPreview: true,
    titleDelete: 'Are you sure you want to delete this record?',
    lblOk: 'Confirm',
    lblCancel: 'Cancel'
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
    emit('onSelect', items)
  } else {
    // console.log(arg)
    const items = props.selected.indexOf(arg) > -1 ? [] : [arg]
    emit("update:selected", items)
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
    emit("update:modelValue", items)
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
  emit('onClick',toRaw(selectedItem.value))
  if (props.isPreview) isDialogPreview.value = true
}
const onHidePreview = () => {
  selectedItem.value.item = null
  selectedItem.value.index = -1
  isDialogPreview.value = false
}
</script>
<template>
  <div v-if="modelValue?.length > 0" class="-m-1 flex flex-wrap md:-m-2 content-center justify-center">
    <div v-for="(e, i) in modelValue" :key="i" class="flex w-1/2 flex-wrap">
      <div class="relative w-full p-1 md:p-2">
        <template v-if="selected != undefined">
          <img v-if="e.src" :alt="e.alt || ''" @click="onToggleSelect(e)"
            :class="['block h-28 w-full object-cover object-center border-2 border-solid', rounded, height,
              selected.indexOf(e) > -1 ? 'border-blue-900 dark:border-blue-700 shadow shadow-blue-500/50' : 'border-slate-800/30 dark:border-slate-700']" :src="e.src" />
          <img v-else="e.alt || ''" @click="onToggleSelect(e)"
            :class="['block h-28 w-full object-cover object-center border-2 border-solid dark:border-slate-700 border-slate-800/30', rounded, height,
              selected.indexOf(e) > -1 ? 'border-blue-900 dark:border-blue-700 shadow shadow-blue-500/50' : 'border-slate-800/30 dark:border-slate-700']"
            :src="imageError" />
          <div @click="onClick(e, i)"
            :class="['absolute top-1 right-7 bg-sky-600/50 hover:bg-sky-700/50 rounded-tl-none rounded-tr-none rounded-br-none', rounded]">
            <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 4H4m0 0v4m0-4 5 5m7-5h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5m7 5h4m0 0v-4m0 4-5-5" />
            </svg>
          </div>
        </template>
        <template v-else>
          <img v-if="e.src" :alt="e.alt || ''" @click="onClick(e, i)"
            :class="['block h-28 w-full object-cover object-center dark:border-slate-700 border-slate-800/30', border, rounded, height]"
            :src="e.src" />
          <img v-else="e.alt || ''" @click="onClick(e, i)"
            :class="['block h-28 w-full object-cover object-center dark:border-slate-700 border-slate-800/30', border, rounded, height]"
            :src="imageError" />
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
  <TransitionRoot appear :show="isDialogPreview" as="template">
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
              <!-- <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Your payment has been successfully submitted. We’ve sent you
                  an email with all of the details of your order.
                </p>
              </div> -->
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
</template>