<template>
  <slot v-if="slotFistItem" name="fistItem" />
  <q-list separator :class="classView">
    <q-item v-for="(e,i) in modelValue" :key="i" :class="['cursor-pointer',selected&&selected.indexOf(e)>-1?'selected':'']" clickable v-ripple
            @click="onSelectItem(e)">
      <!-- <q-item-section avatar>
        <input class="cursor-pointer" type="checkbox" :checked="selected&&selected.indexOf(e)>-1?true:false" @click="onSelectItem($event,e)">
      </q-item-section> -->
      <q-item-section avatar>
        <q-img :src="thumbnailView?`${e.thumbnail}=${thumbnailSize}`:e.url" spinner-color="primary" fit="cover" v-if="Extension.isImage(e.name)">
          <template v-slot:error>
            <i class="content material-icons"
               style="font-size:23px;position:absolute;top:0;left:0;color:#908f8f">photo_size_select_actual</i>
          </template>
        </q-img>
        <i v-else-if="Extension.isAudio(e.name)" class="content material-icons"
           :style="`font-size:${fontSize}`">audiotrack</i>
        <i v-else-if="Extension.isVideo(e.name)" class="content material-icons"
           :style="`font-size:${fontSize}`">video_library</i>
        <i v-else-if="Extension.isPdf(e.name)" class="content material-icons"
           :style="`font-size:${fontSize}`">picture_as_pdf</i>
        <i v-else-if="Extension.isFlash(e.name)" class="content material-icons"
           :style="`font-size:${fontSize}`">burst_mode</i>
        <i v-else-if="Extension.isCode(e.name)" class="content material-icons" :style="`font-size:${fontSize}`">code</i>
        <i v-else-if="Extension.isDoc(e.name)" class="content material-icons"
           :style="`font-size:${fontSize}`">description</i>
        <i v-else-if="Extension.isSheet(e.name)" class="content material-icons"
           :style="`font-size:${fontSize}`">list_alt</i>
        <i v-else-if="Extension.isText(e.name)" class="content material-icons"
           :style="`font-size:${fontSize}`">assignment</i>
        <i v-else class="content material-icons" :key="i" :style="`font-size:${fontSize}`">file_copy</i>
        <!-- <q-icon color="primary" name="e.icon" /> -->
      </q-item-section>
      <q-item-section>
        <q-item-label class="ellipsis item-name">{{e.name}}</q-item-label>
        <q-item-label caption lines="1">{{e.type}}</q-item-label>
        <q-item-label caption lines="1">{{parseInt(e.size).formatFileSize()}}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <i v-if="isDelete&&!trashed" class="material-icons file-delete" @click="onDelete(i)">clear</i>
        <i v-if="isDelete&&trashed" class="material-icons file-recover" @click="onDelete(i)">recycling</i>
      </q-item-section>
      <q-menu touch-position context-menu>
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
      </q-menu>
    </q-item>
    <q-item>
      <slot v-if="slotLastItem" name="lastItem" />
    </q-item>
  </q-list>
  <q-dialog v-model="isDialogPreview" class="dialog-preview">
    <q-card class="bg-black">
      <q-card-section class="q-pa-none">
        <div class="absolute fixed-right close">
          <q-btn flat dense icon="close" color="blue-grey" v-close-popup />
        </div>
        <q-img :src="imagePreview.url" spinner-color="primary" fit="contain" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
import * as extension from 'utils/extension'

export default defineComponent({
  name: 'TMFileListViewList',
  props: {
    modelValue: { default: null },
    selected: { default: null },
    isDelete: { type: Boolean, default: true },
    fontSize: { type: String, default: '40px' },
    classView: { type: String, default: '' },
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
    // const thumbnailSize = '=w128'//`=w${props.fontSize.replace('px', '')}`
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
    return {
      Extension, slotFistItem, slotLastItem, isDialogPreview, imagePreview,
      onSelectItem(val) {
        // console.log(evt.target.checked, val)
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
<style lang="scss" scoped>
.file-delete,
.file-recover {
  cursor: pointer;
  transition: opacity 0.3s;
  color: #fff;
}
.file-delete {
  background-color: #c55959;
}
.file-recover {
  background-color: #f2c037;
}
.q-list {
  overflow: auto;
  .q-item {
    &.selected {
      // border: 1px solid #2196f3;
      .item-name {
        color: #2196f3;
      }
    }
  }
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
