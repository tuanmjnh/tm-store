<template>
  <div>
    <div class="row card-title">
      <div class="col-sm-auto col-xs-12 text-h6 card-title-text">
        <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
        {{ this.item ? $t('global.update') : $t('global.add') }}
        <span class="text-weight-bold">{{ $t("news.title") }}</span>
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
        <q-tab name="upload" :label="$t('files.upload')" />
        <q-tab name="attributes" :label="$t('global.attributes')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-scroll-area style="height:calc(100vh - 180px)">
        <q-tab-panels v-model="tabs">
          <q-tab-panel name="main">
            <div class="row q-gutter-xs">
              <div class="col-12">
                <select-category :categories="categories" :selected.sync="form.categories"
                  data-key="_id" :dense="$store.getters.dense.input"
                  :labelTitle="$t('category.title_product')" :labelSelect="$t('category.select')"
                  :labelClose="$t('global.cancel')" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-12">
                <q-input v-model.trim="form.title" v-uppercaseFirst
                  :dense="$store.getters.dense.input" :label="$t('news.name')"
                  :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
              <!-- <q-space />
            <div class="col-12 col-md-3">
              <q-input v-model.trim="form.code" readonly v-uppercase debounce="300"
                :dense="$store.getters.dense.input" :label="$t('news.code')"
                :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div> -->
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="form.author" :dense="$store.getters.dense.input"
                  :label="$t('news.author')" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input :value="form.date?$moment(form.date).format($store.getters.format.date):''"
                  :dense="$store.getters.dense.input" readonly :label="$t('news.date')"
                  :hint="`${$t('global.format')}: ${$store.getters.format.date}`">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="datePublish" transition-show="scale"
                        transition-hide="scale">
                        <q-date v-model="form.date" today-btn
                          @input="()=>$refs.datePublish.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input :value="form.startDate" :dense="$store.getters.dense.input" readonly
                  :label="$t('global.startDate')"
                  :hint="`${$t('global.format')}: ${$store.getters.format.date}`">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="startAt" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.startDate" mask="DD/MM/YYYY" today-btn
                          @input="()=>$refs.startAt.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="col col-md-6">
                <q-input :value="form.endDate" :dense="$store.getters.dense.input" readonly
                  :label="$t('global.endDate')"
                  :hint="`${$t('global.format')}: ${$store.getters.format.date}`">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="endAt" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.endDate" mask="DD/MM/YYYY" today-btn
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
            </div>
            <div class="row q-gutter-sm q-mb-lg">
              <div class="col-12">
                <q-input v-model.trim="form.desc" autogrow :dense="$store.getters.dense.input"
                  :label="$t('global.desc')" />
              </div>
            </div>
            <div class="row q-gutter-sm">
              <div class="col-12">{{$t('global.content')}}</div>
              <div class="col-12">
                <tm-editor :value.sync="form.content" :upload-url="uploadUrl" :headers="headers"
                  multiple :max-file-size="1024*1024*2" accept=".jpg,.jpeg,.png,.gif"></tm-editor>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="upload">
            <div class="row">
              <div class="col-12 q-gutter-sm images">
                <tm-upload :data.sync="form.images" :upload-url="uploadUrl" :headers="headers"
                  :max-file-size="1024*1024*2" accept=".jpg,.jpeg,.png,.gif" :multiple="false"
                  :view-type.sync="viewTypeImage" :size="121" :labelTitle="$t('global.avatar')"
                  :labelTitleUpload="$t('files.upload')" :labelTitleFiles="$t('files.title')"
                  :labelOpenFile="$t('files.openFile')" :labelOpenData="$t('files.openData')"
                  :labelViewList="$t('files.ViewList')" :labelViewBox="$t('files.viewBox')"
                  :labelFileName="$t('files.fileName')" :labelFileSize="$t('files.fileSize')"
                  :labelCancel="$t('global.cancel')" :labelConfirmTitle="$t('messageBox.confirm')"
                  :labelConfirmContent="$t('messageBox.delete')">
                </tm-upload>
              </div>
            </div>
            <q-separator class="q-mb-sm q-mt-sm" />
            <div class="row">
              <div class="col-12 q-gutter-sm images">
                <tm-upload :data.sync="form.attach" :upload-url="uploadUrl" :headers="headers"
                  :max-file-size="1024*1024*5" :multiple="true" :view-type.sync="viewTypeAttach"
                  :size="121" :labelTitle="$t('global.attach')"
                  :labelTitleUpload="$t('files.upload')" :labelTitleFiles="$t('files.title')"
                  :labelOpenFile="$t('files.openFile')" :labelOpenData="$t('files.openData')"
                  :labelViewList="$t('files.ViewList')" :labelViewBox="$t('files.viewBox')"
                  :labelFileName="$t('files.fileName')" :labelFileSize="$t('files.fileSize')"
                  :labelCancel="$t('global.cancel')" :labelConfirmTitle="$t('messageBox.confirm')"
                  :labelConfirmContent="$t('messageBox.delete')">
                </tm-upload>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="attributes">
            <div class="q-pt-md q-pb-md">
              <div class="col-12">{{$t('global.pin')}}:</div>
              <div class="col-12">
                <q-option-group v-model="form.pin" :options="pins" type="checkbox" inline
                  :dense="$store.getters.dense.input" />
              </div>
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
  </div>
