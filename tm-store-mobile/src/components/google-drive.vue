<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { GoogleDrive, IGoogleFile } from '@/services/google/drive-gapi'
import { lazyLoad } from '@/utils/images'
import delay from 'delay'
import treeView from './tree-view/index.vue'

const GDrive = new GoogleDrive()
const tab = ref('folders')
const selectedItem = ref({ item: null, index: -1 })
const folders = ref([])
const fileList = ref<gapi.client.drive.FileList>()
const isLoading = ref(false)
const isDialogFolder = ref(false)
const emit = defineEmits<{
  (e: 'onSelect', image: any): void
  (e: 'onPreview', image: any): void
  (e: 'onDelete', image: any): void
  (e: 'onDeleted', image: any): void
  (e: 'update:selected', values: any[]): void
  (e: 'update:modelValue', values: any[]): void
}>() //defineEmits(['onSelect', 'onPreview', 'onDelete'])
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
    lblAdd?: string
    lblUpdate?: string
    lblDelete?: string
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
    lblAdd: 'Add',
    lblUpdate: 'Update',
    lblDelete: 'Delete',
    lblCancel: 'Cancel'
  }
)

const onChangeTab = async (arg) => {
  if (arg == 'files') lazyLoad(fileList.value.files.map((x) => x.thumbnailLink))
}

const initFolders = async () => {
  isLoading.value = true
  folders.value = await GDrive.GetFolders()
  // console.log(folders.value)
  fileList.value = await GDrive.GetFiles({
    folderId: folders.value && folders.value.length ? folders.value[0].id : null,
    mimeType: GDrive.MIME_TYPE.image
  })
  isLoading.value = false
}
initFolders()

const onGetClickFolder = async (arg) => {
  isLoading.value = true
  if (!arg.children) arg.children = await GDrive.GetFolders({ folderId: arg.id })
  await delay(300)
  fileList.value = await GDrive.GetFiles({ folderId: arg.id, mimeType: GDrive.MIME_TYPE.image })
  isLoading.value = false
}
const onAddFolder = async (arg) => {
  selectedItem.value.item = arg
  isDialogFolder.value = true
}
const onCancelAddFolder = async (arg) => {
  isDialogFolder.value = false
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
const onToggleSelect = (arg) => {
  if (props.multiple) {
    const items = props.selected == null ? [] : props.selected
    const index = props.selected.indexOf(arg)
    if (index > -1) items.splice(index, 1)
    else items.push(arg)
    emit('update:selected', items)
  } else {
    emit('update:selected', props.selected.indexOf(arg) > -1 ? [] : [arg])
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
        <tree-view color="blue" :items="folders" dense open-all @onClick="onGetClickFolder">
          <template #append="props">
            <van-icon name="records-o" @click="onAddFolder(props.item)" />
          </template>
        </tree-view>
      </div>
    </van-tab>
    <van-tab name="files">
      <template #title>
        <icon-park-outline-pic-one />
      </template>
      <div class="overscroll-none overflow-auto min-h-60 max-h-128">
        <div id="drive-gallery" class="grid grid-cols-2 md:grid-cols-3 gap-4"></div>
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
  <TransitionRoot appear :show="isDialogFolder" as="template">
    <Dialog as="div" @close="onCancelAddFolder" class="relative" style="z-index: 2002;">
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
              class="w-full max-w-md transform overflow-hidden rounded-2xlbg-white border border-gray-100 rounded-lg dark:bg-gray-800/80 dark:border-gray-800 p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-surface-600 dark:text-white/70">
                {{ selectedItem && selectedItem.item ? selectedItem.item.name : '' }}
              </DialogTitle>
              <!-- <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Your payment has been successfully submitted. We’ve sent you
                  an email with all of the details of your order.
                </p>
              </div> -->
              <input type="text" id="first_name"
                class="bg-gray-50 border border-gray-300 text-surface-600 dark:text-white/70 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="New folder" />
              <div class="mt-4 flex justify-end">
                <button type="button"
                  class="inline-flex rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-green-600 mr-3"
                  @click="onConfirmUpdateFolder">
                  {{ lblAdd }}
                </button>
                <button type="button"
                  class="inline-flex rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-500 mr-3"
                  @click="onConfirmAddFolder">
                  {{ lblUpdate }}
                </button>
                <button type="button"
                  class="inline-flex rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-red-500 mr-3"
                  @click="onConfirmDeleteFolder">
                  {{ lblDelete }}
                </button>
                <button type="button"
                  class="inline-flex rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-gray-900"
                  @click="onCancelAddFolder">
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

<style>
.max-h-128 {
  max-height: 34rem;
}
</style>
