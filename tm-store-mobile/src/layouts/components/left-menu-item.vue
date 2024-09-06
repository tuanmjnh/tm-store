<script setup lang="ts">
import { useAppStore } from '@/store'
import router from '@/router';
import { isExternal } from '@/utils/validate';

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
const onclick = (e) => {
  // console.log(e.path)
  if (e.meta && e.meta.href && isExternal(e.meta.href)) window.open(e.meta.href, '_blank');
  else {
    const url = props.basePath ? `${props.basePath}/${e.path}` : e.path
    router.push(url).catch(e => { console.log(e) })
  }
  appStore.isLeftMenu = false
}

const onCollapseToggle = (item) => {
  document.getElementById(item.name).classList.toggle('hidden')
}
</script>

<template>
  <template v-if="item.children && item.children.length">
    <li v-if="item && item.meta && !item.meta.hide">
      <button type="button" :data-collapse-toggle="item.name" @click="onCollapseToggle(item)"
        class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
        <svg
          class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
          aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">
          <path
            d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
        </svg>
        <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{{ $t(`route.${item.name}`,
          $t(`route.${item.meta.title}`)) }}</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m1 1 4 4 4-4" />
        </svg>
      </button>
      <ul :id="item.name" class="py-2 space-y-2 hidden">
        <left-menu-item v-for="(e, i) in item.children" :key="i" :item="e"></left-menu-item>
      </ul>
    </li>
  </template>
  <template v-else>
    <li v-if="item && item.meta && !item.meta.hide">
      <a href="#" @click="onclick(item)"
        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
        <svg
          class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
          aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
          <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
          <path
            d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
        </svg>
        <span class="ms-3">{{ $t(`route.${item.name}`, $t(`route.${item.meta.title}`)) }}</span>
      </a>
    </li>
  </template>
</template>

<style scoped></style>
