<script setup lang="ts">
import * as extension from 'utils/extension'

export default defineComponent({
  name: 'TMFileListViewBox',
  props: {
    modelValue: { default: null },
    selected: { default: null },
    size: { type: String, default: '80px' },
    fontSize: { type: String, default: '40px' },
    isDelete: { type: Boolean, default: true },
    isTooltip: { type: Boolean, default: false },
    thumbnailView: { type: Boolean, default: false },
    thumbnailSize: { type: String, default: 'w128' },
    trashed: { type: Boolean, default: false },
    lblSelect: { type: String, default: 'Select' },
    lblView: { type: String, default: 'View' },
    lblDelete: { type: String, default: 'Delete' },
    lblRecycling: { type: String, default: 'Recycling' },
    lblDeleteForever: { type: String, default: 'Delete forever' }
  },
  emits: ['on-select', 'on-preview', 'on-delete', 'on-remove'],
  setup(props, { emit, slots }) {
    // Slots
    const slotFistItem = computed(() => !!slots['fistItem'])
    const slotLastItem = computed(() => !!slots['lastItem'])
    // const thumbnailSize = `=w128`//``=w${props.size.replace('px', '')}`
    const isDialogPreview = ref(false)
    const imagePreview = ref(null)
    // const files = computed(() => {
    //   const rs = JSON.parse(JSON.stringify(props.modelValue))
    //   if (props.thumbnailView)
    //     rs.forEach(e => {
    //       if (e.thumbnail) e.thumbnail = `${e.thumbnail}${thumbnailSize}`
    //     })
    //   return rs
    // })
    const Extension = extension
    // watch(() => isDialogPreview, (state, prevState) => {
    //   if(!state)
    // }, { deep: true, immediate: true })
    return {
      Extension, slotFistItem, slotLastItem, isDialogPreview, imagePreview,
      onSelectItem(val) {
        // if (val.thumbnail) val.thumbnail = val.thumbnail.replace(thumbnailSize, '')
        emit('on-select', val)
      },
      onPreview(val) {
        emit('on-preview', val)
        isDialogPreview.value = true
        imagePreview.value = val
      },
      onDelete(val) {
        emit('on-delete', val)
      },
      onRemove(val) {
        emit('on-remove', val)
      }
    }
  }
})
</script>
<template>
  <slot v-if="slotFistItem" name="fistItem" />
  <div v-for="(e,i) in modelValue" :key="i" :style="`width:${size};height:${size}`"
       :class="['item',selected&&selected.indexOf(e)>-1?'selected':'']">
    <div @click="onSelectItem(e)">
      <i v-if="e.type==='folder'" class="material-icons absolute-full flex flex-center"
         :style="`font-size:${fontSize}`">folder</i>
      <q-img referrerPolicy="no-referrer" v-else-if="Extension.isImage(e.name)" :src="thumbnailView?`${e.thumbnail}=${thumbnailSize}`:e.url"
             spinner-color="primary" :style="`height:calc(${size} - 3px)`">
        <template v-slot:error>
          <i class="material-icons"
             style="font-size:30px;color:#a5a5a5;position:absolute;top:0;right:0;bottom:0;left:0;align-items:center;justify-content:center;display:flex;flex-wrap:wrap;">photo_size_select_actual</i>
        </template>
      </q-img>
      <i v-else-if="Extension.isAudio(e.name)" class="material-icons absolute-full flex flex-center"
         :style="`font-size:${fontSize}`">audiotrack</i>
      <i v-else-if="Extension.isVideo(e.name)" class="material-icons absolute-full flex flex-center"
         :style="`font-size:${fontSize}`">video_library</i>
      <i v-else-if="Extension.isPdf(e.name)" class="material-icons absolute-full flex flex-center"
         :style="`font-size:${fontSize}`">picture_as_pdf</i>
      <i v-else-if="Extension.isFlash(e.name)" class="material-icons absolute-full flex flex-center"
         :style="`font-size:${fontSize}`">burst_mode</i>
      <i v-else-if="Extension.isCode(e.name)" class="material-icons absolute-full flex flex-center"
         :style="`font-size:${fontSize}`">code</i>
      <i v-else-if="Extension.isDoc(e.name)" class="material-icons absolute-full flex flex-center"
         :style="`font-size:${fontSize}`">description</i>
      <i v-else-if="Extension.isSheet(e.name)" class="material-icons absolute-full flex flex-center"
         :style="`font-size:${fontSize}`">list_alt</i>
      <i v-else-if="Extension.isText(e.name)" class="material-icons absolute-full flex flex-center"
         :style="`font-size:${fontSize}`">assignment</i>
      <i v-else class="material-icons absolute-full flex flex-center" :key="i" :style="`font-size:${fontSize}`">file_copy</i>
    </div>
    <!-- <i v-if="isDelete&&!trashed" class="material-icons file-delete" @click="onDelete(i)">clear</i> -->
    <!-- <i v-if="isDelete&&trashed" class="material-icons file-recover" @click="onDelete(i)">recycling</i> -->
    <!-- <q-tooltip v-if="isTooltip">{{Extension.getNameFilePath(e.name)}}</q-tooltip> -->
    <!-- <q-menu touch-position context-menu>
      <q-list dense>
        <q-item class="ellipsis">
          <q-item-section>{{Extension.getNameFilePath(e.name)}}</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup @click="onSelectItem(e)">
          <q-item-section avatar>
            <q-icon name="check_circle" color="primary" />
          </q-item-section>
          <q-item-section>{{lblSelect}}</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="onPreview(e)">
          <q-item-section avatar>
            <q-icon name="preview" color="secondary" />
          </q-item-section>
          <q-item-section>{{lblView}}</q-item-section>
        </q-item>
        <q-item v-if="isDelete&&!trashed" clickable v-close-popup @click="onDelete(i)">
          <q-item-section avatar>
            <q-icon name="delete" color="negative" />
          </q-item-section>
          <q-item-section>{{lblDelete}}</q-item-section>
        </q-item>
        <q-item v-if="isDelete&&trashed" clickable v-close-popup @click="onDelete(i)">
          <q-item-section avatar>
            <q-icon name="recycling" color="warning" />
          </q-item-section>
          <q-item-section>{{lblRecycling}}</q-item-section>
        </q-item>
        <q-item v-if="isDelete&&trashed" clickable v-close-popup @click="onRemove(i)">
          <q-item-section avatar>
            <q-icon name="delete_forever" color="negative" />
          </q-item-section>
          <q-item-section>{{lblDeleteForever}}</q-item-section>
        </q-item>
      </q-list>
    </q-menu> -->
  </div>
  <slot v-if="slotLastItem" name="lastItem" />
  <!-- <q-dialog v-model="isDialogPreview" class="dialog-preview">
    <q-card class="bg-black">
      <q-card-section class="q-pa-none">
        <div class="absolute fixed-right close">
          <q-btn flat dense icon="close" color="blue-grey" v-close-popup />
        </div>
        <q-img :src="imagePreview.url" spinner-color="primary" fit="contain" />
      </q-card-section>
    </q-card>
  </q-dialog> -->
