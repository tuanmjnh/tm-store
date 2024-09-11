<script setup lang="ts">

const props = defineProps({
  show: { type: Boolean, default: false },
  hideLeft: { type: Boolean, default: false },
  placeholder: { type: Boolean, default: true },
  fixed: { type: Boolean, default: true },
})
const actions = [
  { name: 'Option 1' },
  { name: 'Option 2' },
  { name: 'Option 3' },
];

</script>
<template>
  <van-action-sheet v-model:show="show" :actions="actions" cancel-text="Cancel" close-on-click-action>
    <van-cell title="Cell title" is-link />
    <van-cell title="Cell title" is-link />
    <van-cell title="Cell title" is-link />
  </van-action-sheet>
</template>