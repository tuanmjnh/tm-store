<template>
  <div>
    <div class="row card-title">
      <div class="col-sm-auto col-xs-12 text-h6 card-title-text">
        <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
        {{ this.item ? $t('global.update') : $t('global.add') }}
        <span class="text-weight-bold">{{ $t("product.title") }}</span>
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
    <q-separator />
    <q-form ref="form">
      <q-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form"
        class="text-deep-purple" align="justify">
        <q-tab name="inf" :label="$t('tabs.inf')" />
        <!-- <q-tab name="about" :label="$t('tabs.about')" /> -->
        <q-tab name="images" :label="$t('global.images')" />
        <q-tab name="attributes" :label="$t('global.attributes')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-scroll-area style="height:calc(100vh - 180px)">
        <q-tab-panels v-model="tabs">
          <q-tab-panel name="inf">
            <div class="row q-gutter-xs">
              <div class="col-12">
                <select-category :categories="categories" :selected.sync="form.categories"
                  data-key="_id" :dense="$store.getters.dense.input"
                  :labelTitle="$t('category.title_product')" :labelSelect="$t('category.select')"
                  :labelClose="$t('global.cancel')" @on-selected="onSelectCategory" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="form.title" v-uppercaseFirst
                  :dense="$store.getters.dense.input" :label="$t('product.name')"
                  :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
              <q-space />
              <div class="col-12 col-md-5">
                <q-input v-model.trim="form.code" v-uppercase debounce="500"
                  :dense="$store.getters.dense.input" :label="$t('product.code')"
                  :rules="[v=>v&&v.length>0||$t('error.required'),v=>!existCode||$t('error.exist')]" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-5">
                <q-input v-model.trim="form.price" type="number" :dense="$store.getters.dense.input"
                  :label="$t('product.priceSale')" />
              </div>
              <q-space />
              <div class="col-5">
                <q-input v-model="form.priceDiscount" type="number"
                  :dense="$store.getters.dense.input" :label="$t('product.priceDiscount')" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-5">
                <q-input v-model="form.priceImport" type="number"
                  :dense="$store.getters.dense.input" :label="$t('product.priceImport')" />
              </div>
              <q-space />
              <div class="col-5">
                <q-input v-model="form.priceExport" type="number"
                  :dense="$store.getters.dense.input" :label="$t('product.priceExport')" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-3">
                <q-input v-model="form.quantity" type="number" :dense="$store.getters.dense.input"
                  :label="$t('product.quantityStore')" />
              </div>
              <div class="col-2">
                <q-select v-model="unit" use-input hide-selected fill-input input-debounce="200"
                  :dense="$store.getters.dense.input" :options="unitsLocal"
                  :hint="$t('global.unit')" @filter="onFilterUnit" option-value="_id"
                  :option-label="opt=>opt.name.toHtml()" :rules="[v=>v||$t('error.required')]">
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label v-html="scope.opt.name" />
                        <q-item-label v-if="scope.opt.desc" caption>{{`${scope.opt.desc}`}}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">{{$t('table.noData')}}</q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-2">
                <q-select v-model="unitPrice" :dense="$store.getters.dense.input"
                  :options="unitsPriceLocal" use-input hide-selected fill-input input-debounce="200"
                  @filter="onFilterUnitPrice" :hint="$t('product.priceUnit')" option-value="_id"
                  :option-label="opt=>opt.name.toHtml()" :rules="[v=>v||$t('error.required')]">
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label v-html="scope.opt.name"></q-item-label>
                        <!-- <q-item-label>{{scope.opt.name.toHtml()}}</q-item-label> -->
                        <q-item-label v-if="scope.opt.desc" caption>{{`${scope.opt.desc}`}}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">{{$t('table.noData')}}</q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <!-- <q-input v-model="form.priceUnit" type="number" :dense="$store.getters.dense.input" :label="$t('global.priceUnit')" /> -->
              </div>
              <q-space />
              <div class="col-3">
                <q-input v-model="form.order" type="number" :dense="$store.getters.dense.input"
                  :label="$t('global.order')" :rules="[v=>v!==null&&v!==''||$t('error.required')]"
                  class="col-md-4" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="form.origin" :dense="$store.getters.dense.input"
                  :label="$t('product.origin')" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model.trim="form.date" :dense="$store.getters.dense.input"
                  :label="$t('product.date')" />
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
                <!-- <q-editor v-model="form.content" min-height="5rem" /> -->
              </div>
            </div>
          </q-tab-panel>
          <!-- <q-tab-panel name="about">
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="form.origin" :dense="$store.getters.dense.input"
                  :label="$t('product.origin')" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model.trim="form.date" :dense="$store.getters.dense.input"
                  :label="$t('product.date')" />
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
                <-- <q-editor v-model="form.content" min-height="5rem" />
              </div>
            </div>
          </q-tab-panel> -->
          <q-tab-panel name="images">
            <div class="row">
              <div class="col-12 q-gutter-sm images">
                <tm-upload :data.sync="form.images" :upload-url="uploadUrl" :headers="headers"
                  :max-file-size="1024*1024*2" accept=".jpg,.jpeg,.png,.gif" :multiple="true"
                  :view-type.sync="viewType" :size="121" :labelTitle="$t('files.title')"
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
            <div class="row q-gutter-md">
              <div class="col">
                {{$t('global.pin')}}:
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
    <!-- </q-card> -->
  </div>
