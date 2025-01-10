<script setup lang="ts">
import tabBarView from "@/components/tabBarView.vue"
import componentGroup from "@/views/groups/groups.vue"
import componentAdd from "./add.vue"
import router from '@/router'
import delay from 'delay'
import { $t } from '@/i18n'
import { debounce } from 'lodash'
import { useProductStore } from '@/store'
const productStore = useProductStore()

const filter = ref({
  text: '',
  groups: [],
  flag: 1,
  page: 1,
  rowsPerPage: 15,
  concat: true
})
// const filter = computed(() => productStore.filter)
const optionFlag = [
  { text: $t(`global.activite`), value: 1 },
  { text: $t(`global.inactivite`), value: 0 },
]
const items = computed(() => productStore.items) //ref([])
const selected = ref([])
const isLoading = ref(false)
const isFinished = ref(false)
const isRefresh = ref(false)
const isShowFilter = ref(false)
const isShowDelete = ref(false)
const isShowDuplicate = ref(false)
const isDialogGroup = ref(false)
const isDialogAdd = ref(false)
onMounted(() => {
  // groups.value = groupStore.all.filter(x => form.value.groups.includes(x._id)).sort((a, b) => a.level - b.level)
})
const onFetch = async () => {
  //Check pull refresh
  await delay(600)
  if (isRefresh.value) {
    filter.value.page = 1
    // items.value = []
    productStore.setItems()
    isRefresh.value = false
  }
  //Get and push row to data
  const { data, rowsNumber } = await productStore.getItems(filter.value)
  // items.value = items.value.concat(data)
  productStore.setItems(items.value.concat(data))
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
const onFilterFetch = async () => {
  isRefresh.value = true
  isShowFilter.value = false
  await onFetch()
}
const onSearch = debounce(async (args) => {
  isRefresh.value = true
  isShowFilter.value = false
  await onFetch()
}, 600)

const onFilterChangeGroup = async () => {
  isRefresh.value = true
  isShowFilter.value = false
  isDialogGroup.value = false
  // console.log(filter.value)
  await onFetch()
}
const onAdd = async () => {
  await productStore.setItem()
  // router.push('add')
  isDialogAdd.value = true
}
const onEdit = async (item) => {
  await productStore.setItem(item)
  // console.log(item)
  // router.push(`edit/${item._id}`)
  isDialogAdd.value = true
}
const onToggleFlag = async (item) => {
  selected.value = [toRaw(item)]
  isShowDelete.value = true
}
const onConfirmFlag = async () => {
  const rs = await productStore.updateFlag(selected.value.map(x => { return { _id: x._id, flag: filter.value.flag ? false : true } }))
  if (rs.status) productStore.removeItems(rs.success, items.value)
}
const onToggleDuplicate = async (item) => {
  selected.value = [toRaw(item)]
  isShowDuplicate.value = true
}
const onConfirmDuplicate = async () => {
  if (selected.value && selected.value.length) {
    const rs = await productStore.duplicate(selected.value[0])
    await productStore.setItem(rs.data)
    isDialogAdd.value = true
    // router.push(`edit/${rs.data._id}`)
  }
}
const onGetRoles = (item) => {
  if (!item) return ''
  const rs = []
  for (const r of item) {
    rs.push(r.name)
  }
  return rs.join(', ')
}
</script>
<template>
  <van-pull-refresh v-model="isRefresh" :pulling-text="$t('global.textPulling')"
    :loosing-text="$t('global.textLoosing')" :loading-text="$t('global.textLoading')" @refresh="onRefresh">
    <van-list v-model:loading="isLoading" :finished="isFinished" :finished-text="$t('global.textFinished')"
      :loading-text="$t('global.textLoading')" :offset="50" @load="onFetch">
      <van-swipe-cell v-for="item in items" :key="item._id">
        <template #left>
          <van-button square icon="passed" type="primary" />
        </template>
        <van-cell :title="item.title">
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
          <van-button square icon="edit" type="success" @click="onEdit(item)" class="h-full" />
          <van-button v-if="filter.flag" square icon="close" type="danger" @click="onToggleFlag(item)" />
          <van-button v-else square icon="replay" type="warning" @click="onToggleFlag(item)" />
          <van-button square icon="description-o" color="#7232dd" @click="onToggleDuplicate(item)" class="h-full" />
        </template>
      </van-swipe-cell>
    </van-list>
  </van-pull-refresh>

  <tab-bar-view>
    <template #item>
      <van-tabbar-item icon="add-o" @click="onAdd" />
      <van-tabbar-item icon="filter-o" @click="isShowFilter = !isShowFilter" />
    </template>
  </tab-bar-view>

  <van-popup v-model:show="isShowFilter" position="bottom" :style="{ height: '30%' }">
    <van-search v-model="filter.text" :placeholder="$t('global.search')" @update:model-value="onSearch" />
    <van-cell title="Cell title" is-link @click="isDialogGroup = true">
      <template #title>Nhóm</template>
    </van-cell>
    <van-cell-group>
      <van-cell :title="$t('global.status')">
        <template #value>
          <van-dropdown-menu>
            <van-dropdown-item v-model="filter.flag" :options="optionFlag" @change="onFilterFetch">
            </van-dropdown-item>
          </van-dropdown-menu>
        </template>
      </van-cell>
    </van-cell-group>
  </van-popup>
  <van-action-sheet v-model:show="isShowDelete" :cancel-text="$t('global.cancel')" close-on-click-action
    :actions="[{ name: filter.flag ? $t('global.delete') : $t('global.recover'), color: filter.flag ? '#f56c6c' : '#e6a23c' }]"
    @select="onConfirmFlag">
  </van-action-sheet>
  <van-action-sheet v-model:show="isShowDuplicate" :cancel-text="$t('global.cancel')" close-on-click-action
    :actions="[{ name: $t('global.duplicate'), color: '#7232dd' }]" @select="onConfirmDuplicate">
  </van-action-sheet>
  <van-dialog v-model:show="isDialogGroup" class="full-screen footer" :title="$t('group.titleproduct')"
    :show-cancel-button="false" :show-confirm-button="false">
    <componentGroup :flag="1" text="" type="product" :root="false" selectionMode="independent"
      v-model:selected="filter.groups" :lbl-submit="$t('global.confirm')" :lbl-cancel="$t('global.back')" is-bot
      @on-submit="onFilterChangeGroup" @on-cancel="isDialogGroup = false" />
  </van-dialog>
  <van-dialog v-model:show="isDialogAdd" class="full-screen footer"
    :title="productStore.item._id ? $t('global.update') : $t('global.add')" :show-cancel-button="false"
    :show-confirm-button="false">
    <componentAdd is-dialog @on-close="isDialogAdd = false" />
  </van-dialog>
</template>