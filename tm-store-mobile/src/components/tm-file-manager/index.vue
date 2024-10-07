<template>
  <q-layout container :class="['layout-size',`${maximized?'maximized':''}`]">
    <q-header>
      <q-toolbar>
        <q-toolbar-title>
          <slot name="headerLeft" v-if="slotHeaderLeft" />
          <span class="text-subtitle1">{{title}}</span>
        </q-toolbar-title>
        <q-btn v-if="selected.length&&!params.trashed" flat :icon="iconAccept" :no-caps="noCaps" :disable="isLoading" @click="onAccept">
          <q-tooltip>{{lblAccept}}</q-tooltip>
        </q-btn>
        <q-btn v-if="isDelete&&selected.length&&!params.trashed" flat :icon="iconTrash" color="red-10" :no-caps="noCaps" :disable="isLoading"
               @click="onTrash()">
          <q-tooltip>{{lblDelete}}</q-tooltip>
        </q-btn>
        <q-btn v-if="isDelete&&selected.length&&params.trashed" flat :icon="iconRecycling" :no-caps="noCaps" :disable="isLoading" @click="onTrash()">
          <q-tooltip>{{lblRecycling}}</q-tooltip>
        </q-btn>
        <q-btn v-if="isDelete&&selected.length&&params.trashed" flat :icon="iconRemove" :no-caps="noCaps" :disable="isLoading"
               @click="onRemove()">
          <q-tooltip>{{lblDelete}}</q-tooltip>
        </q-btn>
        <q-btn round dense flat icon="menu" :disable="isLoading" @click="drawer=!drawer">
          <q-tooltip>Menu</q-tooltip>
        </q-btn>
        <q-btn dense flat :icon="viewType==='box'?'format_list_bulleted':'apps'" :disable="isLoading" @click="onChangeView()">
          <q-tooltip>{{viewType==='box'?labelViewList:labelViewBox}}</q-tooltip>
        </q-btn>
        <q-btn v-if="params.trashed" round dense flat icon="delete_forever" :disable="isLoading" @click="onEmptyTrash()">
          <q-tooltip>{{lblEmpty}}</q-tooltip>
        </q-btn>
        <q-btn v-if="isDelete&&params.trashed" round dense flat icon="cloud_circle" :disable="isLoading" @click="onViewTrash(false)">
          <q-tooltip>{{lblDrive}}</q-tooltip>
        </q-btn>
        <q-btn v-if="isDelete&&!params.trashed" round dense flat icon="delete" :disable="isLoading" @click="onViewTrash(true)">
          <q-tooltip>{{lblTrash}}</q-tooltip>
        </q-btn>
        <slot name="headerRight" v-if="slotHeaderRight" />
      </q-toolbar>
    </q-header>
    <q-linear-progress v-if="isLoading" indeterminate color="secondary" />
    <q-drawer v-model="drawer" elevated :overlay="!maximized" :width="300" :breakpoint="500" class="q-pt-md q-pl-md">
      <!-- <q-scroll-area class="fit"> -->
      <q-tree :nodes="folders" v-model:selected="selectedFolder" default-expand-all node-key="id" label-key="name" :no-nodes-label="lblNoData">
        <template v-slot:default-header="prop">
          <div :class="`row items-center ${currentFolder.id===prop.node.id?'text-blue':''}`" @click="onOpenFolder(prop.node)">
            <div>{{prop.node.name}}</div>
          </div>
        </template>
      </q-tree>
      <!-- </q-scroll-area> -->
    </q-drawer>
    <q-page-container>
      <q-page>
        <!-- <q-card-section>
          <q-btn round dense flat icon="menu" @click="onDeletes">
            <q-tooltip>delete</q-tooltip>
          </q-btn>
        </q-card-section> -->
        <q-card-section v-if="viewType!=='list'" :class="`views view-box scroll ${center?'text-center':''} q-pl-md q-pt-md q-pr-none q-pb-none`">
          <q-infinite-scroll ref="refScrollTarget" @load="onScrollLoad" :offset="250">
            <view-box v-model="files" v-model:selected="selected" :is-delete="isDelete" :thumbnailView="thumbnailView" :size="size"
                      :lblSelect="lblSelect" :lblView="lblView" :lblDelete="lblDelete" :lblRecycling="lblRecycling"
                      :lblDeleteForever="lblDeleteForever" :trashed="params.trashed" @on-select="onSelectItem" @on-delete="onTrash"
                      @on-remove="onRemove" />
            <template v-if="!scrollEnd" v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </q-card-section>
        <q-card-section v-else class="views view-list q-pl-md q-pt-md q-pr-none q-pb-none">
          <q-infinite-scroll ref="refScrollTarget" @load="onScrollLoad" :offset="250">
            <view-list v-model="files" :is-delete="isDelete" v-model:selected="selected" :thumbnailView="thumbnailView" :trashed="params.trashed"
                       :lblSelect="lblSelect" :lblView="lblView" :lblDelete="lblDelete" :lblRecycling="lblRecycling"
                       :lblDeleteForever="lblDeleteForever" @on-select="onSelectItem" @on-delete="onTrash" @on-remove="onRemove" />
            <template v-if="!scrollEnd" v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </q-card-section>
        <div v-if="isLoading" class="fullscreen">
          <div class="absolute-full flex flex-center">
            <q-spinner color="primary" size="6em" :thickness="1" />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed, watch, onBeforeMount, onMounted } from "vue"
