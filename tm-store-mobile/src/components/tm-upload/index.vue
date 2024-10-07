<template>
  <!-- <q-linear-progress :value="progress" :buffer="progress" /> -->
  <div :class="['layout-size',`${maximized?'maximized':''}`]">
    <q-toolbar class="bg-primary text-white">
      <slot v-if="slotToolbarLeft" name="toolbarLeft" />
      <q-toolbar-title>
        <span class="text-subtitle1">{{title}}</span>
      </q-toolbar-title>
      <q-btn v-if="files.length" dense flat :icon="iconUpload" :no-caps="noCaps" :disable="isLoading" :loading="isLoading" @click="onUpload()">
        <q-tooltip>{{lblUpload}}</q-tooltip>
      </q-btn>
      <!-- <q-btn v-if="files.length" dense flat :icon="iconUpload" :no-caps="noCaps" :disable="isLoading" :loading="isLoading" @click="onUpload2()">
        <q-tooltip>Upload 2</q-tooltip>
      </q-btn> -->
      <q-btn dense v-if="useButton" flat :icon="iconOpen" :no-caps="noCaps" :disable="isLoading" :loading="isLoading" @click="openFileDialog()">
        <q-tooltip>{{lblOpen}}</q-tooltip>
      </q-btn>
      <q-btn v-if="selected.length" flat :icon="iconTrash" :no-caps="noCaps" :disable="isLoading" @click="onDelete()">
        <q-tooltip>{{lblDelete}}</q-tooltip>
      </q-btn>
      <q-btn dense flat :icon="viewTypeLocal==='box'?'format_list_bulleted':'apps'" @click="onChangeView()">
        <q-tooltip v-if="!$q.platform.is.mobile">{{viewTypeLocal==='box'?labelViewList:labelViewBox}}</q-tooltip>
      </q-btn>
      <slot v-if="slotToolbarRight" name="toolbarRight" />
    </q-toolbar>
    <q-linear-progress v-if="isLoading" :value="progress" :buffer="progress" color="secondary" />
    <!-- <q-linear-progress v-show="isLoading" size="25px" :value="progress"> -->
    <!-- </q-linear-progress> -->
    <div class="tm-file-upload__content">
      <!-- <div v-if="!useButton" class="tm-uploader">
        <div class="tm-uploader__wrapper">
          <div class="tm-uploader__upload">
            <q-icon name="photo" />
            <input v-if="!isLoading" :disable="isLoading" type="file" :name="fileName" :accept="accept" :multiple="multiple"
                   @change="onChange">
          </div>
        </div>
      </div> -->
      <!-- <q-card-section>
        <div v-if="!useButton" class="tm-uploader">
          <div class="tm-uploader__wrapper">
            <div class="tm-uploader__upload">
            </div>
          </div>
        </div>
      </q-card-section> -->
      <q-card-section v-if="viewTypeLocal!=='list'" :class="`views view-box scroll ${center?'text-center':''}`">
        <view-box v-model="files" :is-delete="true" v-model:selected="selected" :size="size" :thumbnailView="thumbnailView" :lblSelect="lblSelect"
                  :lblView="lblView" :lblDelete="lblDelete" :lblRecycling="lblRecycling" :lblDeleteForever="lblDeleteForever" @on-delete="onDelete"
                  @on-select="onSelectItem">
          <template v-if="!useButton" v-slot:fistItem>
            <div :class="`item tm-uploader ${!multiple&&files.length?'hidden':''}`" :style="`width:${size};height:${size}`" @click="openFileDialog()">
              <div class="tm-uploader__wrapper">
                <div class="tm-uploader__upload" :style="`width:${size};height:${size}`">
                  <q-icon :name="iconOpen" :style="`font-size:calc(${size} / 2)`" />
                </div>
              </div>
            </div>
          </template>
        </view-box>
      </q-card-section>
      <q-card-section v-else class="views view-list scroll">
        <view-list v-model="files" v-model:selected="selected" :is-delete="true" :thumbnailView="thumbnailView" :lblSelect="lblSelect"
                   :lblView="lblView" :lblDelete="lblDelete" :lblRecycling="lblRecycling" :lblDeleteForever="lblDeleteForever" @on-delete="onDelete"
                   @on-select="onSelectItem">
          <template v-if="!useButton" v-slot:fistItem>
            <q-list @click="openFileDialog()">
              <q-item :class="`tm-uploader ${!multiple&&files.length?'hidden':''}`">
                <q-item-section avatar><q-icon :name="iconOpen" /></q-item-section>
                <q-item-section></q-item-section>
                <q-item-section side><q-icon name="file_upload" /></q-item-section>
              </q-item>
            </q-list>
          </template>
        </view-list>
      </q-card-section>
    </div>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed, onMounted, onBeforeUnmount } from "vue"
