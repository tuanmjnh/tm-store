<script setup lang="ts">
import { useAppStore, useTypeStore, useRoleStore, useUserStore } from '@/store'
import { historyBack } from '@/router'
import { $t } from '@/i18n'
import { showImagePreview } from 'vant'
import { GoogleDrive } from '@/services/google/drive-gapi'

// const tmFileList = defineAsyncComponent(() => import('@/components/tm-file-list/index.vue'))
// const tmFileManager = defineAsyncComponent(() => import('@/components/tm-file-manager/index.vue'))
// const tmUpload = defineAsyncComponent(() => import('@/components/tm-upload/index.vue'))
// const tmViewBox = defineAsyncComponent(() => import('@/components/tmViewBox.vue'))
const tmViewList = defineAsyncComponent(() => import('@/components/tmViewList.vue'))

const GDrive = new GoogleDrive()
// GDrive.getFolders()
GDrive.getFiles({ folderName: '5eccbc9e9071001d87fd4df1', isFolder: false,parents:'root' }).then(x=>{
})
// GDrive.getFile({ folderName: 'Capture.PNG' }).then(x => {
//   console.log(x)
// })

const route = useRoute()
const appStore = useAppStore()
const typeStore = useTypeStore()
const roleStore = useRoleStore()
const userStore = useUserStore()
const genders = ref(typeStore.getByKey('gender').map(x => { return { text: x.name, value: x.code } }))
// const images = ref([])
const form = computed(() => userStore.item)
const formDate = ref({
  dateBirth: [],
  lastLogin: [],
  lastChangePass: [],
})

const active = ref('basicInf')
const showGender = ref(false)
const showDatePicker = ref(false)

const initForm = async () => {
  if (route.params.id && !form.value._id) await userStore.getItem(route.params)
  formDate.value.dateBirth = appStore.formatDateToArray(form.value.dateBirth)
  // images.value = form.value.avatar
  // console.log(images.value)
}
initForm()

