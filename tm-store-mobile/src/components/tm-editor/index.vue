<template>
  <!-- :dense="$q.screen.lt.md" -->
  <q-editor :modelValue="modelValue" :toolbar="toolbar" :definitions="definitions" :min-height="minHeight" :fonts="fonts"
            @update:model-value="$emit('update:modelValue', $event)" />
  <!-- Dialog Files -->
  <q-dialog v-model="isDialogFile" :maximized="maximized" square>
    <q-card class="full-width md-height q-pa-none">
      <q-card-section class="q-pa-none">
        <tm-fileManager :title="titleFileManager" :lblAccept="lblAccept" :lblSelect="lblSelect" :lblView="lblView" :accept="accept"
                        :is-delete="isDelete" :size="size" :url="url" :multiple="multiple" :mimeType="mimeType" :mobile="mobile"
                        :labelViewList="labelViewList" :labelViewBox="labelViewBox" :maximized="maximized" :headers="headers" @onAccept="onAccept">
          <template v-if="mobile" v-slot:headerLeft>
            <q-btn flat dense icon="arrow_back" v-close-popup />
          </template>
          <template v-if="!mobile" v-slot:headerRight>
            <q-btn flat round dense :icon="maximized?'fullscreen_exit':'fullscreen'" @click="maximized=!maximized">
              <q-tooltip>{{maximized?lblNormalScreen:lblFullScreen}}</q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="close" v-close-popup>
              <q-tooltip>{{lblCancel}}</q-tooltip>
            </q-btn>
          </template>
        </tm-fileManager>

        <!-- <tm-fileManager :title="title" :lblAccept="lblAccept" :lblConfirmTitle="lblConfirmTitle" :lblConfirmContent="lblConfirmContent"
                        :lblOk="lblOk" :lblCancel="lblCancel" :labelViewList="labelViewList" :labelViewBox="labelViewBox" :center="center"
                        :mobile="mobile" :maximized="maximized" :iconAccept="iconAccept" :noCapsAccept="noCapsAccept" :size="size"
                        :url="url" :multiple="multiple" :mimeType="mimeType" :accept="accept" :headers="headers" @onAccept="onAccept">
          <template v-slot:headerLeft>
            <slot name="headerLeft" v-if="slotHeaderLeft" />
          </template>
          <template v-slot:headerRight>
            <slot name="headerRight" v-if="slotHeaderRight" />
          </template>
        </tm-fileManager> -->
      </q-card-section>
    </q-card>
  </q-dialog>
  <!-- Dialog Upload-->
  <q-dialog v-model="isDialogUpload" :maximized="maximized" square>
    <q-card class="full-width md-height q-pa-none">
      <q-card-section class="q-pa-none">
        <tm-upload :multiple="true" :title="titleUpload" :useButton="useButton" :lblSelect="lblSelect" :lblView="lblView" :lblDelete="lblDelete"
                   :lblConfirmTitle="lblConfirmTitle" :lblConfirmDelete="lblConfirmDelete" :lblOk="lblOk" :lblCancel="lblCancel"
                   :labelViewList="labelViewList" :labelViewBox="labelViewBox" :lblOpen="lblOpenFile" :lblUpload="lblUpload" :size="size"
                   :mimeType="mimeType" :accept="accept" :maximized="maximized" :mobile="mobile" :iconOpen="iconUpload" :upload-url="url"
                   :headers="headers" @on-finish="onUploaded">
          <template v-if="mobile" v-slot:toolbarLeft>
            <q-btn flat dense icon="arrow_back" v-close-popup />
          </template>
          <template v-if="!mobile" v-slot:toolbarRight>
            <q-btn flat round dense :icon="maximized?'fullscreen_exit':'fullscreen'" @click="maximized=!maximized">
              <q-tooltip>{{maximized?lblNormalScreen:lblFullScreen}}</q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="close" v-close-popup>
              <q-tooltip>{{lblCancel}}</q-tooltip>
            </q-btn>
          </template>
        </tm-upload>
      </q-card-section>
    </q-card>
    <!-- <q-card style="width:500px;max-width:80vw;">
      <q-toolbar>
        <q-toolbar-title>{{$t('files.upload')}}</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup>
          <q-tooltip>{{$t('global.cancel')}}</q-tooltip>
        </q-btn>
      </q-toolbar>
      <q-separator />
      <q-card-section>
        <q-uploader ref="upload" square flat :multiple="multiple" :max-file-size="maxFileSize"
                    :accept="accept" style="width:100%" @uploaded="onUploaded" @finish="dialogUpload=false"
                    :url="url" :headers="headers">
        </q-uploader>
      </q-card-section>
    </q-card> -->
  </q-dialog>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from 'vue';
