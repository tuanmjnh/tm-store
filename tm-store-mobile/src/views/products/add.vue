<script setup lang="ts">
import { useAppStore, useTypeStore, useGroupStore, useProductStore } from '@/store'
import { historyBack } from '@/router'
import { $t } from '@/i18n'
import { showNotify } from 'vant'
import { MdEditor } from 'md-editor-v3'
import { GoogleDrive } from '@/services/google/drive-gapi'
import componentGroup from "@/views/groups/groups.vue"
import googleDriveUpload from "@/components/google-drive-upload.vue"
import vueQrcodeReader from '@/components/vueQrcodeReader.vue'
const googleDrive = defineAsyncComponent(() => import('@/components/google-drive.vue'))
const componentTypes = defineAsyncComponent(() => import('./types.vue'))
const qrcodeGenerator = defineAsyncComponent(() => import('@/components/qrcodeGenerator.vue'))
const barcodeGenerator = defineAsyncComponent(() => import('@/components/barcodeGenerator.vue'))

const route = useRoute()
const appStore = useAppStore()
const typeStore = useTypeStore()
const groupStore = useGroupStore()
const productStore = useProductStore()
const GDrive = new GoogleDrive()
const form = computed(() => productStore.item)
const isDialogGroup = ref(false)
const isDialogUnits = ref(false)
const isDialogTypes = ref(false)
const isDialogDrive = ref(false)
const isDialogUpload = ref(false)
const isImagesLoading = ref(false)
const isDialogQRCode = ref(false)
const isDialogQRCodeScanner = ref(false)
const isDialogBarCode = ref(false)
const fileUploadList = ref([])
const typeView = ref(0)
const mediaView = ref(0)
const units = ref(typeStore.all.filter(x => x.flag == 1 && x.key == 'unit').sort((a, b) => a.order - b.order))
const unit = ref(null)
const groups = ref([])
const flag = ref(false)
const imagesSelected = ref([])
const activeTab = ref('basicInf')

const initForm = async () => {
  if (route.params.id && !form.value._id) await productStore.getItem(route.params)
  if (form.value.groups && form.value.groups.length) groups.value = groupStore.all.filter(x => form.value.groups.includes(x._id)).sort((a, b) => a.level - b.level)
  flag.value = form.value.flag ? true : false
  unit.value = units.value.find(x => x.code === form.value.unit)
  isImagesLoading.value = true
  if (form.value.images) {
    form.value.images = await GDrive.GetFilesById({ ids: form.value.images.map(x => x.id) })
    isImagesLoading.value = false
  }
  // console.log(form.value)
  // console.log(form.value.groups)
}
initForm()