</template>

<script>
import * as apiNews from '@/api/news'
import normalize from '@/utils/search'
export default {
  components: {
    tmEditor: () => import('@/components/tm-editor'),
    tmUpload: () => import('@/components/tm-upload'),
    tmTags: () => import('@/components/tm-tags'),
    tmAttributes: () => import('@/components/tm-attributes'),
    selectCategory: () => import('@/views/category/components/select-category')
  },
  props: {
    dialog: { type: Boolean, default: false },
    items: { type: Array, default: () => [] },
    item: { type: Object, default: () => { } },
    categories: { type: Array, default: () => [] },
    pins: { type: Array, default: () => [] },
    maximized: { type: Boolean, default: false }
  },
  data() {
    return {
      loading: false,
      loadingAdd: false,
      loadingDrafts: false,
      dialogCategories: false,
      dialogFiles: false,
      dialogUpload: false,
      openType: 'image',
      tabs: 'main',
      form: {},
      attrKeys: [],
      attrValues: [],
      viewTypeImage: 'box',
      viewTypeAttach: 'list',
      uploadUrl: process.env.API_FILE_UPLOAD,
      headers: [
        { name: 'Upload-Path', value: 'news' },
        { name: 'Upload-Rename', value: true },
        { name: 'x-access-token', value: `Bearer ${this.$store.state.auth.token}` }],
      default: {
        categories: null,
        title: null,
        code: null,
        desc: null,
        content: '',
        url: null,
        images: null,
        author: null,
        date: null,
        pin: [],
        tags: null,
        attr: [],
        meta: null,
        attach: [],
        startAt: null,
        endAt: null,
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
  methods: {
    onFilterAttrKey(val) {
      if (!val) return
      this.attrKeys = []
      apiNews.getAttr({ key: true, filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
        if (x) this.attrKeys = x.data
      })
    },
    onFilterAttrValue(val) {
      if (!val) return
      this.attrValues = []
      apiNews.getAttr({ filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
        if (x) this.attrValues = x.data
      })
    },
    // onSelectCategory(item) {
    //   this.form.categories = item._id
    // },
    onSubmit(action) {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          if (this.item) {
            this.loadingAdd = true
            apiNews.update(this.form).then((x) => {
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
            apiNews.insert(this.form).then((x) => {
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
    reset() {
      new Promise((resolve, reject) => {
        this.$emit('update:maximized', false)
        this.form = { ...this.default }
        this.form.images = null
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
</style>
