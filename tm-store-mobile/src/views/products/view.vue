<script setup lang="ts">
import delay from 'delay'
import { $t } from '@/i18n'
import { useProductStore } from '@/store'
const productStore = useProductStore()

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
  // if (n) {
  //   isFinished.value = false
  //   isLoading.value = true
  // }
  onFetch()
}, { deep: true })

const items = ref([])
const isLoading = ref(false)
const isFinished = ref(false)
const isRefresh = ref(false)
onMounted(() => {
  // groups.value = groupStore.all.filter(x => form.value.groups.includes(x._id)).sort((a, b) => a.level - b.level)
})
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
</script>
<template>
  <van-pull-refresh v-model="isRefresh" :pulling-text="$t('global.textPulling')"
    :loosing-text="$t('global.textLoosing')" :loading-text="$t('global.textLoading')" @refresh="onRefresh">
    <van-list v-model:loading="isLoading" :finished="isFinished" finished-text=""
      :loading-text="$t('global.textLoading')" :offset="50" @load="onFetch">
      <van-swipe-cell v-for="item in items" :key="item._id">
        <template #left>
          <van-button square icon="passed" type="primary" />
        </template>
        <van-cell :title="item.title" :label="item.fullName">
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
          <!-- <van-button square icon="edit" type="success" @click="onEdit(item)" class="h-full" />
          <van-button v-if="filter.flag" square icon="close" type="danger" @click="onToggleFlag(item)" />
          <van-button v-else square icon="replay" type="warning" @click="onToggleFlag(item)" />
          <van-button square icon="description-o" color="#7232dd" @click="onToggleDuplicate(item)" class="h-full" /> -->
        </template>
      </van-swipe-cell>
    </van-list>
  </van-pull-refresh>
</template>