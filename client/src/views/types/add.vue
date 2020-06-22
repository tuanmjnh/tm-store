<template>
  <div>
    <div class="row card-title">
      <div class="col-sm-auto col-xs-12 text-h6 card-title-text">
        <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
        {{ this.item ? $t('global.update') : $t('global.add') }}
        <span class="text-weight-bold">{{ $t("types.title") }}</span>
      </div>
      <q-space />
      <div class="col-sm-auto col-xs-12 text-right">
        <q-btn v-if="item" flat type="submit" :dense="$store.getters.dense.button" color="amber"
          icon="offline_pin" :loading="loadingAdd" @click.prevent="onSubmit">
          <!-- :label="dialog?'':$t('global.update')" -->
          <q-tooltip>{{$t('global.update')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="!item" flat type="submit" :dense="$store.getters.dense.button" color="blue"
          icon="check_circle" :loading="loadingAdd" :disable="loadingDrafts"
          @click.prevent="onSubmit(1)">
          <!-- :label="dialog?'':$t('global.add')" -->
          <q-tooltip>{{$t('global.add')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="!item" flat type="submit" :dense="$store.getters.dense.button" color="amber"
          icon="receipt" :loading="loadingDrafts" :disable="loadingAdd"
          @click.prevent="onSubmit(0)">
          <!-- :label="dialog?'':$t('global.drafts')" -->
          <q-tooltip>{{$t('global.drafts')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="dialog" flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
          :icon="maximized?'fullscreen_exit':'fullscreen'" :disable="loading"
          @click="$emit('update:maximized',!maximized)">
          <q-tooltip>
            {{maximized?$t('global.normalScreen'):$t('global.fullScreen')}}
          </q-tooltip>
        </q-btn>
        <q-btn v-if="dialog" flat round dense icon="close" :disable="loading" v-close-popup>
          <q-tooltip>{{$t('global.cancel')}}</q-tooltip>
        </q-btn>
        <q-btn v-else flat round dense icon="reply" :disable="loading"
          @click="$router.push('view')">
          <q-tooltip>{{$t('global.back')}}</q-tooltip>
        </q-btn>
      </div>
    </div>
    <!-- <q-toolbar>
      <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
      <q-toolbar-title>
        {{ this.item ? $t("global.update") : $t("global.add") }}
        <span class="text-weight-bold">{{ $t("types.title") }}</span>
      </q-toolbar-title>
      <q-btn v-if="item" flat type="submit" :dense="$store.getters.dense.button" color="amber"
        icon="offline_pin" :label="dialog?'':$t('global.update')" :loading="loadingAdd"
        @click.prevent="onSubmit">
        <q-tooltip v-if="dialog">{{$t('global.update')}}</q-tooltip>
      </q-btn>
      <q-btn v-if="!item" flat type="submit" :dense="$store.getters.dense.button" color="blue"
        icon="check_circle" :label="dialog?'':$t('global.add')" :loading="loadingAdd"
        :disable="loadingDrafts" @click.prevent="onSubmit(1)">
        <q-tooltip v-if="dialog">{{$t('global.add')}}</q-tooltip>
      </q-btn>
      <q-btn v-if="!item" flat type="submit" :dense="$store.getters.dense.button" color="amber"
        icon="receipt" :label="dialog?'':$t('global.drafts')" :loading="loadingDrafts"
        :disable="loadingAdd" @click.prevent="onSubmit(0)">
        <q-tooltip v-if="dialog">{{$t('global.drafts')}}</q-tooltip>
      </q-btn>
      <q-btn v-if="dialog" flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
        :icon="maximized?'fullscreen_exit':'fullscreen'" :disable="loading"
        @click="$emit('update:maximized',!maximized)">
        <q-tooltip v-if="!$q.platform.is.mobile">
          {{maximized?$t('global.normalScreen'):$t('global.fullScreen')}}
        </q-tooltip>
      </q-btn>
      <q-btn v-if="dialog" flat round dense icon="close" :disable="loading" v-close-popup>
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar> -->
    <q-separator />
    <q-form ref="form">
      <!-- <q-card-actions v-if="item" align="right">
        <q-btn flat type="submit" :dense="$store.getters.dense.button" color="amber"
          icon="offline_pin" :label="$t('global.update')" :loading="loadingAdd"
          @click.prevent="onSubmit">
          <q-tooltip>{{$t('global.add')}}</q-tooltip>
        </q-btn>
      </q-card-actions>
      <q-card-actions v-else align="right">
        <q-btn flat type="submit" :dense="$store.getters.dense.button" color="blue"
          icon="check_circle" :label="$t('global.add')" :loading="loadingAdd"
          :disable="loadingDrafts" @click.prevent="onSubmit(1)">
          <q-tooltip>{{$t('global.add')}}</q-tooltip>
        </q-btn>
        <q-btn flat type="submit" :dense="$store.getters.dense.button" color="amber" icon="receipt"
          :label="$t('global.drafts')" :loading="loadingDrafts" :disable="loadingAdd"
          @click.prevent="onSubmit(0)">
          <q-tooltip>{{$t('global.drafts')}}</q-tooltip>
        </q-btn>
      </q-card-actions> -->
      <q-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form"
        class="text-deep-purple" align="justify">
        <q-tab name="main" :label="$t('tabs.main')" />
        <q-tab name="attributes" :label="$t('global.attributes')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-scroll-area style="height:calc(100vh - 180px)">
        <q-tab-panels v-model="tabs">
          <q-tab-panel name="main">
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <!-- <q-input v-model.trim="form.key" :dense="$store.getters.dense.input" v-lowercase :label="$t('global.types')"
                :rules="[v=>v&&v.length>0||$t('error.required')]" /> -->
                <!-- <q-select v-model="form.key" hide-selected fill-input use-input input-debounce="0" :dense="$store.getters.dense.input"
                :options-dense="$store.getters.dense.input" @new-value="onAddKey" :options="keys" @filter="onFilterKey"
                :hint="$t('types.hit_key')" :label="$t('global.types')" /> -->
                <auto-complete v-model.trim="form.key" :data.sync="keys"
                  :placeholder="$t('global.key')" :label="$t('global.types')" is-no-data
                  :no-data="$t('table.noData')" @input="onFilterKey"
                  :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model.trim="form.code" v-lowercase :dense="$store.getters.dense.input"
                  :label="$t('global.code')" :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="form.name" :dense="$store.getters.dense.input"
                  :label="$t('global.name')" :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model.trim="form.desc" autogrow :dense="$store.getters.dense.input"
                  :label="$t('global.desc')" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-3">
                <q-input v-model="form.orders" type="number" :dense="$store.getters.dense.input"
                  :label="$t('global.order')"
                  :rules="[v=>v!==null&&v!==''||$t('error.required')]" />
              </div>
              <q-space v-if="item" />
              <div class="col-5 self-center" v-if="item">
                <q-toggle v-model="form.flag" :true-value="1" :dense="$store.getters.dense.input"
                  :label="form.flag?$t('global.publish'):$t('global.drafts')" />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="attributes">
            <tm-attributes :data.sync="form.meta" :keys="metaKeys" :values="metaValues"
              :dense="$store.getters.dense.input" :labelTitle="$t('global.attributes')+':'"
              :labelBtnAdd="$t('global.add')" :labelInputKey="$t('global.key')"
              :labelInputValue="$t('global.value')" btnIcon="add" btnColor="blue"
              :btnEditLabel="$t('global.edit')" :btnDeleteLabel="$t('global.delete')"
              :labelConfirmTitle="$t('messageBox.confirm')"
              :labelConfirmContent="$t('messageBox.delete')"
              :labelWarningTitle="$t('messageBox.warning')"
              :labelWarningContent="$t('error.required')" :labelNoData="$t('table.noData')"
              @on-filter-key="onFilterMetaKey" @on-filter-value="onFilterMetaValue">
            </tm-attributes>
          </q-tab-panel>
        </q-tab-panels>
      </q-scroll-area>
      <!-- </q-card-section> -->
    </q-form>
  </div>
</template>

<script>
import * as apiTypes from '@/api/types'
export default {
  components: {
    autoComplete: () => import('@/components/auto-complete'),
    tmAttributes: () => import('@/components/tm-attributes')
  },
  props: {
    dialog: { type: Boolean, default: false },
    item: { type: Object, default: () => { } },
    items: { type: Array, default: () => [] },
    maximized: { type: Boolean, default: false }
  },
  data() {
    return {
      loading: false,
      loadingAdd: false,
      loadingDrafts: false,
      tabs: 'main',
      form: {},
      keys: [],
      metaKeys: [],
      metaValues: [],
      default: {
        key: '',
        code: '',
        name: '',
        desc: '',
        meta: null,
        orders: 1,
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
        }
      },
      deep: true,
      immediate: true
    }
  },
  // mounted() {
  //   this.onGetKey()
  // },
  methods: {
    // onGetKey() {
    //   apiTypes.getKey().then((x) => {
    //     if (x) this.keys = x
    //   })
    // },
    onAddKey(val, done) {
      if (val.length > 0) {
        if (!this.keys.includes(val)) this.keys.push(val)
        if (done) done(val, 'toggle')
      }
    },
    onFilterKey() {
      if (!this.form.key) return
      this.keys = []
      apiTypes.getKey({ key: this.form.key, page: 1, rowsPerPage: 5 }).then((x) => {
        if (x) this.keys = x.data
      })
    },
    onFilterMetaKey(val) {
      if (!val) return
      this.metaKeys = []
      apiTypes.getMeta({ key: true, filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
        if (x) this.metaKeys = x.data
      })
    },
    onFilterMetaValue(val) {
      if (!val) return
      this.metaValues = []
      apiTypes.getMeta({ filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
        if (x) this.metaValues = x.data
      })
    },
    onSubmit(action) {
      // console.log(this.item)
      this.$refs.form.validate().then(valid => {
        if (valid) {
          if (this.item) {
            this.loadingAdd = true
            apiTypes.update(this.form).then((x) => {
              if (x.ok) {
                const index = this.items.indexOf(this.item)
                if (index > -1) this.items.splice(index, 1, this.form)
              }
            }).finally(() => {
              this.loadingAdd = false
              this.onAddKey(this.form.key)
            })
          } else {
            this.form.flag = action
            if (action) this.loadingAdd = true
            else this.loadingDrafts = true
            apiTypes.insert(this.form).then((x) => {
              this.items.push(x)
              this.reset()
            }).finally(() => {
              this.loadingAdd = false
              this.loadingDrafts = false
              this.onAddKey(this.form.key)
              this.reset()
            })
          }
        }
      })
    },
    reset() {
      new Promise((resolve, reject) => {
        this.$emit('update:maximized', false)
        this.form = { ...this.default }
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
