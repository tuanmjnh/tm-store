<script lang="ts">
import { useCustomFieldValue } from '@vant/use'
export default {
  props: ['text'],
  setup(props) {
    useCustomFieldValue(() => props.text)
    const text = ref(props.text)
    console.log(text.value)
    return { text }
  }
}
</script>
<template>
  {{ text }}
</template>