</template>

<style lang="scss" scoped>
// .tm-file-list {
.view-box {
  .item {
    border: 1px solid #eee;
    padding: 1px;
    margin: 0 5px 5px 0;
    vertical-align: middle;
    text-align: center;
    position: relative;
    display: inline-block;
    transition: all 0.3s;
    &.selected {
      border: 1px solid #2196f3;
    }
  }
  .file-delete,
  .file-recover {
    position: absolute;
    right: 1px;
    top: 1px;
    opacity: 1;
  }
  &:hover .file-delete,
  .file-recover {
    display: initial !important;
    opacity: 1;
  }
}
.file-delete {
  cursor: pointer;
  transition: opacity 0.3s;
  background-color: #c55959;
  color: #fff;
}
.file-recover {
  cursor: pointer;
  transition: opacity 0.3s;
  background-color: #f2c037;
  color: #fff;
}
.q-item__section--avatar {
  min-width: initial;
}
.dialog-preview {
  .q-card {
    width: calc(100vw - 50px);
    max-width: 100vw;
    max-height: calc(100vh - 90px);
    position: absolute;
    top: 50px;
    .q-img {
      max-width: 100%;
      max-height: calc(100vh - 90px);
    }
  }
}
.mobile {
  .dialog-preview {
    .q-card {
      width: 100vw;
      height: 100vh;
      max-width: 100vw;
      max-height: 100vh;
      position: absolute;
      top: 0;
      .q-img {
        width: 100vw;
        height: 100vh;
      }
    }
  }
}
.close {
  z-index: 1;
}
</style>
