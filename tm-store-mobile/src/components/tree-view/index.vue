<script lang="ts" setup>
import { rand, useEventBus } from "@vueuse/core";
// import { computed, onMounted, onUnmounted, provide, reactive, watch } from "vue";
import { applyToAllChildren, checkChildSelectStatus, gatherAllNodeIds } from "./helpers";
// import { TreeViewNodeItem, TreeViewSelectionMode } from "./models";
import treeViewNode from "./treeNode.vue";

const emit = defineEmits<{
  (e: "update:modelValue", values: any[]): void;
  (e: 'onClick', item: any): any
}>();

const props = withDefaults(
  defineProps<{
    dense?: boolean
    disabled?: boolean
    radio?: boolean
    openAll?: boolean
    openQuick?: boolean
    selectable?: boolean
    unopenable?: boolean
    color?: string
    modelValue?: any[]
    items: AppTypes.TreeViewNodeItem[]
    selectionMode?: AppTypes.TreeViewSelectionMode
    idKey?: string
    nameKey?: string
  }>(),
  {
    color: '#7e7ec2',
    selectionMode: 'leaf',
    selectable: false,
    radio: false,
    idKey: 'id',
    nameKey: 'name'
  }
);

const identifier = rand(1, 9999);

const busOpenNode = useEventBus<any>(`open-node-${identifier}`);
const busSelectNode = useEventBus<AppTypes.TreeViewNodeItem>(`select-node-${identifier}`);
const busClickNode = useEventBus<AppTypes.TreeViewNodeItem>(`click-node-${identifier}`);

const nodeOpened = (id: any) => {
  if (state.openedNodes.has(id)) {
    state.openedNodes.delete(id);
    return;
  }
  state.openedNodes.add(id);
};

const unselectNode = (id: any) => state.selectedNodes.delete(id);

const selectNode = (id: any) => {
  state.selectedNodes.add(id);
};

const toggleNode = (id: any) => {
  if (state.selectedNodes.has(id)) {
    unselectNode(id);
    return;
  }
  selectNode(id);
};

const nodeSelected = (item: AppTypes.TreeViewNodeItem) => {
  if (props.selectionMode == 'leaf') {
    if (!!item.children && !!item.children.length) {
      if (
        state.selectedNodes.has(item[props.idKey]) &&
        checkChildSelectStatus(state.selectedNodes, item, props.idKey, "atLeastOne") &&
        !checkChildSelectStatus(state.selectedNodes, item, props.idKey, "all")
      ) {
        applyToAllChildren(item, props.idKey, selectNode);
      } else {
        toggleNode(item[props.idKey]);
        applyToAllChildren(
          item,
          props.idKey,
          state.selectedNodes.has(item[props.idKey]) ? selectNode : unselectNode
        );
      }
    } else {
      toggleNode(item[props.idKey]);
    }
  } else {
    toggleNode(item[props.idKey]);
  }
};

const nodeclick = (item: AppTypes.TreeViewNodeItem) => {
  state.clickNode = item as any;
  emit('onClick', item);
};

const unsubscribeOpenNode = busOpenNode.on(nodeOpened);
const unsubscribeSelectNode = busSelectNode.on(nodeSelected);
const unsubscribeClickNode = busClickNode.on(nodeclick);

const state = reactive({
  selectedNodes: new Set<any>(),
  openedNodes: new Set<any>(),
  clickNode: new Set<any>(),
  stopRecursion: false
});

provide("selected-nodes", state.selectedNodes);
provide("opened-nodes", state.openedNodes);
provide("click-node", state.clickNode);

const classes = computed(() => ({ "treeview--dense": props.dense }));

const onOpenNodes = () => {
  if (props.openAll === true) {
    let allVals: any[] = [];
    for (const node of props.items) {
      let x = gatherAllNodeIds(node, props.idKey, []);
      allVals = [...allVals, ...x];
    }
    for (const n of [...new Set(allVals)]) state.openedNodes.add(n);
  }
}

watch(() => state.selectedNodes, (val) => {
  emit("update:modelValue", [...val]);
  state.stopRecursion = true;
}, { deep: true });

watch(() => props.modelValue, (val) => {
  if (state.stopRecursion) {
    state.stopRecursion = false;
    return;
  }
  if (val && val.length) {
    for (const n of [...new Set(val)]) state.selectedNodes.add(n);
    return;
  }
  state.selectedNodes.clear();
}, { immediate: true });

watch(() => props.items, (val) => {
  onOpenNodes()
}, { deep: true, immediate: true });

onMounted(() => {
  onOpenNodes()
});

onUnmounted(() => {
  unsubscribeOpenNode();
  unsubscribeSelectNode();
  unsubscribeClickNode();
});
</script>
<template>
  <ul class="treeview" :class="classes">
    <tree-view-node v-for="item in props.items" :selectable="props.selectable" :color="props.color" :level="1"
      :key="item[props.idKey]" :item="item" :id-key="props.idKey" :name-key="props.nameKey" :disabled="item.disabled"
      :unopenable="props.unopenable" :radio="props.radio" :identifier="identifier" :openQuick="props.openQuick"
      :selectionMode="props.selectionMode">
      <template #append="state">
        <slot name="append" :item="state.item"></slot>
      </template>
    </tree-view-node>
  </ul>
</template>
<style>
.open {
  transform: rotate(90deg);
}

.close {
  transform: rotate(0deg);
}
</style>