<template>
  <div v-if="!$store.state.auth.verified"
       class="window-height window-width row justify-center items-center">
    <q-form ref="form" class="col-9 col-md-4">
      <q-card flat square inline bordered>
        <q-card-section class="bg-teal text-white">
          <div class="text-h6">{{$t('login.title')}}</div>
          <!-- <div class="text-subtitle2">by John Doe</div> -->
        </q-card-section>
        <q-card-section>
          <div class="q-pl-md q-pr-md q-pt-md">
            <q-input v-model.trim="form.username" :dense="$store.getters.dense.input" v-lowercase
                     :hint="$t('login.username')" :placeholder="$t('login.username')"
                     :rules="[v=>v&&v.length>0||$t('error.required')]" />
          </div>
          <div class="q-pl-md q-pr-md q-pt-md">
            <q-input v-model.trim="form.password" :type="passwordType"
                     :dense="$store.getters.dense.input" :hint="$t('login.password')"
                     :placeholder="$t('login.password')" @keyup.native="checkCapslock"
                     @blur="capsTooltip=false" :rules="[v=>v&&v.length>0||$t('error.required')]"
                     class="capsTooltip">
              <template v-slot:append>
                <q-icon v-if="passwordType==='password'" name="visibility_off"
                        @click="passwordType='text'" class="cursor-pointer" />
                <q-icon v-else name="visibility" @click="passwordType='password'"
                        class="cursor-pointer" />
                <q-tooltip v-model="capsTooltip" :no-parent-event="true" :offset="[10, 10]"
                           content-class="bg-indigo">
                  Caps lock
                </q-tooltip>
              </template>
            </q-input>
          </div>
          <div class="q-pl-xs q-pr-md q-pt-md">
            <q-checkbox v-model="form.remember" :label="$t('login.remember')" />
          </div>
        </q-card-section>
        <!-- <q-separator dark inset /> -->
        <q-card-actions align="right">
          <q-btn type="submit" flat :dense="$store.getters.dense.button" color="blue"
                 :label="$t('login.login')" :loading="$store.state.loading.post"
                 @click.prevent="onSubmit">
            <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
          </q-btn>
          <!-- <q-btn flat>Action 2</q-btn> -->
        </q-card-actions>
      </q-card>
    </q-form>
  </div>
</template>

<script>
import * as apiUserSetting from '@/api/users/setting'
export default {
  data() {
    return {
      loading: false,
      form: {
        username: '',
        password: '',
        remember: true
      },
      passwordType: 'password',
      capsTooltip: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    validEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    onSubmit() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.$store.dispatch('auth/verify', this.form)
            .then(() => {
              this.$router.push({ path: this.redirect }).catch((e) => { })
              // }).then(() => {
              // Set user setting
              if (this.$store.state.auth.verified) {
                apiUserSetting.get().then(x => {
                  this.$store.commit('userSetting/INIT', x)
                  this.$q.dark.set(this.$store.getters.darkMode)
                })
                // this.$store.dispatch('userSetting/get').then(() => {
                //   // this.$store.dispatch('userSetting/reload').then(() => {
                //   //   console.log(this.$store.state.userSetting.darkMode)
                //   //   this.$q.dark.set(this.$store.getters.darkMode)
                //   // })
                //   // console.log(this.darkMode)
                //   // this.$store.dispatch('userSetting/getDarkMode')
                // })
                // // console.log(this.$store.state.userSetting.language)
              }
            })
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  }
}
</script>

<style>
</style>
