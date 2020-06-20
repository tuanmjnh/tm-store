<template>
  <div>
    <div class="row card-title">
      <div class="col-sm-auto col-xs-12 text-h6 card-title-text">
        <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
        {{ this.item ? $t('global.update') : $t('global.add') }}
        <span class="text-weight-bold">{{  $t(`category.title_${$route.meta.type}`) }}</span>
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
            {{maximized?$t('table.normalScreen'):$t('table.fullScreen')}}
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
    <q-separator />
    <q-form ref="form">
      <q-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form"
        class="text-deep-purple" align="justify">
        <q-tab name="main" :label="$t('tabs.main')" />
        <q-tab name="content" :label="$t('global.content')" />
        <q-tab name="images" :label="$t('global.images')" />
        <q-tab name="attributes" :label="$t('global.attributes')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-scroll-area style="height:calc(100vh - 180px)">
        <q-tab-panels v-model="tabs">
          <q-tab-panel name="main">
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                Parent: <q-badge color="blue">{{dependent?dependent.label:'Root'}}</q-badge>
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                Level: <q-badge color="blue">{{form.level}}</q-badge>
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="form.title" v-uppercaseFirst
                  :dense="$store.getters.dense.input" :label="$t('global.title')"
                  :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model.trim="form.code" v-uppercase :dense="$store.getters.dense.input"
                  :label="$t('global.code')" :rules="[v=>v&&v.length>0||$t('error.required')]"
                  :hint="$t('category.hitCode')" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="form.url" :dense="$store.getters.dense.input" v-lowercase
                  label="URL" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model="form.quantity" type="number" :dense="$store.getters.dense.input"
                  :label="$t('global.quantity')" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="form.icon" :dense="$store.getters.dense.input" label="Icon">
                  <template v-slot:append>
                    <q-icon :name="form.icon" /></template>
                </q-input>
              </div>
              <q-space />
              <div class="col col-md-6 self-center">
                {{$t('global.colorPick')}}:
                <q-badge :style="{backgroundColor:form.color}" @click="dialogColorPick=true">
                  {{form.color}}</q-badge>
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input :value="form.startAt" :dense="$store.getters.dense.input" readonly
                  :label="$t('global.startDate')" :hint="`${$t('global.format')}: DD/MM/YYYY`">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="startAt" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.startAt" mask="DD/MM/YYYY" today-btn
                          @input="()=>$refs.startAt.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="col col-md-6">
                <q-input :value="form.endAt" :dense="$store.getters.dense.input" readonly
                  :label="$t('global.endDate')" :hint="`${$t('global.format')}: DD/MM/YYYY`">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="endAt" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.endAt" mask="DD/MM/YYYY" today-btn
                          @input="()=>$refs.endAt.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-3">
                <q-input v-model="form.orders" type="number" :dense="$store.getters.dense.input"
                  :label="$t('global.order')" :rules="[v=>v!==null&&v!==''||$t('error.required')]"
                  class="col-md-4" />
              </div>
              <q-space v-if="item" />
              <div class="col-5 self-center" v-if="item">
                <q-toggle v-model="form.flag" :true-value="1" :dense="$store.getters.dense.input"
                  :label="form.flag?$t('global.publish'):$t('global.drafts')" />
              </div>
            </div>
            <div class="q-gutter-sm">
              <q-input v-model.trim="form.desc" autogrow :dense="$store.getters.dense.input"
                :label="$t('global.desc')" />
            </div>
          </q-tab-panel>
          <q-tab-panel name="content">
            <q-editor v-model="form.content" min-height="5rem" />
          </q-tab-panel>
          <q-tab-panel name="images">
            <div class="row">
              <div class="col-12 q-gutter-sm images">
                <tm-upload :data.sync="form.images" :upload-url="uploadUrl" :headers="headers"
                  :max-file-size="1024*1024*2" accept=".jpg,.jpeg,.png,.gif" :multiple="false"
                  :view-type.sync="viewType" :size="121" :labelTitle="$t('files.title')"
                  :labelViewList="$t('files.ViewList')" :labelViewBox="$t('files.viewBox')"
                  :labelFileName="$t('files.fileName')" :labelFileSize="$t('files.fileSize')"
                  :labelConfirmTitle="$t('messageBox.confirm')"
                  :labelConfirmContent="$t('messageBox.delete')">
                </tm-upload>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="attributes">
            <div class="q-pt-md q-pb-md">
              <span>{{$t('global.position')}}:</span>
              <q-option-group v-model="form.position" :options="positions" color="green"
                type="checkbox" inline :dense="$store.getters.dense.input" />
            </div>
            <q-separator class="q-mt-md" />
            <tm-tags :data.sync="form.tags" :dense="$store.getters.dense.input"
              :labelTitle="$t('global.keyword')+':'" :labelBtnAdd="$t('global.add')"
              :labelInput="$t('global.tags')" btnIcon="add" btnColor="blue" tagsColor="primary"
              tagsTextColor="white" :labelConfirmTitle="$t('messageBox.confirm')"
              :labelConfirmContent="$t('messageBox.delete')"
              :labelWarningTitle="$t('messageBox.warning')"
              :labelWarningContent="$t('error.required')"></tm-tags>
            <q-separator class="q-mb-md q-mt-md" />
            <tm-attributes :data.sync="form.attr" :keys="attrKeys" :values="attrValues"
              :dense="$store.getters.dense.input" :labelTitle="$t('product.attributes')+':'"
              :labelBtnAdd="$t('global.add')" :labelInputKey="$t('global.key')"
              :labelInputValue="$t('global.value')" btnIcon="add" btnColor="blue"
              :btnEditLabel="$t('global.edit')" :btnDeleteLabel="$t('global.delete')"
              :labelConfirmTitle="$t('messageBox.confirm')"
              :labelConfirmContent="$t('messageBox.delete')"
              :labelWarningTitle="$t('messageBox.warning')"
              :labelWarningContent="$t('error.required')" :labelNoData="$t('table.noData')"
              @on-filter-key="onFilterAttrKey" @on-filter-value="onFilterAttrValue">
            </tm-attributes>
          </q-tab-panel>
        </q-tab-panels>
      </q-scroll-area>
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
  </div>
