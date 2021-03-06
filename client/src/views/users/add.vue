<template>
  <div>
    <div class="row card-title">
      <div class="col-sm-auto col-xs-12 text-h6 card-title-text">
        <q-avatar v-if="dialog" :icon="$route.meta.icon" size="50px" />
        {{ this.item ? $t('global.update') : $t('global.add') }}
        <span class="text-weight-bold">{{ $t("users.title") }}</span>
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
          @click.prevent="onSubmit(true)">
          <!-- :label="dialog?'':$t('global.add')" -->
          <q-tooltip>{{$t('global.add')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="!item" flat type="submit" :dense="$store.getters.dense.button" color="amber"
          icon="receipt" :loading="loadingDrafts" :disable="loadingAdd"
          @click.prevent="onSubmit(false)">
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
        <q-tab name="main" :label="$t('tabs.main')" />
        <q-tab name="roles" :label="$t('roles.title')" />
        <q-tab name="avatar" :label="$t('users.avatar')" />
      </q-tabs>
      <q-separator />
      <!-- <q-card-section> -->
      <q-scroll-area style="height:calc(100vh - 180px)">
        <q-tab-panels v-model="tabs">
          <q-tab-panel name="main">
            <div class="row q-gutter-xs">
              <div class="col-12">
                <q-select v-model="group" input-debounce="200" :dense="$store.getters.dense.input"
                  :options="groups" :label="$t('users.group')" option-value="code"
                  :option-label="opt=>opt.name" :rules="[v=>!!v||$t('error.required')]" />
              </div>
            </div>
            <div v-if="!item" class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="form.username" :dense="$store.getters.dense.input"
                  v-lowercase :label="$t('users.username')"
                  :rules="[v=>!!v||$t('error.required'),v=>v.length>4||$t('error.minLength',{min:5})]" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <input type="password" class="hidden" />
                <q-input v-model.trim="form.password" :dense="$store.getters.dense.input"
                  :label="$t('users.password')" autocomplete="new-password" :type="passwordType"
                  :rules="[v=>!!v||$t('error.required'),v=>v.length>5||$t('error.minLength',{min:6})]">
                  <template v-slot:append>
                    <q-icon v-if="passwordType === 'password'" name="visibility_off"
                      @click="passwordType = 'text'" class="cursor-pointer" />
                    <q-icon v-else name="visibility" @click="passwordType = 'password'"
                      class="cursor-pointer" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input v-model.trim="form.email" :dense="$store.getters.dense.input" v-lowercase
                  :label="$t('users.email')"
                  :rules="[v=>!!v||$t('error.required'),v=>validEmail(v)||$t('error.email')]" />
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model.trim="form.fullName" :dense="$store.getters.dense.input"
                  :label="$t('users.fullName')" :rules="[v=>!!v||$t('error.required')]" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5">
                <q-input :value="form.dateBirth" :dense="$store.getters.dense.input" readonly
                  :label="$t('users.dateBirth')" :hint="`${$t('global.format')}: DD/MM/YYYY`">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="dateBirth" transition-show="scale"
                        transition-hide="scale">
                        <q-date v-model="form.dateBirth" mask="DD/MM/YYYY" today-btn
                          @input="() => $refs.dateBirth.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="col-12 col-md-6">
                <q-input v-model.trim="form.personNumber" type="number"
                  :dense="$store.getters.dense.input" :label="$t('users.personNumber')"
                  :rules="[v=>!!v||$t('error.required')]" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-3">
                <q-select v-model="selectedRegion" use-input hide-selected fill-input
                  input-debounce="0" :dense="$store.getters.dense.input" :options="regions"
                  @filter="onFilterRegion" :hint="$t('users.selectRegion')" option-value="id"
                  option-label="name_l" :rules="[v=>!!v||$t('error.required')]">
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
                        <q-item-label caption>{{
                        `+${scope.opt.pc}`
                      }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">{{
                      $t("table.noData")
                    }}</q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-6 col-md-5">
                <q-input v-model.trim="form.phone" :hint="$t('users.phone')"
                  :placeholder="$t('users.phone')" :dense="$store.getters.dense.input"
                  :rules="[v=>!!v||$t('error.required')]">
                  <template v-if="selectedRegion" v-slot:prepend>
                    <span style="font-size:14px;line-height:0">
                      +{{ selectedRegion.pc }}
                    </span>
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="col-6 col-md-3">
                <q-select v-model="gender" :options="$store.getters.genders"
                  :hint="$t('users.gender')" :dense="$store.getters.dense.input"
                  :options-dense="$store.getters.dense.input" option-value="id"
                  :option-label="v => $t(`gender.${v.code}`)"
                  :rules="[v=>!!v||$t('error.required')]" />
              </div>
            </div>
            <div class="row q-gutter-xs q-mb-sm">
              <div class="col-12">
                <q-input v-model="form.address" :label="$t('users.address')"
                  :dense="$store.getters.dense.input" />
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div class="col-12 col-md-5 self-center">
                <q-toggle v-model="form.verified" :true-value="true"
                  :dense="$store.getters.dense.input" :label="$t('users.verified')"
                  :text-color="form.verified ? 'green' : 'blue-grey-10'" />
              </div>
              <q-space />
              <div class="col-12 col-md-6 self-center" v-if="item">
                <q-toggle v-model="form.enable" :true-value="true"
                  :dense="$store.getters.dense.input"
                  :label="form.enable ? $t('global.working') : $t('global.lock')" />
              </div>
            </div>
            <div class="row q-gutter-xs q-mt-sm">
              <div class="col-12 col-md-12 self-center">
                {{ $t("users.note") }}:
              </div>
              <div class="col-12">
                <!-- <q-input v-model.trim="form.note" autogrow :label="$t('users.note')" :dense="$store.getters.dense.input" /> -->
                <q-editor v-model.trim="form.note" min-height="2rem" />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="roles">
            <q-tree ref="menu" class="col-12 col-sm-6" :nodes="roles"
              :dense="$store.getters.dense.input" :ticked.sync="form.roles" node-key="id"
              tick-strategy="leaf" :no-nodes-label="$t('table.noData')" />
            <!-- <q-btn flat color="positive" icon="check_circle" :label="$t('global.add')" @click="onTicked">
          </q-btn> -->
          </q-tab-panel>
          <q-tab-panel name="avatar">
            <div class="row">
              <div class="col-12 q-gutter-sm images">
                <tm-upload :data.sync="form.avatar" :upload-url="uploadUrl" :headers="headers"
                  :max-file-size="1024*1024*2" accept=".jpg,.jpeg,.png,.gif" :multiple="false"
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
        </q-tab-panels>
      </q-scroll-area>
      <!-- </q-card-section> -->
    </q-form>
    <!-- </q-card> -->
  </div>
</template>

<script>
import * as apiUsers from '@/api/users'
import regionData from '@/i18n/region'
export default {
  components: { tmUpload: () => import('@/components/tm-upload') },
  props: {
    dialog: { type: Boolean, default: false },
    item: { type: Object, default: () => { } },
    items: { type: Array, default: () => [] },
    roles: { type: Array, default: () => [] },
    groups: { type: Array, default: null },
    maximized: { type: Boolean, default: false }
  },
  data() {
    return {
      loading: false,
      loadingAdd: false,
      loadingDrafts: false,
      passwordType: 'password',
      tabs: 'main',
      viewType: 'box',
      uploadUrl: process.env.API_FILE_UPLOAD,
      headers: [
        { name: 'Upload-Path', value: 'users' },
        { name: 'Upload-Rename', value: true },
        { name: 'x-access-token', value: `Bearer ${this.$store.state.auth.token}` }],
      regions: regionData,
      selectedRegion: null,
      form: {},
      gender: {},
      group: null,
      default: {
        group: null,
        username: null,
        password: null,
        fullName: null,
        email: null,
        phone: null,
        personNumber: null,
        region: null,
        avatar: null,
        note: '',
        dateBirth: this.$moment().format('DD/MM/YYYY'),
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
          this.form.dateBirth = this.$moment(this.form.dateBirth, 'YYYY/MM/DD').format('YYYY/MM/DD')
          const userRegion = this.regions.find(x => x.id === parseInt(this.form.region))
          if (userRegion) this.selectedRegion = userRegion
          this.gender = this.$store.getters.genders.find(x => x.id === this.form.gender)
          this.group = this.groups.find(x => x.code === this.form.group)
          this.form.note = this.form.note || ''
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
    onSelectCategory(item) {
      if (!item.children || !item.children.length) {
        this.form.group = item._id
      }
    },
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
          this.form.region = this.selectedRegion.id
          this.form.gender = this.gender.id
          this.form.group = this.group.code
          if (this.item) {
            this.loadingAdd = true
            apiUsers.update(this.form).then((x) => {
              if (x.ok) {
                const index = this.items.indexOf(this.item)
                if (index > -1) this.items.splice(index, 1, this.form)
              }
            }).finally(() => {
              this.loadingAdd = false
            })
          } else {
            this.form.enable = action
            if (action) this.loadingAdd = true
            else this.loadingDrafts = true
            apiUsers.insert(this.form).then((x) => {
              this.items.push(x)
              this.$q.notify({
                color: 'teal',
                message: `Username: ${x.username} - Password: ${x.password}`
              })
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
        this.selectedRegion = this.regions[202]
        this.gender = this.$store.getters.genders[0]
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
