<script lang="ts" setup>
// import { useEventBus } from "@vueuse/core";
// import { computed, inject } from "vue";
import { checkChildSelectStatus } from './helpers'
import { Icon } from '@iconify/vue'

const emit = defineEmits<{ (e: 'change'): void }>()

const selectedNodes = inject<Set<any>>('selected-nodes')
const openedNodes = inject<Set<any>>('opened-nodes')

const props = withDefaults(
  defineProps<{
    level: number
    item: AppTypes.TreeViewNodeItem
    selectable?: boolean
    selectionMode?: AppTypes.TreeViewSelectionMode
    radio?: boolean
    disabled?: boolean
    unopenable?: boolean
    openQuick?: boolean
    color?: string
    identifier: number
    idKey?: string
    nameKey?: string
  }>(),
  {
    idKey: 'id',
    nameKey: 'name',
    selectionMode: 'leaf',
  }
)

const { emit: emitNodeOpen } = useEventBus<any>(`open-node-${props.identifier}`)
const { emit: emitNodeSelected } = useEventBus<AppTypes.TreeViewNodeItem>(`select-node-${props.identifier}`)
const { emit: emitNodeClicked } = useEventBus<AppTypes.TreeViewNodeItem>(`click-node-${props.identifier}`)
const classes = computed(() => ({ 'treeview-node--leaf': !hasChildren.value }))

const isOpen = computed(() => openedNodes?.has(props.item[props.idKey]))

const isSelected = computed(() => selectedNodes?.has(props.item[props.idKey]))

const hasChildren = computed(() => !!props.item.children && !!props.item.children.length)

const allChildrenSelected = computed(() => checkChildSelectStatus(selectedNodes!, props.item, props.idKey, 'all'))

const atLeastOneChildSelected = computed(() => checkChildSelectStatus(selectedNodes!, props.item, props.idKey, 'atLeastOne'))

const isChecked = computed(() => {
  if (hasChildren.value && props.selectionMode == 'leaf') {
    if (allChildrenSelected.value) return true
    if (atLeastOneChildSelected.value) return false
    return false
  }
  return isSelected.value
})

const isIndeterminate = computed(() => {
  if (hasChildren.value && props.selectionMode == 'leaf') {
    if (allChildrenSelected.value) return false
    if (atLeastOneChildSelected.value) return true
  }
  return false
})

// const numberOfLevels = computed(() => {
//   if (hasChildren.value || props.level !== 1) return props.level - 1;
//   return 0;
// });

const childNodeChanged = () => {
  const id = props.item[props.idKey]
  if (hasChildren.value && props.selectionMode == 'leaf') {
    if (allChildrenSelected.value) {
      if (!isSelected.value) nodeSelected()
    } else {
      if (atLeastOneChildSelected.value) {
        if (!isSelected.value) selectedNodes!.add(id)
      } else {
        if (isSelected.value) nodeSelected()
      }
    }
    emit('change')
  }
}

const nodeSelected = () => {
  emitNodeSelected(props.item)
  emit('change')
}

const nodeClicked = () => {
  if (hasChildren.value && !props.unopenable && props.openQuick) emitNodeOpen(props.item[props.idKey])
  emitNodeClicked(props.item)
  emitNodeSelected(props.item)
  emit('change')
}

