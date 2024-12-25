<script setup lang="ts">
import { useAppStore, useGroupStore, useProductStore } from '@/store'
import { historyBack } from '@/router'
import { $t } from '@/i18n'
import { showImagePreview } from 'vant'
import { showNotify } from 'vant'
import { MdEditor } from 'md-editor-v3'
import componentGroup from "@/views/groups/groups.vue"
const googleDrive = defineAsyncComponent(() => import('@/components/google-drive.vue'))
const tmViewList = defineAsyncComponent(() => import('@/components/tmViewList.vue'))

const route = useRoute()
const appStore = useAppStore()
const groupStore = useGroupStore()
const productStore = useProductStore()
const form = computed(() => productStore.item)
const isDialogGroup = ref(false)
const groups = ref([])
const formDate = ref({
  dateBirth: [],
  lastLogin: [],
  lastChangePass: []
})
const flag = ref(false)
const active = ref('basicInf')
const isDialogDrive = ref(false)

const initForm = async () => {
  if (route.params.id && !form.value._id) await productStore.getItem(route.params)
  groups.value = groupStore.all.filter(x => form.value.groups.includes(x._id)).sort((a, b) => a.level - b.level)
  flag.value = form.value.flag ? true : false
}
initForm()

const onSelectParent = async (arg) => {
  try {
    if (!arg || arg.length < 1) {
      showNotify({ type: 'warning', message: $t(`error.required`) })
      return
    }
    isDialogGroup.value = false
    groups.value = groupStore.all.filter(x => arg.includes(x._id)).sort((a, b) => a.level - b.level)
  } catch (error) {
    if (error.data && error.data.message) showNotify({ type: 'danger', message: $t(`error.${error.data.message}`) })
    else showNotify({ type: 'danger', message: $t(`http.${error.status}`) })
  }
}
const onSelectImages = (val) => {
  // console.log(val)
  isDialogDrive.value = true
}
const onDeleteIamge = (img) => {
  // console.log(img)
  // console.log(imagesSelected.value)
}
const onSelectDriveImage = (arg) => {
  isDialogDrive.value = false
  // form.value.avatar = [arg]
}
const onSubmit = async () => {
  console.log(form.value)
  // window.$notify("abc")
  try {
    if (form.value._id) {
      form.value.flag = flag.value ? 1 : 0
      const rs = await productStore.update(form.value)
      if (rs.data) showNotify({ type: 'success', message: $t('success.update') })
    } else {
      const rs = await productStore.create(form.value)
      if (rs.data) {
        showNotify({ type: 'primary', message: $t('success.create') })
        productStore.setItem()
      }
    }
  } catch (error) {
    if (error.data && error.data.message) showNotify({ type: 'danger', message: $t(`error.${error.data.message}`) })
    else showNotify({ type: 'danger', message: $t(`http.${error.status}`) })
  }
}
</script>
<template>
  <van-form required="auto" @submit="onSubmit">
    <van-tabs v-model:active="active">
      <van-tab :title="$t('tabs.basicInf')" name="basicInf">
        <van-cell-group inset>
          <van-field v-model="form.code" name="code" :label="$t('global.code')" disabled
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field name="parent" :label="$t('group.titleproduct')" readonly right-icon="arrow"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]"
            @click="isDialogGroup = true">
            <template #input>
              {{ groups && groups.length ? groups.map(x => x.title).join(', ') : 'Root' }}
            </template>
          </van-field>
          <van-field v-model="form.title" name="title" :label="$t('global.title')"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.unit" name="unit" :label="$t('global.unit')"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field name="weight" :label="$t('product.weight')">
            <template #input>
              <van-stepper v-model="form.weight" />
            </template>
          </van-field>
          <van-field name="order" :label="$t('global.order')">
            <template #input>
              <van-stepper v-model="form.order" />
            </template>
          </van-field>
          <van-field name="flag" :label="$t('global.status')">
            <template #input>
              <van-switch v-model="flag" />
            </template>
          </van-field>
          <van-field v-model="form.desc" type="textarea" rows="1" autosize name="note" :label="$t('global.note')"
            :placeholder="$t('global.inputPlaceholder')" />
        </van-cell-group>
      </van-tab>
      <van-tab :title="$t('global.images')" name="images">
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
          <tm-view-box v-model="form.images" border="" :isPreview="false" @onClick="onSelectImages" />
          <!-- <tm-view-list v-model="images" v-model:selected="imagesSelected" multiple :is-trashed="true"
            @onDelete="onDeleteIamge" /> -->
        </div>
      </van-tab>
      <van-tab :title="$t('global.attributes')" name="attributes">
        <van-cell-group inset>
          <van-field name="brand" :label="$t('product.brand')" :placeholder="$t('global.inputPlaceholder')" />
          <van-field name="originName" :label="$t('product.originName')" :placeholder="$t('global.inputPlaceholder')" />
          <van-field name="originAddress" :label="$t('product.originAddress')"
            :placeholder="$t('global.inputPlaceholder')" />
          <van-field name="date" :label="$t('product.date')" :placeholder="$t('global.inputPlaceholder')" />
          <van-field name="attr" :label="$t('global.attributes')" :placeholder="$t('global.inputPlaceholder')" />
          <van-field name="tags" :label="$t('global.tags')" :placeholder="$t('global.inputPlaceholder')" />
          <van-field name="meta" label="Meta" :placeholder="$t('global.inputPlaceholder')" />
        </van-cell-group>
      </van-tab>
      <van-tab :title="$t('global.content')" name="content">
        <van-field v-model="form.content" name="content" :label="$t('global.content')"
          :placeholder="$t('global.inputPlaceholder')">
          <template #input>
            <MdEditor v-model="form.content" :preview="false" :theme="appStore.darkMode ? 'dark' : 'light'" />
          </template>
        </van-field>
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
  <van-dialog v-model:show="isDialogGroup" :title="$t('group.titleproduct')" :show-cancel-button="false"
    :show-confirm-button="false">
    <componentGroup :flag="1" text="" type="product" :root="false" :selected="form.groups"
      :lbl-submit="$t('global.confirm')" :lbl-cancel="$t('global.back')" @on-submit="onSelectParent"
      @on-cancel="isDialogGroup = false" />
  </van-dialog>
  <van-dialog v-model:show="isDialogDrive" title="Drive" :show-cancel-button="false" :showConfirmButton="false"
    close-on-click-action>
    <template #title>
      <!-- <div class="flex">
        <div class="flex flex-none h-6 w-12 items-center justify-center pl-5">Drive</div>
        <div class="flex h-6 grow"></div>
        <div class="flex flex-none h-6 w-12 items-center justify-center">
          <van-icon name="cross" @click="isDialogDrive = false" />
        </div>
      </div> -->
    </template>
    <google-drive @on-close="isDialogDrive = false" @on-select="onSelectDriveImage" />
  </van-dialog>
</template>
