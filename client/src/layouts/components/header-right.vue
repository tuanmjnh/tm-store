<template>
  <!-- <q-btn-dropdown class="self-stretch row no-wrap"> -->
  <!-- <q-btn v-if="!$q.platform.is.mobile" flat size="md"
      :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" @click="$q.fullscreen.toggle()" color="grey-1">
      <q-tooltip>{{$q.fullscreen.isActive ? $t('global.normal_screen') : $t('global.full_screen')}}</q-tooltip>
    </q-btn> -->
  <!-- <q-btn flat size="md" color="grey-1" icon="format_size">
      <template v-slot:label>
        <q-tooltip>{{$t('navbar.size')}}</q-tooltip>
      </template>
      <q-menu transition-show="jump-down" transition-hide="jump-up">
        <q-list dense>
          <template v-for="(item,index) in sizes">
            <q-item v-if="item.key==size" clickable v-close-popup :key="index" :active="true">
              <q-item-section>{{$t(`size.${item.key}`)}}</q-item-section>
            </q-item>
            <q-item v-else clickable v-close-popup :key="index" @click="onSetSize(item,true)">
              <q-item-section>{{$t(`size.${item.key}`)}}</q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-menu>
    </q-btn> -->
  <!-- <q-btn flat size="sm" color="grey-1" icon="g_translate">
      <template v-slot:label>
        <q-tooltip>{{$t('navbar.switch_language')}}</q-tooltip>
      </template>
      <q-menu transition-show="jump-down" transition-hide="jump-up">
        <q-list dense>
          <template v-for="(item,index) in languages">
            <q-item v-if="`${item.cc_iso}-${item.cc}`===language" clickable v-close-popup :key="index" :active="true">
              <q-item-section>{{item.name_l}}</q-item-section>
            </q-item>
            <q-item v-else clickable v-close-popup :key="index" @click="onSetLanguage(item,true)">
              <q-item-section>{{item.name_l}}</q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-menu>
    </q-btn> -->
  <!-- <q-btn-dropdown flat stretch>
      <template v-slot:label>
        <q-avatar size="33px">
          <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" />
        </q-avatar>
      </template>
      <q-list dense>
        <template v-for="(item,index) in items">
          <q-separator v-if="item.separator" :key="index" white inset />
          <q-item v-else clickable v-close-popup @click="onRouterLink(item)" :key="index">
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>{{$t(item.title)}}</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-btn-dropdown> -->
  <q-btn-dropdown flat stretch>
    <template v-slot:label>
      <q-avatar size="33px">
        <img v-if="$store.state.auth.user.avatar" :src="$store.state.auth.user.avatar" />
        <img v-else :src="$store.state.avatar">
      </q-avatar>
    </template>
    <div class="row no-wrap q-pa-md">
      <div class="column">
        <div class="text-h6 q-mb-md">{{$t('setting.title')}}</div>
        <q-list dense class="p-fix">
          <q-item>
            <q-btn-dropdown flat no-caps :label="language.name_l" icon="g_translate" dense
              class="btn-setting" :color="$store.getters.darkMode?'':'blue-grey'">
              <q-list dense>
                <template v-for="(e,i) in languages">
                  <q-item clickable v-close-popup :key="i"
                    :active="`${e.cc_iso}-${e.cc}`===$store.getters.language?true:false"
                    @click="onSetLanguage(e)">
                    <q-item-section>{{e.name_l}}</q-item-section>
                  </q-item>
                </template>
              </q-list>
            </q-btn-dropdown>
          </q-item>
          <!-- <q-item>
            <q-btn-dropdown flat no-caps :label="$t(`size.${size.key}`)" icon="format_size" size="md" class="btn-setting"
              :color="$store.getters.darkMode?'':'blue-grey'">
              <q-list dense>
                <template v-for="(e,i) in sizes">
                  <q-item clickable v-close-popup :key="i" :active="e.key===size.key?true:false" @click="onSetFontSize(e)">
                    <q-item-section>{{$t(`size.${e.key}`)}}</q-item-section>
                  </q-item>
                </template>
              </q-list>
            </q-btn-dropdown>
          </q-item> -->
          <q-item v-if="!$q.platform.is.mobile">
            <q-btn flat no-caps dense class="btn-setting"
              :label="$q.fullscreen.isActive ? $t('global.normalScreen') : $t('global.fullScreen')"
              :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
              @click="$q.fullscreen.toggle()" :color="$store.getters.darkMode?'':'blue-grey'"
              v-close-popup>
              <!-- <q-tooltip>
                  {{$q.fullscreen.isActive ? $t('global.normal_screen') : $t('global.full_screen')}}
                </q-tooltip> -->
            </q-btn>
          </q-item>
          <q-item>
            <q-toggle dense v-model="darkMode" label="Dark mode" size="xs" color="blue-grey"
              style="white-space:nowrap" :class="$store.getters.darkMode?'':'q-toggle-setting'" />
          </q-item>
        </q-list>
      </div>
      <q-separator vertical inset class="q-mx-lg" />
      <div class="column items-center cursor-pointer">
        <q-avatar size="72px" @click="onRouterLink('/profile')">
          <img v-if="$store.state.auth.user.avatar" :src="$store.state.auth.user.avatar">
          <img v-else :src="$store.state.avatar">
        </q-avatar>
        <!-- <router-link to="/profile"> -->
        <div class="q-mt-md q-mb-xs cursor-pointer text-blue" @click="onRouterLink('/profile')">
          {{$store.state.auth.user?
            ($store.state.auth.user.full_name?$store.state.auth.user.full_name:$store.state.auth.user.email):
            $t('global.undefined')}}
        </div>
        <!-- </router-link> -->
        <q-btn :label="$t('navbar.logOut')" @click.prevent="onLogout" color="blue-grey" size="sm"
          class="q-btn--square" style="white-space:nowrap" v-close-popup />
      </div>
    </div>
  </q-btn-dropdown>
