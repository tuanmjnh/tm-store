<script setup lang="ts">
const slots = useSlots();
const emit = defineEmits<{
  (e: 'swipe-left', values: any): void
  (e: 'swipe-right', values: any): void
  (e: 'swipe-reset', values: any): void
}>()
const props = withDefaults(
  defineProps<{
    leftValue?: string
    rightValue?: string
    reset?: boolean
  }>(),
  {
    // leftValue: 'max',
    // rightValue: 'max',
    // reset: false
  })

const slotLeft = computed(() => !!slots['left'])
const slotRight = computed(() => !!slots['right'])
const refSlotLeft = ref(null)
const refSlotRight = ref(null)
const refSlotContent = ref(null)
const translateXDefault = ref('translate(0px, 0px)')

// watch(props, (v) => {
//  console.log(v)
// }, { deep: true ,immediate:true})

const translateXLeft = (val) => {
  return `translateX(${val}px)`
}
const translateXRight = (val) => {
  return `translateX(-${val}px)`
}
const onReset = () => {
  if (refSlotContent.value) {
    refSlotContent.value.style.transform = translateXDefault.value
    refSlotContent.value.style.marginRight = '0px'
    refSlotContent.value.style.marginLeft = '0px'
  }
  if (refSlotRight.value) refSlotRight.value.style.visibility = 'hidden'
  if (refSlotLeft.value) refSlotLeft.value.style.visibility = 'hidden'
}
const onSlideLeft = (val) => {
  if (refSlotContent.value.style.transform === translateXDefault.value) {
    if (slotRight.value && refSlotRight.value.children && refSlotRight.value.children.length) {
      refSlotContent.value.style.transform = translateXRight(props.rightValue === 'max' ? refSlotContent.value.offsetWidth : refSlotRight.value.children[0].offsetWidth)
      refSlotContent.value.style.marginRight = '10px'
      if (slotRight.value) refSlotRight.value.style.visibility = 'visible'
      if (slotLeft.value) refSlotLeft.value.style.visibility = 'hidden'
    }
    emit('swipe-left', onReset)
  } else {
    refSlotContent.value.style.transform = translateXDefault.value
    if (slotRight.value) refSlotRight.value.style.visibility = 'hidden'
    if (slotLeft.value) refSlotLeft.value.style.visibility = 'hidden'
    emit('swipe-reset', onReset)
    onReset()
  }
}
const onSlideRight = (val) => {

  if (refSlotContent.value.style.transform === translateXDefault.value) {
    if (slotLeft.value && refSlotLeft.value.children && refSlotLeft.value.children.length) {
      refSlotContent.value.style.transform = translateXLeft(props.leftValue === 'max' ? refSlotContent.value.offsetWidth : refSlotLeft.value.children[0].offsetWidth)
      refSlotContent.value.style.marginLeft = '10px'
      if (slotRight.value) refSlotRight.value.style.visibility = 'hidden'
      if (slotLeft.value) refSlotLeft.value.style.visibility = 'visible'
    }
    emit('swipe-right', onReset)
  } else {
    refSlotContent.value.style.transform = translateXDefault.value
    if (slotRight.value) refSlotRight.value.style.visibility = 'hidden'
    if (slotLeft.value) refSlotLeft.value.style.visibility = 'hidden'
    emit('swipe-reset', onReset)
    onReset()
  }
}

</script>
<template>
  <div class="relative overflow-hidden" v-touch:swipe.left="onSlideLeft" v-touch:swipe.right="onSlideRight"
    @click="onReset">
    <div ref="refSlotLeft" v-if="slotLeft" class="left-0 top-0 absolute" style="visibility:hidden">
      <slot name="left" />
    </div>
    <div ref="refSlotContent"
      class="flex items-center space-x-4 rtl:space-x-reverse relative overflow-hidden duration-200"
      :style="{ 'transform': translateXDefault }">
      <slot name="content" />
    </div>
    <div ref="refSlotRight" v-if="slotRight" class="right-0 top-0 absolute h-full flex items-center"
      style="visibility:hidden">
      <slot name="right" />
    </div>
  </div>
</template>

<style></style>
