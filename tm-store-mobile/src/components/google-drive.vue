<script setup lang="ts">
import { GoogleDrive, IGoogleFile } from '@/services/google/drive-gapi'
import { lazyLoadImage } from '@/utils/images'
import delay from 'delay'
import treeView from './tree-view/index.vue'
const props = withDefaults(
  defineProps<{
    modelValue?: Array<any>
    selected?: Array<any>
    parent?: string
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
    lblAdd?: string
    lblUpdate?: string
    lblDelete?: string
    lblCancel?: string
  }>(),
  {
    modelValue: null,
    selected: undefined,
    parent: '1DFDqKNAf2pCR_PFu3iS1gtMyGRWgf8jV',
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
    lblAdd: 'Add',
    lblUpdate: 'Update',
    lblDelete: 'Delete',
    lblCancel: 'Cancel'
  }
)
const emit = defineEmits<{
  (e: 'onSelect', image: any): void
  (e: 'onPreview', image: any): void
  (e: 'onDelete', image: any): void
  (e: 'onDeleted', image: any): void
  (e: 'onClose'): void
  (e: 'update:selected', values: any[]): void
  (e: 'update:modelValue', values: any[]): void
}>() //defineEmits(['onSelect', 'onPreview', 'onDelete'])

const tab = ref('folders')
const selectedItem = ref({ item: null, index: -1 })
const folders = ref([])
const fileList = ref<gapi.client.drive.FileList>()
const isLoading = ref(false)
const isDialogShowFolder = ref(false)
const isDialogEditFolder = ref(false)
const GDrive = new GoogleDrive({ root: props.parent })

const onChangeTab = async (arg) => {
  if (arg == 'files') lazyLoadImage() //lazyLoad(fileList.value.files, 'thumbnailLink')
}
const onClose = async () => {
  emit('onClose')
}
const initFolders = async () => {
  isLoading.value = true
  folders.value = await GDrive.GetFolders()
  // console.log(folders.value)
  fileList.value = await GDrive.GetFiles({
    folderId: folders.value && folders.value.length ? folders.value[0].id : null,
    mimeType: GDrive.MIME_TYPE.image
  })
  lazyLoadImage()//lazyLoad(fileList.value.files, 'thumbnailLink')
  isLoading.value = false
}
initFolders()

const onGetClickFolder = async (arg) => {
  isLoading.value = true
  isDialogShowFolder.value = false
  if (!arg.children) arg.children = await GDrive.GetFolders({ folderId: arg.id })
  await delay(300)
  fileList.value = await GDrive.GetFiles({ folderId: arg.id, mimeType: GDrive.MIME_TYPE.image })
  lazyLoadImage() //lazyLoad(fileList.value.files.map((x) => x.thumbnailLink))
  isLoading.value = false
}
const onEditFolder = async (arg) => {
  selectedItem.value.item = arg
  isDialogEditFolder.value = true
}
const onCancelEditFolder = async (arg) => {
  isDialogEditFolder.value = false
  selectedItem.value.item = null
}
const onConfirmUpdateFolder = async (arg) => {
  console.log(arg)
}
const onConfirmAddFolder = async (arg) => {
  const folder = await GDrive.CreateFolder({ name: 'test3' })
  if (folder) {
    if (arg.children) arg.children.push(folder)
    else arg.children = [folder]
  }
}
const onConfirmDeleteFolder = async (arg) => {
  console.log(arg)
}
const onSelectImage = async (args) => {
  // console.log(args)
  emit('onSelect', args)
}
</script>
<template>
  <div class="fixed right-0 left-0 top-0">
    <div class="flex flex-none p-2">
      <div class="h-6 w-24 items-center justify-center pl-5" @click="isDialogShowFolder = !isDialogShowFolder">
        <van-icon name="apps-o" class="pr-1" />
        <span>Drive</span>
      </div>
      <div class="flex h-6 grow"></div>
      <div class="flex flex-none h-6 w-12 items-center justify-center">
        <van-icon name="cross" @click="onClose" />
      </div>
    </div>
    <hr class="border-gray-300 dark:border-gray-100">
  </div>
  <div class="overscroll-none overflow-auto mt-5 min-h-60" style="height: calc(100vh - 46px);">
    <div v-show="!isDialogShowFolder" id="drive-gallery" class="m-1 flex flex-wrap md:-m-2 mb-10">
      <div v-if="fileList && fileList.files" v-for="(e, i) in fileList.files" :key="i"
        class="flex w-1/2 min-h-48 flex-wrap">
        <div class="relative w-full h-48 p-1 md:p-2">
          <div class="absolute inset-0 bg-neutral-200 animate-pulse w-full h-full min-h-24"></div>
          <img class="lazy-image h-full w-full object-cover transition-opacity duration-300 opacity-0 rounded-lg"
            :data-src="e.thumbnailLink" src="/src/assets/svg/image.svg" onerror="this.src='/src/assets/svg/image.svg'"
            @click="onSelectImage(e)">
        </div>
      </div>
    </div>
    <tree-view v-show="isDialogShowFolder" color="blue" :items="folders" dense open-all @onClick="onGetClickFolder"
      class="overscroll-none overflow-auto">
      <template #append="props">
        <van-icon id="edit-folder" name="records-o" @click="onEditFolder(props.item)" />
      </template>
    </tree-view>
  </div>
  <div v-if="isLoading"
    class="absolute items-center block p-6 bg-white border border-gray-100 rounded-lg shadow-md dark:bg-gray-800/80 dark:border-gray-800 dark:hover:bg-gray-700 top-0 left-0 h-full w-full z-10">
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
  <van-action-sheet v-model:show="isDialogEditFolder"
    :title="selectedItem && selectedItem.item ? selectedItem.item.name : ''" :cancel-text="lblCancel"
    close-on-click-action @close="onCancelEditFolder">
    <div class="p-2 mb-3">
      <input type="text" id="first_name"
        class="bg-gray-50 border border-gray-300 text-surface-600 dark:text-white/70 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="New folder" />
    </div>
    <van-cell :title="lblUpdate" is-link @click="onConfirmUpdateFolder" />
    <van-cell :title="lblAdd" is-link @click="onConfirmAddFolder" />
    <van-cell :title="lblDelete" is-link @click="onConfirmDeleteFolder" />
  </van-action-sheet>
</template>

<style>
.h-120 {
  height: 32rem;
}

.min-h-128 {
  min-height: 34rem;
}

.max-h-128 {
  max-height: 34rem;
}
</style>
