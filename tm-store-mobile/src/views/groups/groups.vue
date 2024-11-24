<script setup lang="ts">
import treeView from '@/components/tree-view/index.vue'
import { useGroupStore } from '@/store'
import { arrayToTree } from "@/utils/tree"
const $route = useRoute()
const groupStore = useGroupStore()

const emit = defineEmits<{
  (e: 'onSelect', image: any): any
}>()
const props = withDefaults(
  defineProps<{
    text: string
    flag: number
    type: string | any
  }>(),
  {
    text: '',
    flag: 1,
    type: 'product'
  })
const all = computed(() => groupStore.all)
const items = ref(arrayToTree(all.value.filter(x => x.flag == props.flag && x.type == props.type), { parentProperty: 'parent', customID: '_id' }).sort((a, b) => a.order - b.order))
items.value.unshift({
  _id: null,
  type: null,
  parent: null,
  code: null,
  title: 'Root',
  desc: null,
  level: 0,
  content: null,
  url: null,
  images: null,
  quantity: null,
  position: null,
  tags: null,
  icon: null,
  color: null,
  meta: null,
  startAt: null,
  endAt: null,
  order: 0,
  flag: 1,
  created: { at: null, by: null, ip: null }
})
const onSelect = async (arg) => {
  emit('onSelect', arg)
}
</script>
<template>
  <div class="overscroll-none overflow-auto h-96">
    <tree-view color="blue" :items="items" id-key="_id" name-key="title" dense selectable @on-click="onSelect">
      <!-- <template #append="props">
        <van-icon id="edit-folder" name="records-o" @click="onSelect(props.item)" />
      </template> -->
    </tree-view>
  </div>
</template>