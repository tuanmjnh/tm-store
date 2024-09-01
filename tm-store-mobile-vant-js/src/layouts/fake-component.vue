<template>
  <component :is="component"></component>
</template>

<script>
//Vue 3 is having a special function to define these async functions
import { defineAsyncComponent } from "vue";

export default {
  name: "DynamicComponent",
  //I am passing the name of the Component as a prop
  props: {
    componentLoad: { required: true } // type: String
  },
  computed: {
    component() {
      // console.log(this.componentLoad)
      // return this.componentLoad//defineAsyncComponent(() => import(`../${this.componentName}.vue`))
      return defineAsyncComponent(this.componentLoad)
    }
  }
}
</script>