const onSelectGroup = async (arg) => {
  try {
    if (!arg || arg.length < 1) {
      showNotify({ type: 'warning', message: $t(`error.required`) })
      return
    }
    isDialogGroup.value = false
    groups.value = groupStore.all.filter(x => arg.includes(x._id)).sort((a, b) => a.level - b.level)
    form.value.groups = groups.value.map(x => x._id)
    if (groups.value.length && !form.value.code) form.value.code = `${groups.value[groups.value.length - 1].code}-`
  } catch (error) {
    if (error.data && error.data.message) showNotify({ type: 'danger', message: $t(`error.${error.data.message}`) })
    else showNotify({ type: 'danger', message: $t(`http.${error.status}`) })
  }
}
const onChangeUnit = (val) => {
  isDialogUnits.value = false
  unit.value = val
  form.value.unit = unit.value ? unit.value.code : null
}
const onSelectDriveImage = (arg) => {
  isDialogDrive.value = false
  if (arg) {
    if (!form.value.images || !form.value.images.length) form.value.images = [arg]
    else form.value.images.push(arg)
  }
}
const onEditType = (arg) => {
  isDialogTypes.value = true
  typeView.value = arg
}
const onFileUploaded = (args) => {
  if (args && args.length) {
    form.value.images = !form.value.images || !form.value.images.length ? args : form.value.images.concat(args)
    isDialogUpload.value = false
  }
}
const onQRCodeDetect = (args) => {
  if (args) {
    form.value.qrcode = JSON.parse(args.code)
    if (form.value.qrcode && form.value.qrcode.length) form.value.qrcode = form.value.qrcode[0]
  }
  else
    showNotify({ type: 'warning', message: $t('error.qrError') })
  isDialogQRCodeScanner.value = false
}
const onQRCodeError = async (args) => {
  // console.log(args)
  showNotify({ type: 'danger', message: `[${args.name}] - ${args.value}` })
}
const onSubmit = async () => {
  try {
    if (form.value._id) {
      form.value.flag = flag.value ? 1 : 0
      form.value.code = form.value.code?.toUpperCase()
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
    // console.log(error)
    if (error.data && error.data.message) showNotify({ type: 'danger', message: $t(`error.${error.data.message}`) })
    else showNotify({ type: 'danger', message: $t(`http.${error.status}`) })
  }
}
</script>
<template>
  <van-form required="auto" @submit="onSubmit">
    <van-tabs v-model:active="activeTab">
      <van-tab :title="$t('tabs.basicInf')" name="basicInf">
        <van-cell-group inset>
          <van-field v-model="groups.length" name="groups" :label="$t('group.title')" readonly is-link
            :placeholder="$t('global.inputPlaceholder')"
            :rules="[{ required: true, message: $t('error.required') }, { validator: (v) => !!v, message: $t('error.required') }]"
            @click="isDialogGroup = true">
            <template #input>
              {{ groups && groups.length ? groups.map(x => x.title).join(', ') : $t('group.select') }}
            </template>
          </van-field>
          <van-field v-model="form.code" name="code" :label="$t('global.code')" :disabled="!!form._id" v-uppercase
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.title" name="title" :label="$t('global.title')"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.unit" name="unit" :label="$t('global.unit')" is-link
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]"
            @click="isDialogUnits = true">
            <template #input>
              {{ unit ? unit.name : $t('global.inputPlaceholder') }}
            </template>
          </van-field>
          <van-field name="unit" :label="$t('product.type')" is-link :placeholder="$t('global.inputPlaceholder')"
            @click="onEditType(0)">
            <template #input>
              {{ form.types && form.types.length ? form.types.map(x => x.label).join(', ') :
                $t('global.inputPlaceholder') }}
              <!-- {{ form.types.length ? form.types.map(x => x.label).join(', ') : $t('global.updating') }} -->
            </template>
          </van-field>
          <van-field name="unit" :label="$t('product.price')" is-link :placeholder="$t('global.inputPlaceholder')"
            @click="onEditType(1)">
            <template #input>
              {{ productStore.getValueType(form, 'price', ' - ', true) }}
            </template>
          </van-field>
          <van-field name="unit" :label="$t('product.quantity')" is-link :placeholder="$t('global.inputPlaceholder')"
            @click="onEditType(1)">
            <template #input>
              {{ productStore.getValueType(form, 'quantity', ' - ', true) }}
            </template>
          </van-field>
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
          <van-field v-model="form.qrcode" name="qrcode" :label="$t('qrCode.qrCode')" is-link
            :placeholder="$t('qrCode.qrCode')" @click="isDialogQRCode = true">
            <template #input>
              <!-- {{ unit ? unit.name : $t('global.inputPlaceholder') }} -->
            </template>
          </van-field>
          <van-field v-model="form.barcode" name="barcode" :label="$t('qrCode.barCode')" is-link
            :placeholder="$t('qrCode.barCode')" @click="isDialogBarCode = true">
            <template #input>
              <!-- {{ unit ? unit.name : $t('global.inputPlaceholder') }} -->
            </template>
          </van-field>
          <van-field name="flag" :label="$t('global.status')">
            <template #input>
              <van-switch v-model="flag" />
            </template>
          </van-field>
        </van-cell-group>
      </van-tab>
      <!-- <van-tab :title="$t('tabs.price')" name="priceInf">
        <van-cell-group inset>
          <van-cell v-for="(e, i) in form.types" is-link>
            <template #title>{{ e.label }}</template>
            <template #label>

            </template>
          </van-cell>
        </van-cell-group>
      </van-tab> -->
      <van-tab title="Media" name="mediaInf">
        <div class="flex justify-end p-3 pr-5">
          <div class="pl-3" @click="isDialogUpload = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 48 48">
              <g fill="none">
                <path fill="currentColor"
                  d="M44 24a2 2 0 1 0-4 0zM24 8a2 2 0 1 0 0-4zm15 32H9v4h30zM8 39V9H4v30zm32-15v15h4V24zM9 8h15V4H9zm0 32a1 1 0 0 1-1-1H4a5 5 0 0 0 5 5zm30 4a5 5 0 0 0 5-5h-4a1 1 0 0 1-1 1zM8 9a1 1 0 0 1 1-1V4a5 5 0 0 0-5 5z" />
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
                  d="m6 35l10.693-9.802a2 2 0 0 1 2.653-.044L32 36m-4-5l4.773-4.773a2 2 0 0 1 2.615-.186L42 31m-5-13V6m-5 5l5-5l5 5" />
              </g>
            </svg>
          </div>
          <div class="pl-3" @click="isDialogDrive = true">
            <!-- <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 48 48">
              <g fill="none" stroke="currentColor" stroke-width="4">
                <path stroke-linejoin="round"
                  d="M5 8a2 2 0 0 1 2-2h12l5 6h17a2 2 0 0 1 2 2v26a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
                <path stroke-linecap="round" d="M18 27h12m-6-6v12" />
              </g>
            </svg> -->
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 48 48">
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                <path d="M4 9v32l5-20h30.5v-6a2 2 0 0 0-2-2H24l-5-6H6a2 2 0 0 0-2 2" />
                <path d="m40 41l4-20H8.813L4 41z" />
              </g>
            </svg>
          </div>
          <div class="pl-3" @click="mediaView = 0">
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 48 48">
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                <rect width="38" height="38" x="5" y="5" rx="2" />
                <path d="M24 5v38M5 24h38" />
              </g>
            </svg>
          </div>
          <div class="pl-3" @click="mediaView = 1">
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 48 48">
              <g fill="none">
                <rect width="32" height="40" x="8" y="4" stroke="currentColor" stroke-linejoin="round" stroke-width="4"
                  rx="2" />
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
                  d="M21 14h12M21 24h12M21 34h12" />
                <path fill="currentColor" fill-rule="evenodd"
                  d="M15 16a2 2 0 1 0 0-4a2 2 0 0 0 0 4m0 10a2 2 0 1 0 0-4a2 2 0 0 0 0 4m0 10a2 2 0 1 0 0-4a2 2 0 0 0 0 4"
                  clip-rule="evenodd" />
              </g>
            </svg>
          </div>
        </div>
        <div class="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">
          <tm-view-box v-if="mediaView == 0" v-model="form.images" border="" v-model:selected="imagesSelected"
            is-preview multiple is-delete is-trashed v-model:is-loading="isImagesLoading"
            :title-delete="$t('messageBox.delete')" :lbl-ok="$t('messageBox.confirm')"
            :lbl-cancel="$t('global.back')" />
          <tm-view-list v-else v-model="form.images" v-model:selected="imagesSelected" multiple is-preview is-delete
            is-trashed v-model:is-loading="isImagesLoading" :title-delete="$t('messageBox.delete')"
            :lbl-ok="$t('messageBox.confirm')" :lbl-cancel="$t('global.back')" />
        </div>
      </van-tab>
      <van-tab :title="$t('global.content')" name="content">
        <van-field v-model="form.desc" type="textarea" rows="1" autosize name="note" :label="$t('global.note')"
          :placeholder="$t('global.inputPlaceholder')" />
        <van-field v-model="form.content" name="content" :label="$t('global.content')"
          :placeholder="$t('global.inputPlaceholder')">
          <template #input>
            <MdEditor v-model="form.content" :preview="false" :theme="appStore.darkMode ? 'dark' : 'light'" />
          </template>
        </van-field>
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
      :lbl-submit="$t('global.confirm')" :lbl-cancel="$t('global.back')" is-bot @on-submit="onSelectGroup"
      @on-cancel="isDialogGroup = false" />
  </van-dialog>
  <van-dialog v-model:show="isDialogUnits" :title="$t('global.unit')" close-on-click-overlay
    :show-confirm-button="false" :show-cancel-button="false">
    <div class="overscroll-none overflow-auto h-96">
      <van-cell v-for="(e, i) in units" :title="e.name" :value="e.code" is-link @click="onChangeUnit(e)" />
    </div>
  </van-dialog>
  <van-dialog v-model:show="isDialogTypes" :title="$t('global.unit')" class="full-screen footer" close-on-click-overlay
    :show-confirm-button="false" :show-cancel-button="false">
    <template #title></template>
    <component-types v-model="form" v-model:typeView="typeView" @on-close="isDialogTypes = false"
      @on-update="isDialogTypes = false" />
    <template #footer></template>
  </van-dialog>
  <van-dialog v-model:show="isDialogDrive" title="Drive" class="full-screen" :show-cancel-button="false"
    :show-confirm-button="false" close-on-click-action>
    <template #title></template>
    <google-drive @on-close="isDialogDrive = false" multiple parent="1A4_7e1ElUPhwbHrKm12I7VU_9CwnChHV"
      @on-select="onSelectDriveImage" />
  </van-dialog>
  <van-dialog v-model:show="isDialogUpload" title="Upload" close-on-click-overlay :show-cancel-button="false"
    :show-confirm-button="false" @close="fileUploadList = []">
    <template #title>{{ $t('files.upload') }}</template>
    <!-- <van-uploader multiple :after-read="onAfterReadFileUpload">
      <template #preview-cover="{ file }">
        <div class="preview-cover van-ellipsis">{{ file.name }}</div>
      </template>
    </van-uploader> -->
    <google-drive-upload v-model="fileUploadList" multiple parent="1A4_7e1ElUPhwbHrKm12I7VU_9CwnChHV"
      @on-uploaded="onFileUploaded" />
  </van-dialog>
  <van-dialog v-model:show="isDialogQRCode" :title="$t('qrCode.qrCode')" close-on-click-overlay
    :show-cancel-button="false" :show-confirm-button="false" close-on-click-action>
    <qrcode-generator v-model="form.qrcode" :default-value="form.code" :lbl-scanner="$t('qrCode.qrCodeScanner')"
      :lbl-submit="$t('global.update')" :lbl-cancel="$t('global.back')" @on-scanner="isDialogQRCodeScanner = true"
      @on-cancel="isDialogQRCode = false" @on-submit="isDialogQRCode = false" />
  </van-dialog>
  <van-dialog v-model:show="isDialogBarCode" :title="$t('qrCode.barCode')" close-on-click-overlay
    :show-cancel-button="false" :show-confirm-button="false" close-on-click-action>
    <barcode-generator v-model="form.barcode" :default-value="form.code" :lbl-submit="$t('global.update')"
      :lbl-cancel="$t('global.back')" @on-cancel="isDialogBarCode = false" @on-submit="isDialogBarCode = false" />
  </van-dialog>
  <van-dialog v-model:show="isDialogQRCodeScanner" :title="$t('qrCode.qrCodeScanner')" class="full-screen"
    :show-cancel-button="false" :show-confirm-button="false" close-on-click-action>
    <vueQrcodeReader :lbl-cancel="$t('global.back')" @on-cancel="isDialogQRCodeScanner = false"
      @on-detect="onQRCodeDetect" @on-error="onQRCodeError" />
  </van-dialog>
</template>
<style>
.preview-cover {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}
</style>