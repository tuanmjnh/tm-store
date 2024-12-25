<script setup lang="ts">
import treeView from '@/components/tree-view/index.vue'
import { useGroupStore } from '@/store'
import { arrayToTree } from "@/utils/tree"
import { $t } from '@/i18n'
const $route = useRoute()
const groupStore = useGroupStore()

const emit = defineEmits<{
  (e: 'onSelect', image: any): any
  (e: 'onSubmit', selected: any): any
  (e: 'onCancel'): any
}>()
const props = withDefaults(
  defineProps<{
    text: string
    flag: number
    type: string | any,
    selected?: Array<any> | undefined,
    root?: boolean,
    isBot?: boolean,
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
    lblSubmit: 'Submit',
    lblCancel: 'Cancel'
  })
const treeSelected = ref(props.selected ? props.selected : [])
const all = computed(() => groupStore.all)
const items = ref(arrayToTree(all.value.filter(x => x.flag == props.flag && x.type == props.type), { parentProperty: 'parent', customID: '_id' }).sort((a, b) => a.order - b.order))
const groupRoot = groupStore.root
groupRoot.title = $t('group.root', 'Root')
if (props.root) items.value.unshift(groupRoot)

const onSelect = async (arg) => {
  emit('onSelect', arg)
}
const onSubmit = async (arg) => {
  emit('onSubmit', treeSelected.value)
}
const onCancel = async (arg) => {
  emit('onCancel')
}
</script>
<template>
  <div class="overscroll-none overflow-auto h-96">
    <tree-view v-model="treeSelected" :items="items" id-key="_id" name-key="title" dense open-all
      :selectable="selected ? true : false" color="blue" @on-click="onSelect">
      <!-- <template #append="props">
        <van-icon id="edit-folder" name="records-o" @click="onSelect(props.item)" />
      </template> -->
    </tree-view>
  </div>
  <hr class="border-gray-300 dark:border-gray-100">
  <div v-if="isBot" class="flex justify-center mb-3 mt-3">
    <van-button type="primary" square size="small" @click="onSubmit">{{ lblSubmit }}</van-button>
    <div class="w-6"></div>
    <van-button type="default" square size="small" @click="onCancel">{{ lblCancel }}</van-button>
  </div>
</template>