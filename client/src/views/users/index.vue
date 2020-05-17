<template>
  <div>
    <q-table :data="items" :columns="columns" row-key="_id" flat :visible-columns="visibleColumns"
      :loading="$store.state.loading.get||$store.state.loading.patch" :selected.sync="selected"
      :dense="$store.getters.dense.table" selection="multiple" :no-data-label="$t('table.no_data')"
      :rows-per-page-label="$t('table.row_per_page')"
      :selected-rows-label="()=>`${selected.length} ${$t('table.row_selected')}`"
      :rows-per-page-options="[10, 20, 50 ,100, 200, 0]" :pagination.sync="pagination" @request="onSelect"
      :filter="pagination.filter" binary-state-sort>
      <template v-slot:top="props">
        <div class="col-12 row">
          <div class="col-xs-12 col-sm-auto q-table__title text-h6">{{$t('users.title')}}</div>
          <q-space />
          <div class="col-xs-12 col-sm-auto self-center text-right">
            <div class="col-auto self-center">
              <q-btn v-if="isRoutes.add" flat round dense icon="add" color="blue" @click="dialogAdd=true">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.add')}}</q-tooltip>
              </q-btn>
              <q-btn v-if="isRoutes.trash&&selected.length>0&&pagination.enable" flat round dense color="negative"
                icon="delete" @click="onTrash()">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.delete')}}</q-tooltip>
              </q-btn>
              <q-btn v-if="isRoutes.trash&&selected.length>0&&!pagination.enable" flat round dense color="warning"
                icon="restore_page" @click="onTrash()">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.recover')}}</q-tooltip>
              </q-btn>
              <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'" icon="menu_open">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.display_columns')}}</q-tooltip>
                <q-menu fit>
                  <q-list dense style="min-width:100px">
                    <template v-for="(item,index) in columns">
                      <q-item clickable :key="index" v-if="!item.required" @click="onColumns(item.name)"
                        :active="visibleColumns.indexOf(item.name)>-1||false">
                        <q-item-section>{{$t(item.label)}}</q-item-section>
                      </q-item>
                    </template>
                  </q-list>
                </q-menu>
              </q-btn>
              <q-btn flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
                :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen">
                <q-tooltip v-if="!$q.platform.is.mobile">
                  {{props.inFullscreen?$t('table.normal_screen'):$t('table.full_screen')}}</q-tooltip>
              </q-btn>
              <q-btn v-if="isRoutes.trash" flat round dense :color="$store.state.app.darkMode?'':'grey-7'"
                icon="more_vert">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.action')}}</q-tooltip>
                <q-menu auto-close>
                  <q-list dense bordered>
                    <q-item clickable>
                      <q-item-section no-wrap @click="onChangeEnable(true)">{{$t('global.working')}}</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section no-wrap @click="onChangeEnable(false)">{{$t('global.locked')}}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </div>
        <div class="col-12 row">
          <q-space />
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="pagination.filter" :dense="$store.getters.dense.input" debounce="500"
              :placeholder="$t('global.search')">
              <template v-slot:append>
                <q-icon v-if="pagination.filter===''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="pagination.filter=''" />
              </template>
            </q-input>
          </div>
        </div>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width>
            <q-checkbox v-if="props.multipleSelect" v-model="props.selected" indeterminate-value="some"
              :dense="$store.getters.dense.table" />
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="$store.state.app.darkMode" class="text-bold">{{ $t(col.label) }}</span>
            <span v-else class="text-bold text-blue-grey-10">{{ $t(col.label) }}</span>
          </q-th>
          <q-th v-if="isRoutes.edit||isRoutes.trash" auto-width>#</q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox v-model="props.selected" color="primary" :dense="$store.getters.dense.table" />
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email }}
          </q-td>
          <q-td key="full_name" :props="props">
            {{ props.row.full_name }}
          </q-td>
          <q-td key="phone" :props="props">
            {{ props.row.phone }}
          </q-td>
          <q-td key="roles" :props="props" class="q-gutter-xs">
            <!-- <q-badge :style="{backgroundColor:props.row.color}">{{ props.row.name }}</q-badge> -->
            <template v-if="props.row.roles&&props.row.roles.length>0">
              <q-badge class="bri" v-for="(item,index) in onFilterRoles(props.row.roles)" :key="index"
                :style="{backgroundColor:item.color}">
                {{item.label}}
              </q-badge>
            </template>
            <q-badge class="bri" v-else color="blue-grey-10">{{$t('global.undefined')}}</q-badge>
            <!-- {{ props.row.roles.length>0?props.row.roles.length:$t('global.undefined') }} -->
          </q-td>
          <q-td key="verified" :props="props">
            <!-- {{ props.row.verified }} -->
            <q-avatar icon="done" :text-color="props.row.verified?'green':'blue-grey-10'" />
          </q-td>
          <q-td v-if="isRoutes.edit||isRoutes.trash" auto-width class="text-center">
            <q-btn v-if="pagination.enable" flat round dense color="green" icon="vpn_key"
              :loading="loadingResetPassword" :size="$store.getters.dense.table?'sm':'md'"
              @click="onResetPassword(props.row)">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('users.reset_password')}}</q-tooltip>
            </q-btn>
            <q-btn v-if="isRoutes.edit" flat round dense icon="edit" color="light-green"
              :size="$store.getters.dense.table?'sm':'md'" @click="onUpdate(props.row)">
              <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.update')}}</q-tooltip>
            </q-btn>
            <template v-if="isRoutes.trash">
              <q-btn v-if="pagination.enable" flat round dense color="negative" icon="clear"
                :size="$store.getters.dense.table?'sm':'md'" @click="onTrash(props.row)">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.lock')}}</q-tooltip>
              </q-btn>
              <q-btn v-else flat round dense color="amber" icon="restore" :size="$store.getters.dense.table?'sm':'md'"
                @click="onTrash(props.row)">
                <q-tooltip v-if="!$q.platform.is.mobile">{{$t('global.unlock')}}</q-tooltip>
              </q-btn>
            </template>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- Add dialog -->
    <q-dialog v-model="dialogAdd" persistent>
      <template-add :dialog.sync="dialogAdd" :item.sync="selected[0]" :items.sync="items" :roles="roles"
        :genders="genders" />
    </q-dialog>
  </div>
