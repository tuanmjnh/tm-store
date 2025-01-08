<script setup lang="ts">
import tabBarView from "@/components/tabBarView.vue"
import treeView from '@/components/tree-view/index.vue'
import componentAdd from "./add.vue"
import router from '@/router'
import delay from 'delay'
import { $t } from '@/i18n'
import { useGroupStore } from '@/store'
import { arrayToTree } from "@/utils/tree"
const $route = useRoute()
const groupStore = useGroupStore()
const filter = ref({
  text: '',
  type: $route.meta.module,
  flag: 1,
  page: 1,
  rowsPerPage: 15
})
const optionFlag = [
  { text: $t(`global.activite`), value: 1 },
  { text: $t(`global.inactivite`), value: 0 },
]
const all = computed(() => groupStore.all)
const items = ref(arrayToTree(all.value.filter(x => x.flag == filter.value.flag && x.type == filter.value.type), { parentProperty: 'parent', customID: '_id', order: 'order' }))
const selected = ref([])
const isLoading = ref(false)
const isRefresh = ref(false)
const isShowFilter = ref(false)
const isShowDelete = ref(false)
const isDialogAdd = ref(false)
const onFetch = async () => {
  await delay(600)
  // items.value = arrayToTree(items.value, { parentProperty: 'parent', customID: 'id' })
  // console.log(items.value)
}
onFetch()
const onFilterFetch = async () => {
  isRefresh.value = true
  isShowFilter.value = false
  await onFetch()
}
const onAdd = async () => {
  await groupStore.setItem()
  isDialogAdd.value = true
  // router.push('add')
}
const onEdit = async (item) => {
  await groupStore.setItem(item)
  isDialogAdd.value = true
  // router.push(`edit/${item._id}`)
}
const onToggleFlag = async (item) => {
  selected.value = [toRaw(item)]
  isShowDelete.value = true
}
const onConfirmFlag = async () => {
  const rs = await groupStore.updateFlag(selected.value.map(x => { return { _id: x._id, flag: filter.value.flag || 0 } }))
  if (rs.status) groupStore.removeItems(rs.success, items.value)
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
  <tree-view color="blue" :items="items" id-key="_id" name-key="title" v-model="selected" dense selectable>
    <template #append="props">
      <van-icon id="edit-folder" name="records-o" @click="onEdit(props.item)" />
    </template>
  </tree-view>

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
  <van-dialog v-model:show="isDialogAdd" class="full-screen footer"
    :title="groupStore.item._id ? $t('global.update') : $t('global.add')" :show-cancel-button="false"
    :show-confirm-button="false">
    <componentAdd is-dialog @on-close="isDialogAdd = false" />
  </van-dialog>
</template>