import axios from 'axios'
import { useQuasar } from 'quasar'
export default defineComponent({
  name: "TMFileManager",
  components: {
    viewList: defineAsyncComponent(() => import('components/tm-file-list/view-list.vue')),
    viewBox: defineAsyncComponent(() => import('components/tm-file-list/view-box.vue'))
  },
  props: {
    accept: { type: String, default: '*' },
    mimeType: { type: String, default: null },
    url: { type: String, required: true },
    headers: { type: Array, default: () => [] },
    multiple: { type: Boolean, default: false },
    // path: { type: String, default: null },
    isDelete: { type: Boolean, default: true },
    center: { type: Boolean, default: false },
    maximized: { type: Boolean, default: false },
    mobile: { type: Boolean, default: false },
    title: { type: String, default: 'File Manager' },
    size: { type: String, default: '100px' },
    thumbnailView: { type: Boolean, default: true },
    lblTrash: { type: String, default: 'Trash' },
    lblDrive: { type: String, default: 'Drive' },
    lblEmpty: { type: String, default: 'Empty trash' },
    lblSelect: { type: String, default: 'Select' },
    lblView: { type: String, default: 'View' },
    lblDelete: { type: String, default: 'Delete' },
    lblRecycling: { type: String, default: 'Recycling' },
    lblDeleteForever: { type: String, default: 'Delete forever' },
    lblAccept: { type: String, default: 'Accept' },
    iconAccept: { type: String, default: 'file_download_done' },
    iconTrash: { type: String, default: 'delete_sweep' },
    iconRemove: { type: String, default: 'remove_circle' },
    iconRecycling: { type: String, default: 'recycling' },
    noCaps: { type: Boolean, default: true },
    lblNoData: { type: String, default: 'No nodes to show!' },
    labelViewList: { type: String, default: 'View list' },
    labelViewBox: { type: String, default: 'View box' },
    lblOk: { type: String, default: 'Ok' },
    lblCancel: { type: String, default: 'Cancel' },
    lblConfirmTitle: { type: String, default: 'Confirm' },
    lblConfirmDelete: { type: String, default: 'Are you sure you want to delete this record?' },
    lblConfirmRecycling: { type: String, default: 'Are you sure you want to delete this record?' },
    lblConfirmEmpty: { type: String, default: 'Are you sure you want to empty trash?' }
  },
  // emits: ['onAccept'],
  setup(props, { emit, slots }) {
    const $q = useQuasar()
    const isLoading = ref(false)
    const isLoaded = ref(false)
    // Slots
    const slotHeaderLeft = computed(() => !!slots['headerLeft'])
    const slotHeaderRight = computed(() => !!slots['headerRight'])
    const files = ref([])
    const folders = ref([])
    const selected = ref([])
    const refScrollTarget = ref(null)
    const viewType = ref('box')
    const drawer = ref(false)
    const selectedFolder = ref(null)
    const currentFolder = ref(null)
    const scrollEnd = ref(false)
    const params = ref({
      trashed: false,
      page: 1,
      pageSize: 20,
      nextPageToken: null
    })
    const headersLocal = {
      // 'Content-Type': 'multipart/form-data',
      'Content-Type': 'application/json; charset=utf-8',
      'Accept-Type': props.accept,
      'mime-type': props.mimeType
    }
    const findNode = (nodes, nodeId, nodeKey = 'id') => {
      try {
        for (const e of nodes) {
          if (!nodeId) {
            if (e[nodeKey] === nodeId) return e
          } else {
            if (e[nodeKey] === nodeId) return e
          }
          if (e.children && e.children.length) {
            const child = findNode(e.children, nodeId, nodeKey)
            if (child) return child
          }
        }
      } catch (e) {
        return null
      }
    }
    const onLoadData = (folderId, scroll) => {
      isLoading.value = true
      if (folderId) headersLocal['folder-id'] = folderId
      return axios.get(props.url, { headers: headersLocal, params: params.value }).then(x => {
        if (folderId) {
          const node = findNode(folders.value, folderId, 'id')
          node.children = x.data.folders || []
        } else {
          folders.value = x.data.folders || []
          if (folders.value.length) currentFolder.value = folders.value[0]
        }
        files.value = x.data.files
        // files.value.forEach(e => {
        //   if (e.thumbnail) e.thumbnail = `${e.thumbnail}=w${props.size.replace('px', '')}`
        // })
        params.value.nextPageToken = x.data.nextPageToken || null
        if (scroll) params.value.page = page
        else {
          if (refScrollTarget.value) {
            // document.getElementById('panel-right-scroll').scroll(0, 0)
            refScrollTarget.value.reset()
          }
          params.value.page = 1
        }
      }).catch(e => {
        // console.log(e)
        alert(e)
      }).finally(() => {
        isLoading.value = false
        isLoaded.value = true
      })
    }
    const onLoadFile = (folderId, page, scroll) => {
      isLoading.value = true
      if (folderId) headersLocal['folder-id'] = folderId
      return axios.get(`${props.url}/files`, { headers: headersLocal, params: params.value }).then(x => {
        params.value.nextPageToken = x.data.nextPageToken || null
        if (scroll) {
          files.value = files.value.concat(x.data.files)
          params.value.page = page
        } else {
          files.value = x.data.files
        }
      }).catch(e => {
        // console.log(e)
      }).finally(() => {
        isLoading.value = false
        return true
      })
    }
    onBeforeMount(() => {
      props.headers.forEach(e => { headersLocal[e.name] = e.value })
    })
    onMounted(() => {
      onLoadData()
    })
    watch(() => props.maximized, (state, prevState) => {
      if (!props.mobile)
        if (state) drawer.value = true
        else drawer.value = false
    }, { deep: true, immediate: true })
    return {
      isLoading, folders, files, slotHeaderLeft, slotHeaderRight, selected, refScrollTarget, viewType, drawer, params,
      currentFolder, selectedFolder, scrollEnd,
      onAccept() {
        // console.log(selected.value)
        emit('onAccept', props.multiple ? selected.value : (selected.value && selected.value.length ? selected.value[0] : null))
      },
      onSelect(val) {
        if (val.type === 'folder') {
          // console.log(val)
        }
      },
      onViewTrash(trashed) {
        params.value.trashed = trashed
        onLoadFile(currentFolder.value.id, params.value.page, false)
      },
      onTrash(val) {
        // if (val < 0) return
        if (val !== undefined) selected.value = [files.value[val]]
        $q.dialog({
          title: props.lblConfirmTitle,
          message: params.value.trashed ? props.lblConfirmRecycling : props.lblConfirmDelete,
          cancel: true,
          ok: { label: props.lblOk, flat: true, color: 'primary', noCaps: true },
          cancel: { label: props.lblCancel, flat: true, color: 'blue-grey', noCaps: true }
        }).onOk(() => {
          isLoading.value = true
          return axios.patch(props.url, { data: selected.value.map(x => x.id), trashed: !params.value.trashed }, { headers: headersLocal }).then(x => {
            if (x) selected.value.forEach(e => {
              const i = files.value.findIndex(x => x.id === e.id)
              if (i > -1) files.value.splice(i, 1)
            })
            //files.value.splice(val, 1)
          }).finally(() => {
            selected.value = []
            isLoading.value = false
            return true
          })
        }).onCancel(() => { selected.value = [] })
      },
      onRemove(val) {
        if (val !== undefined) selected.value = [files.value[val]]
        $q.dialog({
          title: props.lblConfirmTitle,
          message: props.lblConfirmDelete,
          cancel: true,
          ok: { label: props.lblOk, flat: true, color: 'primary', noCaps: true },
          cancel: { label: props.lblCancel, flat: true, color: 'blue-grey', noCaps: true }
        }).onOk(() => {
          isLoading.value = true
          return axios.delete(props.url, { headers: headersLocal, data: selected.value.map(x => x.id) }).then(x => {
            if (x) selected.value.forEach(e => {
              const i = files.value.findIndex(x => x.id === e.id)
              if (i > -1) files.value.splice(i, 1)
            })
            //files.value.splice(val, 1)
          }).finally(() => {
            selected.value = []
            isLoading.value = false
            return true
          })
        }).onCancel(() => { selected.value = [] })
      },
      onEmptyTrash() {
        $q.dialog({
          title: props.lblConfirmTitle,
          message: props.lblConfirmEmpty,
          cancel: true,
          ok: { label: props.lblOk, flat: true, color: 'primary', noCaps: true },
          cancel: { label: props.lblCancel, flat: true, color: 'blue-grey', noCaps: true }
        }).onOk(() => {
          isLoading.value = true
          return axios.delete(`${props.url}/empty-trash`, { headers: headersLocal }).then(x => {
            files.value = []
          }).finally(() => {
            isLoading.value = false
            return true
          })
        })
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
        viewType.value = viewType.value === 'box' ? 'list' : 'box'
        emit('update:viewType', viewType.value)
        emit('on-change-view', viewType.value)
      },
      onOpenFolder(val) {
        if (val.id === currentFolder.value.id) {
        } else {
          currentFolder.value = val
          params.value.page = 1
          params.value.nextPageToken = null
          onLoadData(currentFolder.value.id).then(() => {
            if (props.mobile) drawer.value = !drawer.value
            else if (!props.maximized) drawer.value = !drawer.value
          })
        }
      },
      onScrollLoad(index, done) {
        if (!params.value.nextPageToken) {
          scrollEnd.value = true
          return
        }
        if (isLoaded.value) {
          params.value.page = index + 1
          onLoadFile(currentFolder.value.id, index, true).finally(x => {
            done()
          })
        } else {
          done()
        }
      },
      onTest(val) {
        return axios.get(`${props.url}/test`, { headers: headersLocal }).then(x => {
          // console.log(x)
        }).catch(e => {
          // console.log(e)
        }).finally(() => {
          isLoading.value = false
          return true
        })
        // if (val > -1) $q.dialog({
        // $q.dialog({
        //   title: props.lblConfirmTitle,
        //   message: props.lblConfirmContent,
        //   cancel: true,
        //   ok: { label: props.lblOk, flat: true, color: 'primary', noCaps: true },
        //   cancel: { label: props.lblCancel, flat: true, color: 'blue-grey', noCaps: true }
        // }).onOk(() => {
        //   return axios.delete(props.url, { headers: headersLocal }).then(x => {
        //     console.log(x)
        //   }).catch(e => {
        //     // console.log(e)
        //   }).finally(() => {
        //     isLoading.value = false
        //     return true
        //   })
        // })
      }
    }
  }
})
</script>
<style lang="scss" scoped>
// .tm-file-list {
//   top: 50px;
// }
.mobile {
  .layout-size {
    width: 100vw;
    min-width: initial;
    height: 100vh;
    // .q-layout {
    //   height: 100vh;
    // }
    // .tm-file-list {
    // height: 100vh;
    .views {
      height: 100vh;
    }
    // }
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
    .q-layout {
      // height: 100vh;
      .views {
        height: calc(100vh - 50px);
      }
    }
  }
  // .q-layout {
  // overflow: hidden;
  // height: 600px;
  // }
  // .tm-file-list {
  // height: 550px;
  .views {
    height: 550px;
    // .q-list {
    //   overflow-y: auto;
    //   height: 550px;
    // }
  }
  .view-list {
    overflow: auto;
    .q-list {
      // overflow-y: auto;
      height: 550px;
    }
  }
  .q-linear-progress {
    position: absolute;
    top: 50px;
  }

  // }
}
</style>