</template>

<script>
import templateAdd from './add'
import * as api from '@/api/users'
import * as apiRoles from '@/api/roles'
import * as apiTypes from '@/api/types'
export default {
  components: { templateAdd },
  data() {
    return {
      dialogFilter: false,
      dialogAdd: false,
      items: [],
      selected: [],
      roles: [],
      genders: [],
      loadingResetPassword: false,
      isRoutes: {
        add: this.$router.has('manager-users-add'),
        edit: this.$router.has('manager-users-edit'),
        trash: this.$router.has('manager-users-trash')
      },
      pagination: {
        filter: '',
        sortBy: 'level',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 1,
        enable: true
      },
      visibleColumns: ['email', 'full_name', 'phone', 'roles', 'email_verified'],
      columns: [
        { name: 'email', field: 'email', label: 'users.email', align: 'left', sortable: true, required: true }, // row => this.$t(`roles.${row.name}`)
        { name: 'full_name', field: 'full_name', label: 'users.full_name', align: 'left', sortable: true, required: true },
        { name: 'phone', field: 'phone', label: 'users.phone', align: 'right', sortable: true },
        { name: 'roles', field: 'roles', label: 'roles.title', align: 'left', sortable: true },
        { name: 'verified', field: 'verified', label: 'users.verified', align: 'left', sortable: true }
      ]
    }
  },
  created() {
    this.onSelect({ pagination: this.pagination })
    this.onSelectRoles()
    this.onGetGenders()
  },
  watch: {
    dialogAdd(val) {
      if (!val) this.selected = []
    }
  },
  methods: {
    onSelect(props) {
      api.select(props.pagination).then((x) => {
        this.items = x.data
        this.pagination = props.pagination
        this.pagination.rowsNumber = x.rowsNumber
      })
    },
    onGetGenders() {
      this.genders = []
      apiTypes.select({ key: 'gender' }).then(x => {
        if (x && x.data) this.genders = x.data
      })
    },
    onSelectRoles() {
      apiRoles.select().then((x) => {
        if (x && x.data && x.data.length > 0) {
          this.roles = x.data.map(x => ({ id: x._id, label: x.name, color: x.color }))
        }
      })
    },
    onFilterRoles(roles) {
      const rs = this.roles.filter(x => roles.includes(x.id))
      // return rs.map(x => (x.label)).join(', ')
      return rs
    },
    onChangeEnable(enable) {
      if (enable === this.pagination.enable) return
      this.selected = []
      this.pagination.enable = enable
      this.onSelect({ pagination: this.pagination })
    },
    onColumns(value) {
      var index = this.visibleColumns.indexOf(value)
      if (index < 0) this.visibleColumns.push(value)
      else this.visibleColumns.splice(index, 1)
    },
    onUpdate(item) {
      this.dialogAdd = true
      this.selected = [item]
    },
    onTrash(item) {
      this.$q.dialog({
        title: this.$t('message_box.warning'),
        message: this.pagination.enable ? this.$t('message_box.lock') : this.$t('message_box.unlock'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        if (item) this.selected = [item]
        api.lock({ _id: this.selected.map(x => x._id) }).then((x) => {
          x.success.forEach(e => {
            const index = this.items.findIndex(x => x._id === e)
            this.items.splice(index, 1)
          })
        }).finally(() => {
          this.selected = []
        })
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        this.selected = []
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    onResetPassword(item) {
      this.$q.dialog({
        title: this.$t('message_box.warning'),
        message: this.$t('message_box.reset_password', { username: item.email }),
        cancel: true,
        persistent: true
      }).onOk(() => {
        if (item) this.selected = [item]
        this.loadingResetPassword = true
        api.resetPassword({ _id: item._id }).then((x) => {
          this.$q.notify({
            color: 'teal',
            timeout: 5000 * 60,
            message: this.$t('users.msg_reset_password', { username: item.email, password: x.password })
          })
        }).finally(() => {
          this.selected = []
          this.loadingResetPassword = false
        })
      }).onCancel(() => {
        this.selected = []
      })
    }
  }
}
</script>

<style>
</style>
