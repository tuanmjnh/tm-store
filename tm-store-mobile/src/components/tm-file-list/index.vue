<template>
  <q-card flat class="q-pa-none tm-file-list">
    <q-toolbar v-if="slotToolBar">
      <slot name="tool-bar" />
    </q-toolbar>
    <q-toolbar v-else>
      <q-toolbar-title v-if="title" class="text-subtitle1">{{title}}</q-toolbar-title>
      <q-btn round dense flat :icon="viewType==='box'?'format_list_bulleted':'apps'"
             @click="onChangeView(viewType==='box'?'list':'box')">
        <q-tooltip v-if="!$q.platform.is.mobile">{{viewType==='box'?labelViewList:labelViewBox}}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <div v-if="loading" class="fullscreen">
      <div class="absolute-full flex flex-center">
        <q-spinner color="primary" size="6em" :thickness="1" />
      </div>
    </div>
    <q-card-section v-if="viewType!=='list'" :class="`views view-box ${classView} ${center?'text-center':''}`">
      <view-box v-model="rows" :is-delete="isDelete" :size="size" :font-size="fontSize" :selected="selected" :is-tooltip="isTooltip"
                :thumbnailView="thumbnailView" :thumbnailSize="thumbnailSize" :lblSelect="lblSelect" :lblView="lblView" :lblDelete="lblDelete"
                :lblRecycling="lblRecycling" :lblDeleteForever="lblDeleteForever" @on-delete="onDelete" @on-select="onSelectItem" />
    </q-card-section>
    <q-card-section v-else class="views view-list">
      <view-list v-model="rows" :selected="selected" :is-delete="isDelete" :font-size="fontSize" :classView="classView" :thumbnailView="thumbnailView"
                 :lblSelect="lblSelect" :lblView="lblView" :lblDelete="lblDelete" :lblRecycling="lblRecycling"
                 :lblDeleteForever="lblDeleteForever" @on-delete="onDelete" />
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import * as extension from 'utils/extension'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'TMFileList',
  components: {
    viewList: defineAsyncComponent(() => import('./view-list.vue')),
    viewBox: defineAsyncComponent(() => import('./view-box.vue'))
  },
  props: {
    modelValue: { default: null },
    selected: { default: null },
    title: { type: String, default: '' },
    multiple: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    generateImage: { type: Boolean, default: false },
    thumbnailView: { type: Boolean, default: false },
    thumbnailSize: { type: String, default: 'w128' },
    size: { type: String, default: '80px' },
    isDelete: { type: Boolean, default: true },
    isTooltip: { type: Boolean, default: false },
    fontSize: { type: String, default: '40px' },
    viewType: { type: String, default: 'box' },
    lblSelect: { type: String, default: 'Select' },
    lblView: { type: String, default: 'View' },
    lblDelete: { type: String, default: 'Delete' },
    lblRecycling: { type: String, default: 'Recycling' },
    lblDeleteForever: { type: String, default: 'Delete forever' },
    labelViewList: { type: String, default: 'View list' },
    labelViewBox: { type: String, default: 'View box' },
    lblOk: { type: String, default: 'Ok' },
    lblCancel: { type: String, default: 'Cancel' },
    lblConfirmTitle: { type: String, default: 'Confirm' },
    lblConfirmDelete: { type: String, default: 'Are you sure you want to delete this record?' },
    center: { type: Boolean, default: false },
    classView: { type: String, default: '' }
  },
  setup(props, { emit, slots }) {
    const $q = useQuasar()
    const Extension = extension
    const slotToolBar = computed(() => !!slots['tool-bar'])
    const refViewBox = ref(null)
    const refViewList = ref(null)
    const onGenerateImages = (images) => {
      if (images && images.length) {
        const _images = JSON.parse(JSON.stringify(images))
        if (Array.isArray(_images)) {
          const rs = []
          _images.forEach(e => {
            const type = Extension.getExtension(e)
            rs.push({
              name: Extension.getNameFilePath(e),
              url: e,
              type: type,
              size: 0,
              extension: type
            })
          })
          return rs
        } else {
          const rs = []
          const type = Extension.getExtension(images)
          rs.push({
            name: Extension.getNameFilePath(images),
            url: images,
            type: type,
            size: 0,
            extension: type
          })
          return rs
        }
      } else return null
    }
    const rows = computed(() => {
      if (props.generateImage) {
        return onGenerateImages(props.modelValue)
      } else {
        return props.modelValue ? Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue] : []
      }
    })
    return {
      Extension, slotToolBar, rows, refViewBox, refViewList,
      onSelectItem: (val) => {
        let selected = props.selected ? props.selected.slice() : []
        const i = selected.indexOf(val)
        if (props.multiple) {
          if (i < 0) {
            selected.push(val)
            emit('on-select', val)
          } else {
            selected.splice(i, 1)
            emit('on-unselect', val)
          }
        } else {
          if (i < 0) {
            selected = [val]
            emit('on-select', val)
          } else {
            selected = []
            emit('on-unselect', val)
          }
        }
        emit('update:selected', selected)
      },
      onChangeView: (val) => {
        emit('update:viewType', val)
        // viewType.value = val
        emit('on-change-view', val)
      },
      onDelete: (val) => {
        let selected = []
        if (val !== undefined) selected = [props.modelValue[val]]
        if (val > -1) $q.dialog({
          title: props.lblConfirmTitle,
          message: props.lblConfirmDelete,
          cancel: true,
          ok: { label: props.lblOk, flat: true, color: 'primary', noCaps: true },
          cancel: { label: props.lblCancel, flat: true, color: 'blue-grey', noCaps: true }
        }).onOk(() => {
          if (props.multiple) {
            const x = props.modelValue.slice()
            selected.forEach(e => {
              const i = x.findIndex(x => x.url === e.url)
              if (i > -1) x.splice(i, 1)
            })
            // x.splice(val, 1)
            emit('update:modelValue', x)
            emit('on-delete', selected)
          } else {
            emit('update:modelValue', null)
            emit('on-delete', selected)
          }
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.tm-file-list {
  // height: calc(100vh - 99px);
  // overflow-y: auto;
  .q-toolbar {
    min-height: initial;
    padding: 5px 0;
  }
}
</style>
