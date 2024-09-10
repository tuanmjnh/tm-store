<script setup lang="ts">
import router from '@/router'
import { $t } from '@/i18n'
import { useTypeStore } from '@/store'
import delay from 'delay'
import { Pagination } from '@/utils/pagination'
const typeStore = useTypeStore()

onMounted(() => {
  typeStore.getKey()
  typeStore.getAll(filter.value)
})

const keys = computed(() => typeStore.keys)
const all = computed(() => typeStore.all)
const filter = ref({
  text: '',
  flag: 1,
  page: 1,
  rowsPerPage: 15
})
const optionFlag = [
  { text: $t(`app.activite`), value: 1 },
  { text: $t(`app.inactivite`), value: 0 },
]
const items = ref([])
const isLoading = ref(false)
const isFinished = ref(false)
const isRefresh = ref(false)
const isShowFilter = ref(false)


const onLoadData = async () => {
  //Check pull refresh
  await delay(1000)
  if (isRefresh.value) {
    filter.value.page = 1
    items.value = []
    isRefresh.value = false
  }
  //Get and push row to data
  const page = Pagination({ items: all.value, offset: filter.value.page, limit: filter.value.rowsPerPage })
  items.value = items.value.concat(page.data)//all.value, filter.value.page, filter.value.rowsPerPage))
  filter.value.page++
  isLoading.value = false

  //Load all row Finished
  if (items.value.length >= page.rowsNumber) isFinished.value = true//all.value.length
}

const onRefresh = () => {
  isFinished.value = false
  isLoading.value = true
  onLoadData()
}
const onChangeFlag = () => {
  console.log(filter.value.flag)
  
  // filter.value.flag = filter.value.flag == 0 ? 1 : 0
}
const onBackPage = () => {
  if (window.history.state.back) history.back()
  else router.replace('/')
}
</script>

<template>
  <van-pull-refresh v-model="isRefresh" :pulling-text="$t('app.textPulling')" :loosing-text="$t('app.textLoosing')"
    :loading-text="$t('app.textLoading')" @refresh="onRefresh">
    <van-list v-model:loading="isLoading" :finished="isFinished" :finished-text="$t('app.textFinished')"
      :loading-text="$t('app.textLoading')" :offset="50" @load="onLoadData">
      <van-swipe-cell v-for="item in items" :key="item">
        <template #left>
          <van-button square icon="passed" type="primary" />
        </template>
        <van-cell :title="item.code" :value="item.name" :label="item.desc" />
        <template #right>
          <van-button square icon="edit" type="warning" />
          <van-button square icon="close" type="danger" />
        </template>
      </van-swipe-cell>
    </van-list>
  </van-pull-refresh>
  <van-tabbar placeholder fixed>
    <van-tabbar-item icon="arrow-left" @click="onBackPage()">{{ $t('app.back') }}</van-tabbar-item>
    <van-tabbar-item icon="add-o" @click="router.push('add').catch(e => { })">{{ $t('app.add') }}</van-tabbar-item>
    <van-tabbar-item icon="filter-o" @click="isShowFilter = !isShowFilter">{{ $t('app.filter') }}</van-tabbar-item>
    <!-- <van-tabbar-item v-if="filter.flag == 0" icon="completed-o" @click="onChangeFlag">
      {{ $t('app.activite') }}
    </van-tabbar-item>
    <van-tabbar-item v-else icon="delete-o" @click="onChangeFlag">
      {{ $t('app.bin') }}
    </van-tabbar-item> -->
  </van-tabbar>
  <van-popup v-model:show="isShowFilter" position="bottom" :style="{ height: '30%' }">
    <van-search v-model="filter.text" :placeholder="$t('app.search')" />
    <van-cell-group>
      <van-cell :title="$t('app.status')">
        <template #value>
          <van-dropdown-menu>
            <van-dropdown-item v-model="filter.flag" :options="optionFlag" @change="onChangeFlag">
            </van-dropdown-item>
          </van-dropdown-menu>
        </template>
      </van-cell>
    </van-cell-group>
  </van-popup>
</template>