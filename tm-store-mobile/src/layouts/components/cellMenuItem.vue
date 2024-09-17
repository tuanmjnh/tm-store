<script setup lang="ts">
import { useAppStore } from '@/store'
import router from '@/router';
import { isExternal } from '@/utils/validate';
import { Icon } from '@iconify/vue'

const appStore = useAppStore()
const props = defineProps({
  basePath: { type: String, default: '' },
  item: { type: Object, default: () => { } }
})

const emit = defineEmits<{
  change: [page: number, pageSize: number] // 具名元组语法
}>()

const page = ref(1)
const pageSize = ref(10)

function changePage() {
  emit('change', page.value, pageSize.value)
}
const onClick = (e) => {
  // console.log(e.path)
  if (e.meta && e.meta.href && isExternal(e.meta.href)) window.open(e.meta.href, '_blank');
  else {
    const url = props.basePath ? `${props.basePath}/${e.path}` : e.path
    router.push(url).catch(e => { console.log(e) })
  }
  appStore.isLeftMenu = false
}
const showPopover = ref(false);
const onSelect = (action) => {
  showPopover.value = false
  appStore.isLeftMenu = false
}
// const checkIcon = (txt: string) => {
//   if (txt.match(/icon-park/g)) return renderIcon(txt)!()
//   else return 'not'
// }
</script>

<template>
  <template v-if="item.children && item.children.length">
    <van-cell v-if="item && item.meta && !item.meta.hide" is-link :title="$t(`route.${item.meta.title}`, item.name)"
      arrow-direction="down" @click="showPopover = !showPopover">
      <template #icon>
        <Icon v-if="item.meta.icon.match(/icon-park/g)" :icon="item.meta.icon"
          class="van-badge__wrapper van-icon van-cell__left-icon" />
        <van-icon v-else :name="item.meta.icon" class="van-cell__left-icon" />
      </template>
      <template #value>
        <van-popover v-model:show="showPopover" placement="left-start" @select="onSelect">
          <van-list>
            <cell-menu-item v-for="(e, i) in item.children" :key="i" :item="e" />
          </van-list>
        </van-popover>
      </template>
    </van-cell>
  </template>
  <template v-else>
    <van-cell v-if="item && item.meta && !item.meta.hide" is-link icon="shop-o" @click="onClick(item)"
      :title="$t(`route.${item.meta.title}`, item.name)">
      <template #icon>
        <Icon v-if="item.meta.icon.match(/icon-park/g)" :icon="item.meta.icon"
          class="van-badge__wrapper van-icon van-cell__left-icon" />
        <van-icon :name="item.meta.icon" class="van-cell__left-icon" />
      </template>
    </van-cell>
  </template>
</template>

<style scoped></style>
