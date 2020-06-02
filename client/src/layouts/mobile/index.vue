<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :class="$store.state.app.darkMode?'bg-black':''">
      <q-toolbar>
        <q-btn flat dense round @click="onChangeModeMini" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>
        <header-right />
        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>
    <drawer ref="drawer" :items="$store.getters.routes" :dense="$store.getters.dense.menu" />
    <q-page-container>
      <q-page padding>
        <slot v-if="$store.state.auth.user" />
        <!-- <q-spinner v-else color="primary" size="3em" :thickness="2" /> -->
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import drawer from '../components/drawer'
import headerRight from '../components/header-right'
export default {
  components: { drawer, headerRight },
  data() {
    return {
      title: 'TM-Store' // process.env.APP_NAME,
    }
  },
  created() {
    // get status
    // console.log(this.$q.dark.isActive) // true, false

    // get configured status
    // console.log(this.$q.dark.mode) // "auto", true, false

    // set status
    // this.$q.dark.set(true) // or "false" or "auto"

    // toggle
    // this.$q.dark.toggle()
  },
  methods: {
    onChangeModeMini() {
      this.$refs.drawer.onChangeModeMini()
    }
  }
}
</script>

<style lang="scss">
// .q-drawer__content {
// background-color: #304156;
// color: white;
// }
</style>
