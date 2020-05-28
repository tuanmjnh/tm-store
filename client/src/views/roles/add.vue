<template>
  <q-card style="width:700px;max-width:80vw">
    <q-toolbar>
      <q-avatar :icon="$route.meta.icon" size="50px" />
      <q-toolbar-title>
        {{this.item?$t('global.update'):$t('global.add')}}
        <span class="text-weight-bold">{{$t('roles.title')}}</span>
      </q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup
        :disable="loadingAdd||loadingDrafts?true:false">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-separator />
    <q-form ref="form">
      <q-card-actions v-if="item" align="right">
        <q-btn flat type="submit" :dense="$store.getters.dense.button" color="amber"
          icon="offline_pin" :label="$t('global.update')" :loading="loadingAdd"
          @click.prevent="onSubmit">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-card-actions v-else align="right">
        <q-btn flat type="submit" :dense="$store.getters.dense.button" color="blue"
          icon="check_circle" :label="$t('global.add')" :loading="loadingAdd"
          :disable="loadingDrafts" @click.prevent="onSubmit(1)">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
        <q-btn flat type="submit" :dense="$store.getters.dense.button" color="amber" icon="receipt"
          :label="$t('global.drafts')" :loading="loadingDrafts" :disable="loadingAdd"
          @click.prevent="onSubmit(0)">
          <!-- <q-tooltip>{{$t('global.drafts')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form"
        class="text-deep-purple" align="justify">
        <q-tab name="main" :label="$t('tabs.main')" />
        <q-tab name="routes" label="Menu" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-tab-panels v-model="tabs" animated>
        <q-tab-panel name="main">
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.key" :dense="$store.getters.dense.input" v-lowercase
                :label="$t('roles.key')" :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              <q-input v-model.trim="form.name" :dense="$store.getters.dense.input"
                :label="$t('roles.name')" :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col">
              <q-input v-model="form.level" type="number" :dense="$store.getters.dense.input"
                :label="$t('global.level')" :rules="[v=>v!==null&&v!==''||$t('error.required')]"
                class="col-md-4" />
            </div>
            <q-space v-if="item" />
            <div class="col-5 self-center" v-if="item">
              <q-toggle v-model="form.flag" :true-value="1" :dense="$store.getters.dense.input"
                :label="form.flag?$t('global.publish'):$t('global.drafts')" />
            </div>
            <q-space />
            <div class="col self-center">
              {{$t('global.colorPick')}}:
              <q-badge :style="{backgroundColor:form.color}" @click="dialogColorPick=true">
                {{form.color}}</q-badge>
            </div>
          </div>
          <q-input v-model.trim="form.desc" autogrow :dense="$store.getters.dense.input"
            :label="$t('global.desc')" />
        </q-tab-panel>
        <q-tab-panel name="routes">
          <q-tree ref="routes" class="col-12 col-sm-6" :nodes="routes"
            :dense="$store.getters.dense.input" node-key="name" node-label="label"
            :ticked.sync="ticked" tick-strategy="strict" :no-nodes-label="$t('table.noData')"
            default-expand-all @update:ticked="onTickedUpdate">
            <template v-slot:default-header="prop">
              <div class="row items-center">
                <q-icon :name="prop.node.icon" color="blue-grey" size="20px" class="q-mr-sm" />
                <div class="q-pr-md">{{ prop.node.label }}</div>
              </div>
            </template>
          </q-tree>
          <div class="row">
            {{ticked}}
          </div>
          <!-- <q-btn flat color="positive" icon="check_circle" :label="$t('global.add')" @click="onTicked">
          </q-btn> -->
        </q-tab-panel>
      </q-tab-panels>
      <!-- </q-card-section> -->
    </q-form>
    <!-- Dialog color pick -->
    <q-dialog v-model="dialogColorPick">
      <q-card>
        <q-toolbar>
          <q-toolbar-title>{{$t('global.colorPick')}}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip>{{$t('global.cancel')}}</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-card-section>
          <q-color v-model="form.color" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import * as api from '@/api/roles'
import * as ultis from '@/utils'
import { findNodesIfExist } from '@/utils/tree'
export default {
  props: {
    dialog: { type: Boolean, default: true },
    item: { type: Object, default: () => { } },
    items: { type: Array, default: () => [] },
    routes: { type: Array, default: () => [] },
    rootRoutes: { type: Array, default: () => [] }
  },
  data() {
    return {
      loading: false,
      loadingAdd: false,
      loadingDrafts: false,
      dialogColorPick: false,
      tabs: 'main',
      form: {},
      ticked: ['dashboard'],
      // tree_nodes: this.routes,
      default: {
        key: '',
        name: '',
        desc: '',
        level: 1,
        color: '#027be3',
        routes: [],
        flag: 1
      }
    }
  },
  watch: {
    dialog: {
      handler(val) {
        this.reset()
        if (this.item) {
          this.form = { ...this.item }
          // this.ticked = this.form.routes
          this.ticked = findNodesIfExist(this.routes, this.form.routes, 'name')
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // getRoles() {
    //   roles.getAll()
    //     .then((x) => { this.roles = x })
    //     .catch((err) => { this.$message.error(this.$t(err.message)) })
    // },
    onSubmit(action) {
      // console.log(this.item)
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.form.routes = this.ticked
          if (this.item) {
            this.loadingAdd = true
            api.update(this.form).then((x) => {
              if (x.ok) {
                const index = this.items.indexOf(this.item)
                if (index > -1) this.items.splice(index, 1, this.form)
              }
            }).finally(() => {
              this.loadingAdd = false
            })
          } else {
            this.form.flag = action
            if (action) this.loadingAdd = true
            else this.loadingDrafts = true
            api.insert(this.form).then((x) => {
              this.items.push(x)
              this.reset()
            }).finally(() => {
              this.loadingAdd = false
              this.loadingDrafts = false
            })
          }
        }
      })
    },
    onTickedUpdate() {
      this.$nextTick(() => {
        const ticked = this.$refs.routes.getTickedNodes()
        // console.log(ticked)
        if (ticked.length < 1) return
        for (let e of ticked) {
          if (e) {
            const a = this.findRoutes(this.rootRoutes, e.parents, '_id')
            if (a) ultis.pushIfNotExist(this.ticked, a.name)
          }
        }
      })
      // console.log(this.$refs.routes.getExpandedNodes())
    },
    findRoutes(routes, val, by) {
      const rs = []
      for (let e of routes) {
        if (e[by] === val) return e
      }
    },
    reset() {
      new Promise((resolve, reject) => {
        this.form = { ...this.default }
        // this.form.routes = treeRouters.ticked
        resolve()
      }).then(() => {
        if (this.$refs.form) this.$refs.form.resetValidation()
      })
    }
  }
}
</script>

<style>
</style>
