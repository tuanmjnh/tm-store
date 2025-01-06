<script setup lang="ts">
import delay from 'delay'
import { $t } from '@/i18n'
import { useGroupStore, useProductStore, IModelProduct } from '@/store'
import { GoogleDrive } from '@/services/google/drive-gapi'
const productStore = useProductStore()
const groupStore = useGroupStore()
const GDrive = new GoogleDrive()
const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): any
}>()//defineEmits(['onSelect', 'onPreview', 'onDelete'])
const props = withDefaults(
  defineProps<{
    modelValue: string
  }>(),
  {
    modelValue: null
  })

const filter = ref({
  text: '',
  groups: [],
  flag: 1,
  page: 1,
  rowsPerPage: 15
})
watch(() => props.modelValue, n => {
  filter.value.text = n
  items.value = []
  // if (n) {
  //   isFinished.value = false
  //   isLoading.value = true
  // }
  onFetch()
}, { deep: true })

const items = ref([])
const isLoading = ref(false)
const isFinished = ref(false)
const isDialogPrice = ref(false)
const isDialogDetails = ref(false)
const isRefresh = ref(false)
const isImagesLoading = ref(false)
const isShowImagePreview = ref(false)
const itemSelected = ref<IModelProduct>(null)
const typeSelected = ref(null)
const groups = ref([])
const images = ref([
  // 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  // 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
  // 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
])

watch(() => itemSelected.value, n => {
  if (itemSelected.value && itemSelected.value.types && itemSelected.value.types.length)
    onSelectTypeOption(itemSelected.value.types[0].options, 0)
  if (itemSelected.value.groups && itemSelected.value.groups.length)
    groups.value = groupStore.all.filter(x => itemSelected.value.groups.includes(x._id)).sort((a, b) => a.level - b.level)

  if (itemSelected.value.images) {
    isImagesLoading.value = true
    GDrive.GetFilesById({ ids: itemSelected.value.images.map(x => x.id) })
      .then(x => { images.value = x.map(x => x.thumbnailLink) })
      .finally(() => isImagesLoading.value = false)
  } else images.value = []
  // if (itemSelected.value.images && itemSelected.value.images.length) {
  //   images.value = itemSelected.value.images.map(x => x.thumbnailLink)
  // } else {
  //   images.value = []
  // }
}, { deep: true })
// onMounted(() => {
//   if (itemSelected.value && itemSelected.value.types && itemSelected.value.types.length) onSelectTypeOption(itemSelected.value.types[0].options, 0)
// })
const onFetch = async () => {
  if (!filter.value.text) {
    isFinished.value = true
    isLoading.value = false
    filter.value.page = 1
    items.value = []
    return
  } else {
    isFinished.value = false
    isLoading.value = true
    filter.value.page = 1
  }
  //Check pull refresh
  await delay(600)
  if (isRefresh.value) {
    filter.value.page = 1
    items.value = []
    isRefresh.value = false
  }
  //Get and push row to data
  const { data, rowsNumber } = await productStore.getItems(filter.value)
  items.value = items.value.concat(data)
  filter.value.page++
  isLoading.value = false
  //Load all row Finished
  if (items.value.length >= rowsNumber || !data.length) isFinished.value = true
}

