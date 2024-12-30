<script setup lang="ts">
import tabBarView from "@/components/tabBarView.vue";
import router from '@/router'
import { $t } from '@/i18n'
import { useRoleStore } from '@/store'
import delay from 'delay'
const roleStore = useRoleStore()

const filter = ref({
  text: '',
  key: 'group',
  flag: 1,
  page: 1,
  rowsPerPage: 15
})
const optionFlag = [
  { text: $t(`global.activite`), value: 1 },
  { text: $t(`global.inactivite`), value: 0 },
]
const items = ref([]) //computed(() => typeStore.items)
const selected = ref([])
const isLoading = ref(false)
const isFinished = ref(false)
const isRefresh = ref(false)
const isShowFilter = ref(false)
const isShowDelete = ref(false)
const onFetch = async () => {
  //Check pull refresh
  await delay(600)
  if (isRefresh.value) {
    filter.value.page = 1
    items.value = []
    isRefresh.value = false
  }
  //Get and push row to data
  const { data, rowsNumber } = await roleStore.getItems(filter.value)
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
const onFilterFetch = async () => {
  isRefresh.value = true
  isShowFilter.value = false
  await onFetch()
}
const onAdd = async () => {
  await roleStore.setItem()
  router.push('add')
}
const onEdit = async (item) => {
  await roleStore.setItem(item)
  router.push(`edit/${item._id}`)
}
const onToggleFlag = async (item) => {
  selected.value = [toRaw(item)]
  isShowDelete.value = true
}
const onConfirmFlag = async () => {
  const rs = await roleStore.updateFlag(selected.value.map(x => { return { _id: x._id, flag: filter.value.flag == 1 ? 0 : 1 } }))
  if (rs.status) roleStore.removeItems(rs.success, items.value)
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
        <van-cell :title="item.name" :value="item.key" :label="item.desc">
          <template #title>
            <van-tag type="primary" class="mr-2">{{ item.level }}</van-tag>
            <span :style="{ color: item.color }">{{ item.name }}</span>
          </template>
        </van-cell>
        <template #right>
          <van-button square icon="edit" type="success" @click="onEdit(item)" />
          <van-button v-if="filter.flag" square icon="close" type="danger" @click="onToggleFlag(item)" />
          <van-button v-else square icon="replay" type="warning" @click="onToggleFlag(item)" />
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
    <van-search v-model="filter.text" :placeholder="$t('global.search')" />
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
    <!-- <van-cell :title="$t('global.accept')" /> -->
  </van-action-sheet>
</template>