import axios from 'axios'
import { useQuasar } from 'quasar'
import { getBase64InputFile } from 'utils/file-upload'
export default defineComponent({
  name: "TMUpload",
  components: {
    // tmFileList: defineAsyncComponent(() => import('components/tm-file-list/index.vue'))
    viewList: defineAsyncComponent(() => import('components/tm-file-list/view-list.vue')),
    viewBox: defineAsyncComponent(() => import('components/tm-file-list/view-box.vue'))
  },
  props: {
    multiple: { type: Boolean, default: false },
    maxFileSize: { type: Number, default: 1024 * 1024 * 2 }, // 2MB
    accept: { type: String, default: '*' },
    uploadUrl: { type: String, required: true },
    headers: { type: Array, default: () => [] },
    center: { type: Boolean, default: false },
    maximized: { type: Boolean, default: false },
    mobile: { type: Boolean, default: false },
    iconOpen: { type: String, default: 'file_upload' },
    iconUpload: { type: String, default: 'cloud_upload' },
    iconTrash: { type: String, default: 'delete' },
    useButton: { type: Boolean, default: true },
    viewType: { type: String, default: 'box' },
    title: { type: String, default: null },
    txtContent: { type: String, default: 'Drag your file(s) here to begin<br> or click to browse' },
    lblOpen: { type: String, default: 'Open file' },
    lblUpload: { type: String, default: 'Upload file' },
    size: { type: String, default: '100px' },
    thumbnailView: { type: Boolean, default: false },
    fileName: { type: String, default: 'file' },
    lblSelect: { type: String, default: 'Select' },
    lblView: { type: String, default: 'View' },
    lblDelete: { type: String, default: 'Delete' },
    lblRecycling: { type: String, default: 'Recycling' },
    lblDeleteForever: { type: String, default: 'Delete forever' },
    labelViewList: { type: String, default: 'View list' },
    labelViewBox: { type: String, default: 'View box' },
    noCaps: { type: Boolean, default: false },
    lblOk: { type: String, default: 'Ok' },
    lblCancel: { type: String, default: 'Cancel' },
    lblConfirmTitle: { type: String, default: 'Confirm' },
    lblConfirmDelete: { type: String, default: 'Are you sure you want to delete this record?' }
  },
  setup(props, { emit, slots }) {
    const $q = useQuasar()
    const isDialog = ref(false)
    // const isReload = ref(true)
    const isLoading = ref(false)
    // Slots
    const slotToolbarLeft = computed(() => !!slots['toolbarLeft'])
    const slotToolbarRight = computed(() => !!slots['toolbarRight'])
    // TMFileList
    const files = ref([])
    const formDatas = ref([])
    const progress = ref(0.0)
    const selected = ref([])
    const viewTypeLocal = ref('box')

    const onReset = () => {
      isLoading.value = false
      files.value = []
      formDatas.value = []
      progress.value = 0.0
      emit('on-reset')
    }

    const progressValue = computed(() => {
      return (progress.value * 100).toFixed(0) + '%'
    })
    const calProgress = (val, total) => {
      return Math.min(1, val / total) // val / total // val * 100 / total
    }
    onMounted(() => { viewTypeLocal.value = props.viewType })
    onBeforeUnmount(() => { onReset() })
    return {
      isDialog, isLoading, files, selected, viewTypeLocal, slotToolbarLeft, slotToolbarRight, progress, progressValue,
      openFileDialog() {
        try {
          const input = document.createElement('input')
          input.type = 'file'
          input.name = props.fileName
          input.accept = props.accept
          input.multiple = props.multiple
          input.click()
          // console.log('click')
          // window.alert('click')
          input.onchange = async _ => {
            isLoading.value = true
            // console.log('onchange')
            // window.alert('onchange')
            const inputFiles = Array.from(input.files)
            // window.alert(inputFiles)
            for await (const file of inputFiles) {
              // for (let i = 0; i < inputFiles.length; i++) {
              if (props.multiple) {
                // console.log('loading file')
                // window.alert('loading file')
                const index = files.value.findIndex(x => x.name === file.name)
                if (index < 0) {
                  const base64 = await getBase64InputFile(file)
                  files.value.push({
                    name: file.name,
                    url: base64,
                    type: file.type,
                    size: file.size,
                    lastModified: file.lastModified,
                    lastModifiedDate: file.lastModifiedDate,
                    webkitRelativePath: file.webkitRelativePath
                  })
                  // console.log(files.value)
                  const formData = new FormData()
                  formData.append(props.fileName, file)
                  formDatas.value.push(formData)
                  // console.log('loaded file')
                  // window.alert('loaded file')
                }
              } else {
                // onReset()
                // console.log('loading file')
                // window.alert('loading file')
                const base64 = await getBase64InputFile(file)
                // console.log(base64)
                files.value.push({
                  name: file.name,
                  url: base64,
                  type: file.type,
                  size: file.size,
                  lastModified: file.lastModified,
                  lastModifiedDate: file.lastModifiedDate,
                  webkitRelativePath: file.webkitRelativePath
                })
                // console.log(files.value)
                const formData = new FormData()
                formData.append(props.fileName, file)
                formDatas.value.push(formData)
                // console.log('loaded file')
                // window.alert('loaded file')
              }
            }
            // setTimeout(() => {
            emit('on-change', inputFiles)
            isLoading.value = false
            // }, 200)
            // console.log('emit on-change')
            // window.alert('emit on-change')
          }
        } catch (e) {
          // window.alert(e)
        }
      },
      async onChange(event) {
        const inputFiles = event.target.files
        for (let i = 0; i < inputFiles.length; i++) {
          if (props.multiple) {
            // const index = files.value.findIndex(x => x.name === inputFiles[i].name)
            if (index < 0) {
              files.value.push({
                name: inputFiles[i].name,
                url: await getBase64InputFile(inputFiles[i]),
                type: inputFiles[i].type,
                size: inputFiles[i].size,
                lastModified: inputFiles[i].lastModified,
                lastModifiedDate: inputFiles[i].lastModifiedDate,
                webkitRelativePath: inputFiles[i].webkitRelativePath
              })
              const formData = new FormData()
              formData.append(props.fileName, inputFiles[i])
              formDatas.value.push(formData)
            }
          } else {
            onReset()
            files.value.push({
              name: inputFiles[i].name,
              url: await getBase64InputFile(inputFiles[i]),
              type: inputFiles[i].type,
              size: inputFiles[i].size,
              lastModified: inputFiles[i].lastModified,
              lastModifiedDate: inputFiles[i].lastModifiedDate,
              webkitRelativePath: inputFiles[i].webkitRelativePath
            })
            const formData = new FormData()
            formData.append(props.fileName, inputFiles[i])
            formDatas.value.push(formData)
          }
        }
        emit('on-change', inputFiles)
      },
      onDelete(val) {
        // if (val !== undefined) selected.value = [files.value[val]]
        $q.dialog({
          title: props.lblConfirmTitle,
          message: props.lblConfirmDelete,
          cancel: true,
          ok: { label: props.lblOk, flat: true, color: 'primary', noCaps: true },
          cancel: { label: props.lblCancel, flat: true, color: 'blue-grey', noCaps: true }
        }).onOk(() => {
          if (val !== undefined) files.value.splice(val, 1)
          else {
            if (props.multiple) {
              selected.value.forEach(e => {
                const i = files.value.findIndex(x => x.url === e.url)
                if (i > -1) files.value.splice(i, 1)
              })
              emit('on-delete', selected.value)
            } else {
              files.value = []
              emit('on-delete', selected.value)
            }
            selected.value = []
          }
        }).onCancel(() => { selected.value = [] })
      },
      onSelectItem(val) {
        // console.log(val)
        const i = selected.value.indexOf(val)
        if (props.multiple) {
          if (i < 0) {
            selected.value.push(val)
          } else {
            selected.value.splice(i, 1)
          }
        } else {
          if (i < 0) {
            selected.value = [val]
          } else {
            selected.value = []
          }
        }
      },
      onChangeView() {
        viewTypeLocal.value = viewTypeLocal.value === 'box' ? 'list' : 'box'
        emit('update:viewType', viewTypeLocal.value)
        emit('on-change-view', viewTypeLocal.value)
        // const vt = props.viewType === 'box' ? 'list' : 'box'
        // emit('update:viewType', vt)
        // emit('on-change-view', vt)
      },
      async onUpload() {
        isLoading.value = true
        const headers = { 'Content-Type': 'multipart/form-data', 'Access-Control-Allow-Origin': '*' }
        props.headers.forEach(e => { headers[e.name] = e.value })
        let i = 0
        const rs = []
        emit('on-uploading')
        for await (const e of formDatas.value) {
          i = i + 1
          await axios.post(props.uploadUrl, e, { headers }).then(x => {
            rs.push(x.data)
          }).catch(e => {
            // console.log(e)
          }).finally(() => {
            progress.value = calProgress(i, formDatas.value.length)
          })
        }
        onReset()
        emit('on-finish', props.multiple ? rs : (rs && rs.length ? rs[0] : null))
      }
      //   async onUpload2() {
      //     isLoading.value = true
      //     const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
      //     props.headers.forEach(e => { headers[e.name] = e.value })
      //     let i = 0
      //     const rs = []
      //     emit('on-uploading')
      //     for await (const e of formDatas.value) {
      //       i = i + 1
      //       await axios.post(props.uploadUrl, e, { headers }).then(x => {
      //         rs.push(x.data)
      //       }).catch(e => {
      //         // console.log(e)
      //       }).finally(() => {
      //         progress.value = calProgress(i, formDatas.value.length)
      //       })
      //     }
      //     onReset()
      //     emit('on-finish', props.multiple ? rs : (rs && rs.length ? rs[0] : null))
      //   }
    }
  }
})
</script>
<style lang="scss" scoped>
.mobile {
  .layout-size {
    width: 100vw;
    min-width: initial;
    height: 100vh;
    .views {
      height: 100vh;
    }
  }
}
@media (min-width: 600px) {
  .layout-size {
    min-width: 560px !important;
  }
}
.layout-size {
  min-width: 100vw;
  height: 600px;
  &.maximized {
    height: 100vh;
    .views {
      height: calc(100vh - 50px);
    }
  }
  .views {
    height: 550px;
  }
  .q-linear-progress {
    position: absolute;
    top: 50px;
  }
}
.view-box {
  .tm-uploader {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    padding: 1px;
    margin: 0 5px 5px 0;
    .tm-uploader__wrapper {
      display: flex;
      flex-wrap: wrap;
      .tm-uploader__upload {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: 80px;
        height: 80px;
        // margin: 0 var(--van-padding-xs) var(--van-padding-xs) 0;
        background: #f7f8fa;
        i {
          color: #dcdee0;
        }
      }
    }
  }
}
.view-list {
  .tm-uploader {
    background: #f7f8fa;
    border: 1px dashed #dcdee0;
  }
}
</style>
