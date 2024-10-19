<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  width: string
  height: string
  fit: any
}>(), {
  src: '',
  width: '50',
  height: '50',
  fit: ''
});

</script>

<template>
  <van-image v-if="props.src && props.src.length" :width="props.width" :height="props.height" :fit="props.fit"
    :src="props.src" />
  <img v-else :width="props.width" :height="props.height" src="@/assets/svg/image.svg" />
</template>

<style scoped></style>