const onRefresh = async () => {
  isFinished.value = false
  isLoading.value = true
  await onFetch()
}
const onShowPrice = (args) => {
  itemSelected.value = args
  isDialogPrice.value = true
}
const onShowDetails = (args) => {
  // console.log(args)
  itemSelected.value = args
  isDialogDetails.value = true
}
const onSelectTypeOption = (arg, index) => {
  if (arg && arg.length && index > -1)
    typeSelected.value = arg[index]
}
</script>
<template>
  <div class="overscroll-none overflow-auto" style="height: calc(100vh - 175px);">
    <van-pull-refresh v-model="isRefresh" :pulling-text="$t('global.textPulling')"
      :loosing-text="$t('global.textLoosing')" :loading-text="$t('global.textLoading')" @refresh="onRefresh">
      <van-list v-model:loading="isLoading" :finished="isFinished" finished-text=""
        :loading-text="$t('global.textLoading')" :offset="50" @load="onFetch">
        <van-swipe-cell v-for="item in items" :key="item._id">
          <template #left>
            <van-button square icon="passed" type="primary" />
          </template>
          <van-cell :title="item.title" :label="item.fullName" @click="onShowPrice(item)">
            <template #title>
              <span class="mr-2 block overflow-hidden truncate w-52">{{ item.title }}</span>
            </template>
            <template #label>
              <van-tag type="primary">{{ item.code }}</van-tag>
            </template>
            <template #value>
              <div class="grid grid-flow-row">
                <!-- <div class="text-blue-600 dark:text-white">{{ productStore.getValueType(item, 'price', ' - ', true) }}</div> -->
                <div>
                  <span v-for="(p, pi) in productStore.getValueType(item, 'price', null, true)">
                    <b class="text-sky-600">{{ p }}</b>{{ pi < 1 ? ' - ' : '' }} </span>
                </div>
                <div>
                  <span v-for="(p, pi) in productStore.getValueType(item, 'quantity', null, true)">
                    <b class="text-green-700">{{ p }}</b>{{ pi < 1 ? ' - ' : '' }} </span>
                </div>
              </div>
            </template>
          </van-cell>
          <template #right>
            <van-button square icon="comment-o" type="success" @click="onShowDetails(item)" class="h-full" />
            <button type="button" class="van-button van-button--warning van-button--normal van-button--square h-full">
              <div class="van-button__content">
                <i class="van-badge__wrapper van-button__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48">
                    <g fill="none" stroke="currentColor" stroke-width="4">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M5 7h6l7 17h17.5L43 10m-22 2h12m-6-6v12m-9 6l-4 6h26" />
                      <circle cx="19" cy="39" r="3" />
                      <circle cx="35" cy="39" r="3" />
                    </g>
                  </svg>
                </i>
              </div>
            </button>
            <!-- <van-button square icon="edit" type="success" @click="onEdit(item)" class="h-full" />
          <van-button v-if="filter.flag" square icon="close" type="danger" @click="onToggleFlag(item)" />
          <van-button v-else square icon="replay" type="warning" @click="onToggleFlag(item)" />
          <van-button square icon="description-o" color="#7232dd" @click="onToggleDuplicate(item)" class="h-full" /> -->
          </template>
        </van-swipe-cell>
      </van-list>
    </van-pull-refresh>
  </div>
  <van-dialog v-model:show="isDialogPrice" :title="$t('tabs.salesInf')" class="full-screen footer"
    :show-cancel-button="false" :show-confirm-button="false" close-on-click-action close-on-click-overlay>
    <template #title>
      <div>{{ $t('global.details') }}: {{ itemSelected.title || '' }}</div>
    </template>
    <div v-if="itemSelected.types && itemSelected.types.length > 1" class="flex justify-center pt-5">
      <div v-if="itemSelected.types[0] && itemSelected.types[0].options.length" class="inline-flex rounded-md shadow-sm"
        role="group">
        <button type="button" v-for="(e, i) in itemSelected.types[0].options"
          @click="onSelectTypeOption(itemSelected.types[0].options, i)"
          :class="['px-2 py-1 text-xs font-medium text-gray-900 bg-white border dark:bg-gray-800  dark:text-white', typeSelected.id && e.id == typeSelected.id ? 'border-blue-500' : ' border-gray-500 dark:border-gray-800']">
          {{ e.label }}
        </button>
      </div>
    </div>
    <hr class="border-gray-300 dark:border-gray-100 mt-5">
    <div class="overscroll-none overflow-auto content2">
      <div class="pl-6 pr-6">
        <div v-if="itemSelected.types && itemSelected.types.length == 1" class="pt-5">
          <div v-for="(e, i) in itemSelected.types[0].options" class="pb-5">
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
              <van-cell-group>
                <van-cell :title="$t('product.priceImport')">
                  <template #value>
                    <span class="text-sky-600">
                      {{ itemSelected.typeData[e.id].priceImport ?
                        itemSelected.typeData[e.id].priceImport.format() :
                        0 }}
                    </span>
                  </template>
                </van-cell>
                <van-cell :title="$t('product.priceSale')">
                  <template #value>
                    <span class="text-sky-600">
                      {{ itemSelected.typeData[e.id].price ? itemSelected.typeData[e.id].price.format() : 0 }}
                    </span>
                  </template>
                </van-cell>
                <van-cell :title="$t('product.quantity')">
                  <template #value>
                    <span class="text-sky-600">
                      {{ itemSelected.typeData[e.id].quantity ? itemSelected.typeData[e.id].quantity.format() : 0 }}
                    </span>
                  </template>
                </van-cell>
              </van-cell-group>
            </div>
          </div>
        </div>
        <div v-else-if="itemSelected.types && itemSelected.types.length > 1" class="pt-5">
          <div v-for="(e, i) in itemSelected.types[1].options" class="pb-5">
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
              <van-cell-group>
                <van-cell :title="$t('product.priceImport')">
                  <template #value>
                    <span class="text-sky-600">
                      {{ itemSelected.typeData[typeSelected.id][e.id].priceImport ?
                        itemSelected.typeData[typeSelected.id][e.id].priceImport.format() : 0 }}
                    </span>
                  </template>
                </van-cell>
                <van-cell :title="$t('product.priceSale')">
                  <template #value>
                    <span class="text-sky-600">
                      {{
                        itemSelected.typeData[typeSelected.id][e.id].price ?
                          itemSelected.typeData[typeSelected.id][e.id].price.format() :
                          0 }}
                    </span>
                  </template>
                </van-cell>
                <van-cell :title="$t('product.quantity')">
                  <template #value>
                    <span class="text-sky-600">
                      {{
                        itemSelected.typeData[typeSelected.id][e.id].quantity ?
                          itemSelected.typeData[typeSelected.id][e.id].quantity.format()
                          : 0 }}
                    </span>
                  </template>
                </van-cell>
              </van-cell-group>
            </div>
          </div>
        </div>
        <div v-else class="pt-5">
          <van-cell-group>
            <van-cell :title="$t('product.priceImport')">
              <template #value>
                <span class="text-sky-600">
                  {{ itemSelected.priceImport ? itemSelected.priceImport.format() : 0 }}
                </span>
              </template>
            </van-cell>
            <van-cell :title="$t('product.priceSale')">
              <template #value>
                <span class="text-sky-600">
                  {{ itemSelected.price ? itemSelected.price.format() : 0 }}
                </span>
              </template>
            </van-cell>
            <van-cell :title="$t('product.quantity')">
              <template #value>
                <span class="text-sky-600">
                  {{ itemSelected.quantity ? itemSelected.quantity.format() : 0 }}
                </span>
              </template>
            </van-cell>
          </van-cell-group>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="footer pt-2 fixed right-0 left-0 bottom-0">
        <div class="flex justify-center">
          <button type="button" @click="isDialogPrice = false"
            class="w-full items-center text-center content-center px-3 py-3 text-xs font-medium text-white bg-sky-500 dark:bg-sky-600">
            <span class="mr-2">{{ $t('global.back') }}</span>
          </button>
        </div>
      </div>
    </template>
  </van-dialog>
  <van-dialog v-model:show="isDialogDetails" :title="$t('global.details')" class="full-screen footer"
    :show-cancel-button="false" :show-confirm-button="false" close-on-click-action close-on-click-overlay>
    <template #title>
      <div>{{ $t('global.details') }}: {{ itemSelected.title || '' }}</div>
    </template>
    <template #footer>
      <div class="footer pt-2 fixed right-0 left-0 bottom-0">
        <div class="flex justify-center">
          <button type="button" @click="isDialogDetails = false"
            class="w-full items-center text-center content-center px-3 py-3 text-xs font-medium text-white bg-sky-500 dark:bg-sky-600">
            <span class="mr-2">{{ $t('global.back') }}</span>
          </button>
        </div>
      </div>
      <div class="overscroll-none overflow-auto" style="height: calc(100vh - 125px);">
        <div class="pl-6 pr-6">
          <div class="flex flex-wrap md:-m-2 content-center justify-center mb-5">
            <div v-if="isImagesLoading" class="w-full h-48">
              <div
                class="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center">
                <div class="flex items-center justify-center w-full h-44 bg-gray-300 sm:w-96 dark:bg-gray-700 rounded">
                  <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path
                      d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                  </svg>
                </div>
              </div>
            </div>
            <div v-else-if="images && images.length" class="relative w-full h-48 p-1 md:p-2">
              <img class="block h-full w-full object-cover object-center border-2 border-solid" :src="images[0]"
                alt="image description" onerror="this.src='/src/assets/svg/image.svg'"
                @click="isShowImagePreview = true">
            </div>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 48 48">
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                <path d="M39 6H9a3 3 0 0 0-3 3v30a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3" />
                <path d="M18 23a5 5 0 1 0 0-10a5 5 0 0 0 0 10m24 13L31 26l-10 9l-7-6l-8 6" />
              </g>
            </svg>
          </div>
          <van-cell-group>
            <van-cell :title="itemSelected.title" :label="itemSelected.code" />
            <van-cell :title="$t('group.title')">
              <template #value>
                {{ groups && groups.length ? groups.map(x => x.title).join(', ') : $t('global.updating') }}
              </template>
            </van-cell>
            <van-cell :title="$t('global.unit')" :value="itemSelected.unit" />
            <van-cell :title="$t('product.weight')" :value="itemSelected.weight || $t('global.updating')" />
            <van-cell :title="$t('product.brand')" :value="itemSelected.brand || $t('global.updating')" />
            <van-cell :title="$t('product.originName')" :value="itemSelected.originName || $t('global.updating')" />
            <van-cell :title="$t('product.date')" :value="itemSelected.date || $t('global.updating')" />
            <van-cell :title="$t('global.desc')" :label="itemSelected.desc || $t('global.updating')" />
          </van-cell-group>
        </div>
      </div>
    </template>
  </van-dialog>
  <van-image-preview v-model:show="isShowImagePreview" :images="images" />
</template>