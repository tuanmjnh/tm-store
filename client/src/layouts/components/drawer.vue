<template>
  <q-drawer v-model="drawer" :mini="drawerMini" :mini-to-overlay="overlay" bordered
    @mouseover="onMouseOverDrawer" @mouseout="onMouseOutDrawer">
    <q-scroll-area style="height:calc(100% - 50px);margin-top:50px;">
      <q-list class="rounded-borders">
        <drawer-item v-for="(e,i) in items" :key="i" :active="onActive(e.name)" :dense="dense"
          :item="e" is-icon>
        </drawer-item>
      </q-list>
    </q-scroll-area>
    <drawer-search :is-placeholder="!drawerMini" />
  </q-drawer>
</template>
<script>
import drawerSearch from '../components/drawer-search'
import drawerItem from './drawer-item'
export default {
  components: { drawerSearch, drawerItem },
  props: {
    items: { type: Array, default: () => [] },
    dense: { type: Boolean, default: false }
  },
  data() {
    return {
      drawer: this.$q.platform.is.desktop,
      modeMini: false,
      drawerMini: false,
      overlay: false
    }
  },
  computed: {
    // onActive(name) {
    //   console.log(name, this.$route.matched.map(x => x.name).indexOf(name) > -1 || false)
    //   return this.$route.matched.map(x => x.name).indexOf(name) > -1 || false
    // }
  },
  methods: {
    onChangeModeMini() {
      if (this.modeMini) {
        this.modeMini = false
        this.drawerMini = false
      } else {
        this.modeMini = true
        this.drawerMini = true
      }
    },
    onMouseOverDrawer() {
      if (this.modeMini) {
        this.drawerMini = false
        this.overlay = true
      }
    },
    onMouseOutDrawer() {
      if (this.modeMini) {
        this.drawerMini = true
        this.overlay = false
      }
    },
    onActive(name) {
      const rs = this.$route.matched.map(x => x.name).indexOf(name) > -1 || false
      return rs
    }
  }
}
</script>
<style>
</style>