</template>

<script>
import * as apiCategories from '@/api/categories'
export default {
  components: {
    tmUpload: () => import('@/components/tm-upload'),
    tmTags: () => import('@/components/tm-tags'),
    tmAttributes: () => import('@/components/tm-attributes')
  },
  props: {
    dialog: { type: Boolean, default: false },
    item: { type: Object, default: () => { } },
    items: { type: Array, default: () => [] },
    dependent: { type: Object, default: () => null },
    positions: { type: Array, default: () => [] },
    expanded: { type: Array, default: () => [] },
    maximized: { type: Boolean, default: false }
  },
  data() {
    return {
      loading: false,
      loadingAdd: false,
      loadingDrafts: false,
      dialogColorPick: false,
      dialogFiles: false,
      dialogUpload: false,
      tabs: 'main',
      form: {},
      attrKeys: [],
      attrValues: [],
      viewType: 'box',
      uploadUrl: process.env.API_FILE_UPLOAD,
      headers: [
        { name: 'Upload-Path', value: 'category' },
        { name: 'Upload-Rename', value: true },
        { name: 'x-access-token', value: `Bearer ${this.$store.state.auth.token}` }],
      default: {
        type: this.$route.meta.type,
        code: null,
        dependent: null,
        level: 1,
        title: '',
        desc: null,
        content: '',
        url: null,
        images: null,
        quantity: null,
        position: [],
        tags: null,
        icon: 'spa',
        color: '#009688',
        meta: null,
        startAt: null, // this.$moment().format('YYYY/MM/DD'),
        endAt: null, // this.$moment().format('YYYY/MM/DD'),
        orders: 1,
        flag: 1
      }
    }
  },
  watch: {
    dialog: {
      handler(val) {
        this.reset()
        if (this.item) this.form = { ...this.item }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    onFilterAttrKey(val) {
      if (!val) return
      this.attrKeys = []
      apiCategories.getAttr({ key: true, filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
        if (x) this.attrKeys = x.data
      })
    },
    onFilterAttrValue(val) {
      if (!val) return
      this.attrValues = []
      apiCategories.getAttr({ filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
        if (x) this.attrValues = x.data
      })
    },
    getDependent() {
      if (this.dependent) return this.dependent.label
      else return 'Root'
    },
    onSubmit(action) {
      // console.log(this.item)
      this.$refs.form.validate().then(valid => {
        if (valid) {
          if (this.item) {
            this.loadingAdd = true
            apiCategories.update(this.form).then((x) => {
              if (x.ok) {
                if (!this.dependent) {
                  const index = this.items.indexOf(this.item)
                  if (index > -1) this.items.splice(index, 1, this.form)
                } else {
                  const index = this.dependent.children.indexOf(this.item)
                  if (index > -1) this.dependent.children.splice(index, 1, this.form)
                }
              }
            }).finally(() => {
              this.loadingAdd = false
            })
          } else {
            this.form.flag = action
            if (action) this.loadingAdd = true
            else this.loadingDrafts = true
            apiCategories.insert(this.form).then((x) => {
              if (this.dependent) {
                this.expanded.push(x._id)
                if (!this.dependent.children) this.dependent.children = []
                this.dependent.children.push(x)
              } else this.items.push(x)
            }).finally(() => {
              this.loadingAdd = false
              this.loadingDrafts = false
              this.reset()
            })
          }
        }
      })
    },
    findRoutes(routes, val, by) {
      const rs = []
      for (let e of routes) {
        if (e[by] === val) return e
      }
    },
    reset() {
      new Promise((resolve, reject) => {
        this.$emit('update:maximized', false)
        this.form = { ...this.default }
        if (this.dependent) {
          this.form.dependent = this.dependent._id
          this.form.level = this.dependent.level + 1
        }
        this.attr = {}
        this.tag = ''
        resolve()
      }).then(() => {
        if (this.$refs.form) this.$refs.form.resetValidation()
      })
    }
  }
}
</script>

<style>
.images .q-img {
  height: 100px;
  max-width: 100px;
}
.img-delete {
  color: #fff;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  background-color: #b71c1c;
  display: none;
}
.images .q-img:hover .img-delete {
  display: initial;
}
</style>