</template>

<script>
import * as apiProducts from '@/api/products'
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
    categories: { type: Array, default: null },
    units: { type: Array, default: () => [] },
    unitsPrice: { type: Array, default: () => [] },
    pins: { type: Array, default: () => [] },
    maximized: { type: Boolean, default: false }
  },
  data() {
    return {
      loading: false,
      loadingAdd: false,
      loadingDrafts: false,
      dialogFiles: false,
      dialogUpload: false,
      tabs: 'inf',
      form: {},
      attrKeys: [],
      attrValues: [],
      unit: null,
      unitPrice: null,
      existCode: false,
      unitsLocal: [],
      unitsPriceLocal: [],
      viewType: 'box',
      uploadUrl: process.env.API_FILE_UPLOAD,
      headers: [
        { name: 'Upload-Path', value: 'products' },
        { name: 'Upload-Rename', value: true },
        { name: 'x-access-token', value: `Bearer ${this.$store.state.auth.token}` }],
      default: {
        categories: null,
        title: null,
        code: null,
        desc: null,
        content: '',
        images: null,
        quantity: 0,
        price: 0,
        priceDiscount: 0,
        priceImport: 0,
        priceExport: 0,
        priceUnit: null,
        unit: null,
        origin: null,
        date: null,
        pin: [],
        tags: null,
        attr: [],
        meta: null,
        order: 1,
        flag: 1
      }
    }
  },
  // created() {
  //   console.log(this.$q.platform.is.mobile)
  // },
  watch: {
    dialog: {
      handler(val) {
        this.reset()
        if (this.item) {
          this.form = { ...this.item }
          if (!this.form.content) this.form.content = ''
          this.form.unit = this.units.find(x => x._id === this.form.unit)
          this.form.priceUnit = this.unitsPrice.find(x => x._id === this.form.priceUnit)
        }
      },
      deep: true,
      immediate: true
    },
    'form.code'(val) {
      if (val) {
        apiProducts.exist({ code: val.toUpperCase() }).then((x) => {
          if (x) this.existCode = true
        })
      }
    }
  },
  methods: {
    onFilterAttrKey(val) {
      if (!val) return
      this.attrKeys = []
      apiProducts.getAttr({ key: true, filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
        if (x) this.attrKeys = x.data
      })
    },
    onFilterAttrValue(val) {
      if (!val) return
      this.attrValues = []
      apiProducts.getAttr({ filter: val, page: 1, rowsPerPage: 5 }).then((x) => {
        if (x) this.attrValues = x.data
      })
    },
    onFilterUnit(val, update, abort) {
      update(() => {
        if (val === '') {
          this.unitsLocal = this.units
        } else {
          const needle = normalize(val.toLowerCase())
          // this.form.region = this.regions.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
          this.unitsLocal = this.units.filter(v => normalize(v.name.toLowerCase()).indexOf(needle) > -1)
        }
      })
    },
    onFilterUnitPrice(val, update, abort) {
      update(() => {
        if (val === '') {
          this.unitsPriceLocal = this.unitsPrice
        } else {
          const needle = normalize(val.toLowerCase())
          // this.form.region = this.regions.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
          this.unitsPriceLocal = this.unitsPrice.filter(v => normalize(v.name.toLowerCase()).indexOf(needle) > -1)
        }
      })
    },
    onSelectCategory(item) {
      if (!item.children || !item.children.length) {
        this.form.categories = [item._id]
      }
    },
    onSubmit(action) {
      if (this.unit) this.form.unit = this.unit.name
      if (this.unitPrice) this.form.priceUnit = this.unitPrice.name
      // this.form.images = this.images.map(x => x.fullName)
      this.$refs.form.validate().then(valid => {
        if (valid) {
          if (this.item) {
            this.loadingAdd = true
            apiProducts.update(this.form).then((x) => {
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
            apiProducts.insert(this.form).then((x) => {
              this.items.push(x)
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
        this.form.images = []
        this.unit = this.units[0]
        this.unitPrice = this.unitsPrice[0]
        resolve()
      }).then(() => {
        if (this.$refs.form) this.$refs.form.resetValidation()
      })
    }
  }
}
</script>

<style scoped>
.images {
  min-height: 100px;
}
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
