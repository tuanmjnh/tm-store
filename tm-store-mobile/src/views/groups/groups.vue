<script setup lang="ts">
import treeView from '@/components/tree-view/index.vue'
import { useGroupStore } from '@/store'
import { arrayToTree } from "@/utils/tree"
import { $t } from '@/i18n'
const $route = useRoute()
const groupStore = useGroupStore()

const emit = defineEmits<{
  (e: 'onSelect', value: any): any
  (e: 'onSubmit', value: any): any
  (e: 'onCancel', value?: any): any,
  (e: 'update:selected', value): any
}>()
const props = withDefaults(
  defineProps<{
    text: string
    flag: number
    type: string | any,
    selected?: Array<any> | undefined,
    root?: boolean,
    isBot?: boolean,
    selectionMode?: AppTypes.TreeViewSelectionMode,
    lblSubmit?: string,
    lblCancel?: string
  }>(),
  {
    text: '',
    flag: 1,
    type: 'product',
    selected: null,
    root: true,
    isBot: false,
    selectionMode: 'leaf',
    lblSubmit: 'Submit',
    lblCancel: 'Cancel'
  })
const treeSelected = ref(props.selected ? props.selected : [])
const all = computed(() => groupStore.all)
const items = ref(arrayToTree(all.value.filter(x => x.flag == props.flag && x.type == props.type), { parentProperty: 'parent', customID: '_id', order: 'order' }))
const groupRoot = groupStore.root
groupRoot.title = $t('group.root', 'Root')
if (props.root) items.value.unshift(groupRoot)
const onSelect = async (arg) => {
  emit('onSelect', arg)
}
const onSubmit = async (arg) => {
  emit('update:selected', treeSelected.value)
  emit('onSubmit', treeSelected.value)
}
const onCancel = async (arg) => {
  emit('onCancel')
}
</script>
<template>
  <div class="overscroll-none overflow-auto content mt-3">
    <tree-view v-model="treeSelected" :items="items" id-key="_id" name-key="title" dense open-all
      :selectable="selected ? true : false" :selection-mode="selectionMode" color="blue" @on-click="onSelect">
      <!-- <template #append="props">
        <van-icon id="edit-folder" name="records-o" @click="onSelect(props.item)" />
      </template> -->
    </tree-view>
  </div>
  <!-- <hr class="border-gray-300 dark:border-gray-100"> -->
  <div v-if="isBot" class="footer pt-2 fixed right-0 left-0 bottom-0">
    <div class="flex justify-center">
      <!-- <van-button type="primary" square size="small" @click="onSubmit">{{ lblSubmit }}</van-button>
    <div class="w-6"></div>
    <van-button type="default" square size="small" @click="onCancel">{{ lblCancel }}</van-button> -->
      <button type="button" @click="onCancel"
        class="w-full items-center text-center content-center px-3 py-3 text-xs font-medium text-white">
        <span class="mr-2">{{ lblCancel }}</span>
      </button>
      <button type="button" @click="onSubmit"
        class="w-full items-center text-center content-center px-3 py-3 text-xs font-medium text-white bg-sky-500 dark:bg-sky-600">
        <span class="mr-2">{{ lblSubmit }}</span>
      </button>
    </div>
  </div>
</template>