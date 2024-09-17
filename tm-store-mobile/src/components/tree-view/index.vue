<script lang="ts" setup>
import { rand, useEventBus } from "@vueuse/core";
// import { computed, onMounted, onUnmounted, provide, reactive, watch } from "vue";
import { applyToAllChildren, checkChildSelectStatus, gatherAllNodeIds } from "./helpers";
// import { TreeViewNodeItem, TreeViewSelectionMode } from "./models";
import treeViewNode from "./treeNode.vue";

const emit = defineEmits<{
  (e: "update:modelValue", values: any[]): void;
}>();

const props = withDefaults(
  defineProps<{
    dense?: boolean;
    disabled?: boolean;
    radio?: boolean;
    openAll?: boolean;
    selectable?: boolean;
    unopenable?: boolean;
    color?: string;
    modelValue: any[];
    items: AppTypes.TreeViewNodeItem[];
    selectionMode?: AppTypes.TreeViewSelectionMode;
    itemKey?: string;
  }>(),
  {
    color: "#7e7ec2",
    selectionMode: "leaf",
    selectable: true,
    radio: false,
    itemKey: "id"
  }
);

const identifier = rand(1, 9999);

const busOpenNode = useEventBus<any>(`open-node-${identifier}`);
const busSelectNode = useEventBus<AppTypes.TreeViewNodeItem>(`select-node-${identifier}`);

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
  if (!!item.children && !!item.children.length) {
    if (
      state.selectedNodes.has(item[props.itemKey]) &&
      checkChildSelectStatus(state.selectedNodes, item, props.itemKey, "atLeastOne") &&
      !checkChildSelectStatus(state.selectedNodes, item, props.itemKey, "all")
    ) {
      applyToAllChildren(item, props.itemKey, selectNode);
    } else {
      toggleNode(item[props.itemKey]);
      applyToAllChildren(
        item,
        props.itemKey,
        state.selectedNodes.has(item[props.itemKey]) ? selectNode : unselectNode
      );
    }
  } else {
    toggleNode(item[props.itemKey]);
  }
};

const unsubscribeOpenNode = busOpenNode.on(nodeOpened);
const unsubscribeSelectNode = busSelectNode.on(nodeSelected);

const state = reactive({
  selectedNodes: new Set<any>(),
  openedNodes: new Set<any>(),
  stopRecursion: false
});

provide("selected-nodes", state.selectedNodes);
provide("opened-nodes", state.openedNodes);

const classes = computed(() => ({
  "treeview--dense": props.dense
}));

watch(() => state.selectedNodes, (val) => {
  emit("update:modelValue", [...val]);
  state.stopRecursion = true;
}, { deep: true });

watch(() => props.modelValue, (val) => {
  if (state.stopRecursion) {
    state.stopRecursion = false;
    return;
  }
  if (val.length) {
    for (const n of [...new Set(val)]) state.selectedNodes.add(n);
    return;
  }
  state.selectedNodes.clear();
}, { immediate: true });

onMounted(() => {
  if (props.openAll === true) {
    let allVals: any[] = [];
    for (const node of props.items) {
      let x = gatherAllNodeIds(node, props.itemKey, []);
      allVals = [...allVals, ...x];
    }
    for (const n of [...new Set(allVals)]) state.openedNodes.add(n);
  }
});

onUnmounted(() => {
  unsubscribeOpenNode();
  unsubscribeSelectNode();
});
</script>
<template>
  <ul class="treeview" :class="classes">
    <tree-view-node v-for="item in props.items" :selectable="props.selectable" :color="props.color" :level="1"
      :key="item[props.itemKey]" :item="item" :item-key="props.itemKey" :disabled="item.disabled"
      :unopenable="props.unopenable" :radio="props.radio" :identifier="identifier" />
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