</template>

<script>
import * as api from '@/api/users/setting'
import { openURL } from 'quasar'
import { isExternal } from '@/utils/validate'
import { getLanguage, getAllLanguage } from '@/i18n'
export default {
  data() {
    return {
      // language: {},
      // size: {}
      // avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'
    }
  },
  created() {
    // this.language = this.languages.find(x => `${x.cc_iso}-${x.cc}` === this.$store.getters.language)
    // this.size = this.sizes.find(x => x.value === this.$store.getters.font.size)
    // this.onSetLanguage(this.language)
    // this.onSetSize(this.size)
    // console.log(this.$store.getters.userSetting)
  },
  computed: {
    languages() {
      return this.$store.getters.languages
    },
    language() {
      return this.languages.find(x => `${x.cc_iso}-${x.cc}` === this.$store.getters.language)
    },
    // fontSize() {
    //   return this.font_size.find(x => parseInt(x.value) === this.$store.getters.font.size) || this.font_size[0]
    // },
    darkMode: {
      // getter
      get: function () {
        return this.$q.dark.isActive
      },
      // setter
      set: function (val) {
        this.$q.dark.set(val)
        const data = JSON.parse(JSON.stringify(this.$store.state.userSetting.data))
        data.darkMode = val
        this.$store.dispatch('userSetting/set', data)
        this.onUpdate()
      }
    }
  },
  methods: {
    onSetLanguage(item, isNotify) {
      if (this.language !== item) {
        const data = JSON.parse(JSON.stringify(this.$store.state.userSetting.data))
        data.language = `${item.cc_iso}-${item.cc}`
        this.$store.dispatch('userSetting/set', data)
        this.onUpdate()
      }
    },
    onSetFontSize(item, isNotify) {
      if (this.fontSize.key !== item.key) {
        const data = JSON.parse(JSON.stringify(this.$store.state.userSetting.data))
        data.font.size = parseInt(item.value)
        this.$store.dispatch('userSetting/set', data)
        this.onUpdate()
      }
    },
    onRouterLink(path) {
      if (isExternal(path)) {
        openURL(path)
      } else {
        this.$router.push(path).catch(err => { })
      }
    },
    onUpdate() {
      api.update(this.$store.state.userSetting.data)
    },
    onLogout() {
      this.$store.dispatch('auth/logout').then(x => {
        this.$router.push(`/login?redirect=${this.$route.path}`)
      })
    }
  }
}
</script>

<style>
.btn-setting {
  font-weight: initial;
}
.q-toggle-setting {
  color: #607d8b;
}
.p-fix > .q-item {
  padding: 2px 0 !important;
}
</style>
