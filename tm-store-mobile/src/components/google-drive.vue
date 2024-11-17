<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import treeView from './tree-view/index.vue'
import { GoogleDrive, IGoogleFile } from '@/services/google/drive-gapi'
import delay from 'delay'
import { lazyLoad } from '@/utils/images'

const GDrive = new GoogleDrive()
const tab = ref('folders')
const selectedItem = ref({ item: null, index: -1 })
const folders = ref([])
const fileList = ref<gapi.client.drive.FileList>()
const isLoading = ref(false)
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
    modelValue?: Array<any>
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


const initFolders = async () => {
  isLoading.value = true
  folders.value = await GDrive.getFolders()
  // console.log(folders.value)
  fileList.value = await GDrive.getFiles({ folderId: folders.value && folders.value.length ? folders.value[0].id : null })
  // console.log(fileList.value)
  isLoading.value = false
}
initFolders()

const onGetClickFolder = async (arg) => {
  isLoading.value = true
  if (!arg.children) arg.children = await GDrive.getFolders({ folderId: arg.id })
  await delay(300)
  fileList.value = await GDrive.getFiles({ folderId: arg.id })
  isLoading.value = false
}
const onChangeTab = async (arg) => {
  if (arg == 'files') lazyLoad(fileList.value.files.map(x => x.thumbnailLink))
}
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
</script>
<template>
  <van-tabs v-model:active="tab" @change="onChangeTab">
    <van-tab name="folders">
      <template #title>
        <!-- <Icon icon="icon-park-outline:folder-open" class="van-badge__wrapper van-icon van-cell__left-icon" /> -->
        <icon-park-outline-folder-open />
      </template>
      <div class="overscroll-none overflow-auto min-h-60 max-h-128">
        <tree-view color="blue" :items="folders" dense open-all @onClick="onGetClickFolder" />
      </div>
    </van-tab>
    <van-tab name="files">
      <template #title>
        <icon-park-outline-pic-one />
      </template>
      <div class="overscroll-none overflow-auto min-h-60 max-h-128">
        <div id="drive-gallery" class="grid grid-cols-2 md:grid-cols-3 gap-4">
        </div>
        <!-- <div v-for=" (e, i) in fileList.files" :key="i">{{ e.name }}</div> -->
        <!-- <div v-for=" (e, i) in fileList.files" :key="i" class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <img class="h-auto max-w-full rounded-lg" :src="e.thumbnailLink" :alt="e.name">
          </div>
        </div> -->
      </div>
    </van-tab>
  </van-tabs>
  <div v-if="isLoading"
    class="absolute items-center block max-w-sm p-6 bg-white border border-gray-100 rounded-lg shadow-md dark:bg-gray-800/80 dark:border-gray-800 dark:hover:bg-gray-700 top-0 left-0 h-full w-full z-10">
    <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
      <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor" />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill" />
      </svg>
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<style>
.max-h-128 {
  max-height: 34rem;
}
</style>