const openNode = () => {
  if (hasChildren.value && !props.unopenable) emitNodeOpen(props.item[props.idKey])
}
</script>
<template>
  <li :class="classes" class="p-0 my-[2px] mx-0 first:mt-0 rounded-md">
    <div
      class="flex items-center rounded-md py-1 px-2 gap-2 bg-transparent text-surface-600 dark:text-white/70 transition-shadow duration-200">
      <!-- transform: rotate(90deg); -->
      <!-- <div class="treeview-node__content"> -->
      <!-- <div class="treeview-node__level" v-for="l in numberOfLevels" :key="l" /> -->
      <!-- <img :style="{ transform: `rotate(${isOpen ? 90 : 0}deg)` }" :class="{ open: isOpen, close: !isOpen }"
          src="./chevron.svg" width="15" height="15" v-if="hasChildren" class="treeview-node__toggle"
          @click.stop="openNode" />
        <div class="treeview-node__level" v-else /> -->
      <button type="button" tabindex="-1" v-if="hasChildren" @click.stop="openNode"
        :class="['inline-flex items-center justify-center border-0 rounded-full w-7 h-7 bg-transparent text-surface-600 dark:text-white/70 transition duration-200 cursor-pointer select-none', { open: isOpen, close: !isOpen }]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.38708 13C4.28408 13.0005 4.18203 12.9804 4.08691 12.9409C3.99178 12.9014 3.9055 12.8433 3.83313 12.7701C3.68634 12.6231 3.60388 12.4238 3.60388 12.2161C3.60388 12.0084 3.68634 11.8091 3.83313 11.6622L8.50507 6.99022L3.83313 2.31827C3.69467 2.16968 3.61928 1.97313 3.62287 1.77005C3.62645 1.56698 3.70872 1.37322 3.85234 1.22959C3.99596 1.08597 4.18972 1.00371 4.3928 1.00012C4.59588 0.996539 4.79242 1.07192 4.94102 1.21039L10.1669 6.43628C10.3137 6.58325 10.3962 6.78249 10.3962 6.99022C10.3962 7.19795 10.3137 7.39718 10.1669 7.54416L4.94102 12.7701C4.86865 12.8433 4.78237 12.9014 4.68724 12.9409C4.59212 12.9804 4.49007 13.0005 4.38708 13Z"
            fill="currentColor"></path>
        </svg>
      </button>
      <div v-else class="w-7 h-7"></div>
      <template v-if="props.selectable">
        <div class="radio-group" v-if="props.radio" @click="nodeSelected">
          <input :disabled="props.disabled" class="radio" type="radio" :checked="isChecked" />
          <span>
            {{ item[props.nameKey] }}
          </span>
        </div>
        <template v-else>
          <div class="relative inline-flex align-bottom w-5 h-5 cursor-pointer select-none" @click="nodeSelected">
            <input type="checkbox" :disabled="props.disabled" :indeterminate="isIndeterminate" :checked="isChecked"
              class="peer w-full h-full absolute top-0 left-0 z-10 p-0 m-0 opacity-0 rounded outline-none border border-surface-300 dark:border-surface-700 appearance-none cursor-pointer"
              tabindex="-1" />
            <!-- border-color: var(--van-gray-8); -->
            <div
              :class="['flex items-center justify-center w-5 h-5 rounded border transition-colors duration-200', isChecked || isIndeterminate ? 'checked' : 'border-surface-300 dark:border-surface-700 bg-surface-0 dark:bg-surface-950', props.disabled ? 'border-disable' : '']">
              <svg v-if="isChecked" width="14" height="14" viewBox="0 0 14 14" fill="none"
                xmlns="http://www.w3.org/2000/svg"
                :class="['w-[0.875rem] h-[0.875rem]  transition-all duration-200', props.disabled ? '' : 'text-white dark:text-surface-950']">
                <path
                  d="M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z"
                  fill="currentColor"></path>
              </svg>
              <svg v-if="isIndeterminate" width="14" height="14" viewBox="0 0 14 14" fill="none"
                xmlns="http://www.w3.org/2000/svg"
                :class="['w-[0.875rem] h-[0.875rem] transition-all duration-200', props.disabled ? '' : 'text-white dark:text-surface-950']">
                <path
                  d="M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z"
                  fill="currentColor"></path>
              </svg>
            </div>
          </div>
        </template>
      </template>

      <template v-if="item.icon" @click="nodeSelected">
        <Icon v-if="item.icon.match(/icon-park/g)" :icon="item.icon" class="van-badge__wrapper van-icon" />
        <van-icon v-else :name="item.icon" />
      </template>
      <!-- <span v-if="item.icon" class="pi pi-fw pi-inbox mr-2 text-surface-600 dark:text-white/70"></span> -->
      <span class="text-surface-600 dark:text-white/70" @click="nodeClicked">{{ item[props.nameKey] }}</span>
      <slot name="append" :item="item"></slot>
    </div>
    <ul class="m-0 list-none p-0 pl-4 [&:not(ul)]:pl-0 [&:not(ul)]:my-[2px]" v-if="isOpen">
      <tree-node v-for="child in props.item.children" :selectable="props.selectable" :level="props.level + 1"
        :key="child[props.idKey]" :item="child" :id-key="props.idKey" :name-key="props.nameKey" :color="props.color"
        :disabled="props.disabled" :unopenable="props.unopenable" :identifier="props.identifier" :radio="props.radio"
        :selectionMode="props.selectionMode" @change="childNodeChanged">
        <template #append="state">
          <slot name="append" :item="state.item"></slot>
        </template>
      </tree-node>
    </ul>
  </li>
</template>

<style scoped>
.border {
  border-color: #c8c9cc;
}

.border.checked {
  background-color: #1bb5fe;
}

.border.border-disable {
  border-color: #c8c9cc;
  background-color: #ebedf0;
}

.border-disable {
  border-color: #969799;
}

.dark .border-disable {
  border-color: #323233;
  background-color: #1a1d23;
}
</style>