const onConfirmGender = ({ selectedOptions }) => {
  form.value.gender = selectedOptions[0].value
  showGender.value = false
}
const onConfirmDatePicker = ({ selectedValues }) => {
  form.value.dateBirth = new Date(selectedValues.join('-'))
  showDatePicker.value = false
}
const onSubmit = async () => {
  console.log(form.value)
  // window.$notify("abc")
  // try {
  //   if (form.value._id) {
  //     const rs = await userStore.update(form.value)
  //     if (rs.data) showNotify({ type: 'success', message: $t('success.update') })
  //   } else {
  //     const rs = await userStore.create(form.value)
  //     if (rs.data) {
  //       showNotify({ type: 'primary', message: $t('success.create') })
  //       userStore.setItem()
  //     }
  //   }
  // } catch (error) {
  //   if (error.data && error.data.message) showNotify({ type: 'danger', message: $t(`error.${error.data.message}`) })
  //   else showNotify({ type: 'danger', message: $t(`http.${error.status}`) })
  // }
}
const imagesSelected = ref([])
const images = ref([
  {
    name: 'image73',
    type: 'webp',
    alt: 'gallery',
    src: 'https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp'
  },
  {
    name: 'image74',
    type: 'webp',
    alt: 'gallery',
    src: 'https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(74).webp'
  },
  {
    name: 'image75',
    type: 'webp',
    alt: 'gallery',
    src: 'https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(75).webp'
  },
  {
    name: 'image70',
    type: 'webp',
    alt: 'gallery',
    src: 'https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp'
  },
  {
    name: 'image76',
    type: 'webp',
    alt: 'gallery',
    src: 'https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(76).webp'
  },
  {
    name: 'image72',
    type: 'webp',
    alt: 'gallery',
    src: 'https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(72).webp'
  },
  {
    name: 'image80',
    type: 'png',
    alt: 'gallery',
    src: 'https://drive.usercontent.google.com/download?id=1svsL4tYkSLdhN2MY2WVbv-x2VYEjHJrS&export=view&authuser=0'
  }
])
const onDeleteIamge = (img) => {
  // console.log(img)
  // console.log(imagesSelected.value)
}
</script>
<template>
  <van-form required="auto" @submit="onSubmit">
    <van-tabs v-model:active="active">
      <van-tab :title="$t('tabs.basicInf')" name="basicInf">
        <van-cell-group inset>
          <van-field v-model="form.username" name="username" :label="$t('user.username')" disabled
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.fullName" name="fullName" :label="$t('user.fullName')"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field is-link readonly name="dateBirth" :label="$t('user.dateBirth')"
            :placeholder="$t('global.inputPlaceholder')" @click="showDatePicker = true">
            <template #input>
              {{ appStore.formatDate(form.dateBirth) }}
            </template>
          </van-field>
          <van-field v-model="form.email" name="email" :label="$t('user.email')"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.phone" name="phone" :label="$t('user.phone')"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.personNumber" name="personNumber" :label="$t('user.personNumber')"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.region" name="region" :label="$t('user.region')"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.address" type="textarea" rows="1" autosize name="address" :label="$t('user.address')"
            :placeholder="$t('global.inputPlaceholder')" />
          <van-field is-link readonly name="gender" :label="$t('user.gender')"
            :placeholder="$t('global.inputPlaceholder')" @click="showGender = true">
            <template #input>
              {{ genders?.find(x => x.value == form.gender)?.text }}
            </template>
          </van-field>
          <van-field name="verified" :label="$t('user.verified')" :placeholder="$t('global.inputPlaceholder')">
            <template #input>
              <van-switch v-model="form.verified" disabled />
            </template>
          </van-field>
          <van-field name="enable" :label="$t('global.status')" :placeholder="$t('global.inputPlaceholder')">
            <template #input>
              <van-switch v-model="form.enable" disabled />
            </template>
          </van-field>
          <van-field readonly name="lastLogin" :label="$t('user.lastLogin')" :placeholder="$t('table.noData')">
            <template #input>
              {{ appStore.formatDateTime(form.lastLogin) }}
            </template>
          </van-field>
          <van-field readonly name="lastChangePass" :label="$t('user.lastChangePass')"
            :placeholder="$t('table.noData')">
            <template #input>
              {{ appStore.formatDateTime(form.lastChangePass) }}
            </template>
          </van-field>
        </van-cell-group>
      </van-tab>
      <van-tab :title="$t('user.roles')" name="roles" class="px-6">
        <van-checkbox-group v-model="form.roles" shape="square">
          <van-space direction="vertical" fill>
            <van-checkbox v-for="(e, i) in roleStore.items" :key="i" :name="e._id">{{ e.name }}</van-checkbox>
          </van-space>
        </van-checkbox-group>
      </van-tab>
      <van-tab :title="$t('global.avatar')" name="avatar">
        <!-- <tm-fileList v-model="form.avatar" :multiple="false" center :is-delete="false" :is-tooltip="false"
          :lblSelect="$t('global.select')" :lblView="$t('global.zoomIn')" :lblDelete="$t('global.delete')" size="83vw"
          thumbnailView thumbnailSize="s300">
          <template v-slot:tool-bar>
            <q-toolbar-title></q-toolbar-title>
            <q-btn round dense flat icon="file_upload" color="primary">
              <q-tooltip>{{ $t('files.upload') }}</q-tooltip>
            </q-btn>
            <q-btn round dense flat icon="cloud_circle" color="secondary">
              <q-tooltip>{{ $t('files.openFile') }}</q-tooltip>
            </q-btn>
          </template>
        </tm-fileList> -->
        <!-- <div class="flex justify-center mt-5">
          <van-image width="10rem" height="10rem" fit="cover" lazy-load
            :src="images && images.length ? images[0]?.thumbnail : ''" @click="onPreview" />
        </div> -->
        <div class="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">
          <tm-view-box v-model="images" v-model:selected="imagesSelected" multiple is-trashed
            @onDelete="onDeleteIamge" />
          <tm-view-list v-model="images" v-model:selected="imagesSelected" multiple :is-trashed="true"
            @onDelete="onDeleteIamge" />
        </div>
      </van-tab>
      <van-tab :title="$t('global.note')" name="note">
        <van-field v-model="form.note" type="textarea" rows="1" autosize name="note" :label="$t('global.note')"
          :placeholder="$t('global.inputPlaceholder')" />
      </van-tab>
    </van-tabs>
    <van-action-bar placeholder>
      <van-action-bar-icon icon="arrow-left" @click="historyBack()" />
      <van-action-bar-icon />
      <!-- <van-action-bar-button type="success" text="Copy" /> -->
      <van-action-bar-button v-if="form._id" type="success" native-type="submit" :text="$t('global.update')" />
      <van-action-bar-button v-else type="primary" native-type="submit" :text="$t('global.add')" />
    </van-action-bar>
  </van-form>
  <van-popup v-model:show="showGender" position="bottom">
    <van-picker :columns="genders" @confirm="onConfirmGender" @cancel="showGender = false"
      :confirm-button-text="$t('global.confirm')" :cancel-button-text="$t('global.cancel')" />
  </van-popup>
  <van-popup v-model:show="showDatePicker" position="bottom">
    <van-date-picker v-model="formDate.dateBirth" :confirm-button-text="$t('global.confirm')"
      :min-date="appStore.minDate()" :max-date="appStore.maxDate()" :cancel-button-text="$t('global.cancel')"
      @cancel="showDatePicker = false" @confirm="onConfirmDatePicker" />
  </van-popup>
</template>