<template>
  <q-card style="width:700px;max-width:80vw">
    <q-toolbar>
      <q-avatar :icon="$route.meta.icon" size="50px" />
      <q-toolbar-title>
        {{this.item?$t('global.update'):$t('global.add')}}
        <span class="text-weight-bold">{{$t('roles.title')}}</span>
      </q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup :disable="loading_add||loading_drafts?true:false">
        <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.cancel')}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-separator />
    <q-form ref="form">
      <q-card-actions v-if="item" align="right">
        <q-btn flat type="submit" :dense="$store.getters.dense.button" color="amber" icon="offline_pin"
          :label="$t('global.update')" :loading="loading_add" @click.prevent="onSubmit">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-card-actions v-else align="right">
        <q-btn flat type="submit" :dense="$store.getters.dense.button" color="blue" icon="check_circle"
          :label="$t('global.add')" :loading="loading_add" :disable="loading_drafts" @click.prevent="onSubmit(true)">
          <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
        </q-btn>
        <q-btn flat type="submit" :dense="$store.getters.dense.button" color="amber" icon="receipt"
          :label="$t('global.drafts')" :loading="loading_drafts" :disable="loading_add"
          @click.prevent="onSubmit(false)">
          <!-- <q-tooltip>{{$t('global.drafts')}}</q-tooltip> -->
        </q-btn>
      </q-card-actions>
      <q-tabs v-model="tabs" narrow-indicator :dense="$store.getters.dense.form" class="text-deep-purple"
        align="justify">
        <q-tab name="main" :label="$t('tabs.main')" />
        <q-tab name="roles" :label="$t('roles.title')" />
        <q-tab name="avatar" :label="$t('users.avatar')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-tab-panels v-model="tabs" animated>
        <q-tab-panel name="main">
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input v-model.trim="form.email" :dense="$store.getters.dense.input" v-lowercase
                :label="$t('users.email')"
                :rules="[v=>v&&v.length>0||$t('error.required'),v=>validEmail(v)||$t('error.email')]" />
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              <q-input v-model.trim="form.full_name" :dense="$store.getters.dense.input" :label="$t('users.full_name')"
                :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5">
              <q-input :value="form.date_birth?$moment(form.date_birth).format('DD/MM/YYYY'):''"
                :dense="$store.getters.dense.input" readonly :label="$t('users.date_birth')"
                :hint="`${$t('global.format')}: DD/MM/YYYY`">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="dateBirth" transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.date_birth" today-btn @input="()=>$refs.dateBirth.hide()" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <q-space />
            <div class="col-12 col-md-6">
              <q-input v-model.trim="form.person_number" type="number" :dense="$store.getters.dense.input"
                :label="$t('users.person_number')" :rules="[v=>v&&v.length>0||$t('error.required')]" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-3">
              <q-select v-model="selected_region" use-input hide-selected fill-input input-debounce="0"
                :dense="$store.getters.dense.input" :options="regions" @filter="onFilterRegion"
                :hint="$t('users.select_region')" option-value="id" option-label="name_l"
                :rules="[v=>v||$t('error.required')]">
                <!-- <template v-slot:selected-item="scope">
                  <q-item-label v-html="scope.opt.name_l" />
                  <q-item-label caption>{{`+${scope.opt.pc}`}}</q-item-label>
                </template> -->
                <!-- <template v-slot:selected>
                  <q-chip v-if="form.region" dense square color="white" text-color="primary"
                    class="q-my-none q-ml-xs q-mr-none">
                    <q-avatar color="primary" text-color="white" />
                    {{ form.region.name_l }}
                  </q-chip>
                  <q-badge v-else>*none*</q-badge>
                </template> -->
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section>
                      <q-item-label v-html="scope.opt.name_l" />
                      <q-item-label caption>{{`+${scope.opt.pc}`}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">{{$t('table.no_data')}}</q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-6 col-md-5">
              <q-input v-model.trim="form.phone" :hint="$t('users.phone')" :placeholder="$t('users.phone')"
                :dense="$store.getters.dense.input" :rules="[v=>v&&v.length>0||$t('error.required')]">
                <template v-if="selected_region" v-slot:prepend>
                  <span style="font-size:14px;line-height:0">+{{selected_region.pc}}</span>
                </template>
              </q-input>
            </div>
            <q-space />
            <div class="col-6 col-md-3">
              <q-select v-model="gender" :options="genders" :hint="$t('users.gender')" option-value="_id"
                :dense="$store.getters.dense.input" :options-dense="$store.getters.dense.input"
                :option-label="v=>$t(`gender.${v.code}`)" :rules="[v=>v||$t('error.required')]" />
            </div>
          </div>
          <div class="row q-gutter-xs q-mb-sm">
            <div class="col-12">
              <q-input v-model="form.address" :label="$t('users.address')" :dense="$store.getters.dense.input" />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <div class="col-12 col-md-5 self-center">
              <q-toggle v-model="form.verified" :true-value="true" :dense="$store.getters.dense.input"
                :label="$t('users.verified')" :text-color="form.verified?'green':'blue-grey-10'" />
            </div>
            <q-space />
            <div class="col-12 col-md-6 self-center" v-if="item">
              <q-toggle v-model="form.enable" :true-value="true" :dense="$store.getters.dense.input"
                :label="form.enable?$t('global.working'):$t('global.lock')" />
            </div>
          </div>
          <div class="row q-gutter-xs q-mt-sm">
            <div class="col-12 col-md-12 self-center">
              {{$t('users.note')}}:
            </div>
            <div class="col-12">
              <!-- <q-input v-model.trim="form.note" autogrow :label="$t('users.note')" :dense="$store.getters.dense.input" /> -->
              <q-editor v-model.trim="form.note" min-height="2rem" />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="roles">
          <q-tree ref="menu" class="col-12 col-sm-6" :nodes="roles" :dense="$store.getters.dense.input"
            :ticked.sync="form.roles" node-key="id" tick-strategy="leaf" :no-nodes-label="$t('table.no_data')" />
          <!-- <q-btn flat color="positive" icon="check_circle" :label="$t('global.add')" @click="onTicked">
          </q-btn> -->
        </q-tab-panel>
        <q-tab-panel name="avatar">
          <div class="row">
            <div class="col-12 q-gutter-sm images">
              <tm-upload :data.sync="form.avatar" :upload-url="uploadUrl" :headers="headers"
                :max-file-size="1024*1024*2" accept=".jpg,.jpeg,.png,.gif" :multiple="false" :view-type.sync="viewType"
                :size="121" :labelTitle="$t('files.title')" :labelViewList="$t('files.View_list')"
                :labelViewBox="$t('files.view_box')" :labelFileName="$t('files.file_name')"
                :labelFileSize="$t('files.file_size')" :labelConfirmTitle="$t('message_box.confirm')"
                :labelConfirmContent="$t('message_box.delete')">
              </tm-upload>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
      <!-- </q-card-section> -->
    </q-form>
  </q-card>
</template>

<script>
import * as api from '@/api/users'
import regionData from '@/i18n/region'
import tmUpload from '@/components/tm-upload'
export default {
  components: { tmUpload },
  props: {
    dialog: { type: Boolean, default: true },
    item: { type: Object, default: () => { } },
    items: { type: Array, default: () => [] },
    roles: { type: Array, default: () => [] },
    genders: { type: Array, default: () => [] }
  },
  data() {
    return {
      loading: false,
      loading_add: false,
      loading_drafts: false,
      tabs: 'main',
      viewType: 'box',
      uploadUrl: process.env.API_FILE_UPLOAD,
      headers: [
        { name: 'Upload-Path', value: 'users' },
        { name: 'Upload-Rename', value: true },
        { name: 'x-access-token', value: `Bearer ${this.$store.state.auth.token}` }],
      regions: regionData,
      selected_region: null,
      form: {},
      gender: null,
      default: {
        email: null,
        password: null,
        full_name: null,
        phone: null,
        person_number: null,
        region: null,
        avatar: null,
        note: '',
        date_birth: this.$moment().format('YYYY/MM/DD'),
        gender: null,
        address: null,
        roles: [],
        verified: false,
        enable: true
      }
    }
  },
  watch: {
    dialog: {
      handler(val) {
        this.reset()
        if (this.item) {
          this.form = { ...this.item }
          this.form.date_birth = this.$moment(this.form.date_birth, 'YYYY/MM/DD').format('YYYY/MM/DD')
          const userRegion = this.regions.find(x => x.id === parseInt(this.form.region))
          if (userRegion) this.selected_region = userRegion
          if (this.form.gender) this.gender = this.genders.find(x => x._id === this.form.gender)
          else this.gender = this.gender = this.genders[0]
          // this.$refs.upload.removeUploadedFiles()
          // console.log(this.$refs.upload)
        }
      },
      deep: true,
      immediate: true
    }
    // form: {
    //   handler(val) {
    //     console.log(val)
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    onFilterRegion(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        // this.form.region = this.regions.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        this.regions = regionData.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    },
    validEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    onSubmit(action) {
      // console.log(this.item)
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.form.region = this.selected_region.id
          this.form.gender = this.gender._id
          if (this.item) {
            this.loading_add = true
            api.update(this.form).then((x) => {
              if (x.ok) {
                const index = this.items.indexOf(this.item)
                if (index > -1) this.items.splice(index, 1, this.form)
              }
            }).finally(() => {
              this.loading_add = false
            })
          } else {
            this.form.enable = action
            if (action) this.loading_add = true
            else this.loading_drafts = true
            api.insert(this.form).then((x) => {
              this.items.push(x)
              this.$q.notify({
                color: 'teal',
                message: `Username: ${x.email} - Password: ${x.password}`
              })
            }).finally(() => {
              this.loading_add = false
              this.loading_drafts = false
              this.reset()
            })
          }
        }
      })
    },
    reset() {
      new Promise((resolve, reject) => {
        this.form = { ...this.default }
        this.selected_region = this.regions[202]
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