import { useQuasar } from 'quasar'
export default defineComponent({
  name: 'TMEditor',
  components: {
    tmUpload: defineAsyncComponent(() => import('components/tm-upload/index.vue')),
    tmFileManager: defineAsyncComponent(() => import('components/tm-file-manager/index.vue'))
  },
  props: {
    modelValue: { type: String, default: '' },
    accept: { type: String, default: '*' },
    minHeight: { type: String, default: '150px' },
    maxFileSize: { type: Number, default: 1024 * 1024 * 2 }, // 2MB
    mimeType: { type: String, default: null },
    url: { type: String, required: true },
    headers: { type: Array, default: () => [] },
    multiple: { type: Boolean, default: false },
    center: { type: Boolean, default: false },
    mobile: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    useButton: { type: Boolean, default: true },
    titleFileManager: { type: String, default: 'File Manager' },
    titleUpload: { type: String, default: 'Upload' },
    size: { type: String, default: '100px' },
    lblOpenFile: { type: String, default: 'Open file' },
    lblUpload: { type: String, default: 'Upload' },
    lblAccept: { type: String, default: 'Accept' },
    iconAccept: { type: String, default: 'file_download_done' },
    iconUpload: { type: String, default: 'photo_camera' },
    lblSelect: { type: String, default: 'Select' },
    lblView: { type: String, default: 'View' },
    labelViewList: { type: String, default: 'View list' },
    labelViewBox: { type: String, default: 'View box' },
    lblNormalScreen: { type: String, default: 'Normalscreen' },
    lblFullScreen: { type: String, default: 'FullScreen' },
    lblDelete: { type: String, default: 'Delete' },
    lblOk: { type: String, default: 'Ok' },
    lblCancel: { type: String, default: 'Cancel' },
    lblConfirmTitle: { type: String, default: 'Confirm' },
    lblConfirmDelete: { type: String, default: 'Are you sure you want to delete this record?' }
  },
  setup(props, { emit, slots }) {
    const $q = useQuasar()
    // Slots
    // const slotFileMamagerHeaderLeft = computed(() => !!slots['fileMamagerHeaderLeft'])
    // const slotFileMamagerHeaderRight = computed(() => !!slots['fileMamagerHeaderRight'])
    const isDialogFile = ref(false)
    const isDialogUpload = ref(false)
    const isLoading = ref(false)
    const maximized = ref(props.mobile || false)
    const toolbar = ref([
      [
        {
          icon: $q.iconSet.editor.align,
          fixedLabel: true,
          list: 'only-icons',
          options: ['left', 'center', 'right', 'justify']
        },
        {
          icon: $q.iconSet.editor.formatting,
          list: 'no-icons',
          options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
        },
        {
          icon: $q.iconSet.editor.fontSize,
          fixedLabel: false,
          fixedIcon: false,
          list: 'no-icons',
          options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
        },
        {
          icon: $q.iconSet.editor.font,
          fixedIcon: true,
          list: 'no-icons',
          options: ['default_font', 'arial', 'arial_black', 'comic_sans', 'courier_new', 'impact', 'lucida_grande', 'times_new_roman', 'verdana']
        },
        'removeFormat'
      ],
      ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
      ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
      ['undo', 'redo'],
      ['token', 'hr', 'link', 'loadFile', 'upload'],
      ['viewsource', 'print', 'fullscreen']
    ])
    const definitions = ref({
      loadFile: {
        tip: props.lblOpenFile,
        icon: 'pageview',
        handler: () => isDialogFile.value = true
      },
      upload: {
        tip: props.lblUpload,
        icon: 'cloud_upload',
        handler: () => isDialogUpload.value = true
      }
    })
    const fonts = ref({
      arial: 'Arial',
      arial_black: 'Arial Black',
      comic_sans: 'Comic Sans MS',
      courier_new: 'Courier New',
      impact: 'Impact',
      lucida_grande: 'Lucida Grande',
      times_new_roman: 'Times New Roman',
      verdana: 'Verdana'
    })
    const onGetImg = (url) => {
      return `<p style="text-align:center;"><img src="${url}" style="margin:0px;padding:0px;box-sizing:border-box;border:0px;line-height:0;max-width:100%;width:500px"/></p>`
    }
    return {
      isDialogFile, isDialogUpload, isLoading, toolbar, definitions, fonts, maximized,
      onGetImg,
      onAccept(val) {
        const files = val.map(x => x.url || e)
        let images = ''
        for (const e of files) images += onGetImg(e)
        isDialogFile.value = false
        emit('update:modelValue', props.modelValue + images)
      },
      onUploaded(val) {
        const files = val.map(x => x.url || e)
        let images = ''
        for (const e of files) images += onGetImg(e)
        isDialogUpload.value = false
        emit('update:modelValue', props.modelValue + images)
        // const res = JSON.parse(info.xhr.response)
        // if (res.length > 0) emit('update:modelValue', props.modelValue + onGetImg(res[0].fullName))
      }
    }
  }
})
</script>

<style>
</style>
