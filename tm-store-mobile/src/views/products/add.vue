<script setup lang="ts">
import { useAppStore, useTypeStore, useGroupStore, useProductStore } from '@/store'
import { historyBack } from '@/router'
import { $t } from '@/i18n'
import { showImagePreview } from 'vant'
import { showNotify } from 'vant'
import { MdEditor } from 'md-editor-v3'
import componentGroup from "@/views/groups/groups.vue"
const googleDrive = defineAsyncComponent(() => import('@/components/google-drive.vue'))
const tmViewList = defineAsyncComponent(() => import('@/components/tmViewList.vue'))
const componentTypes = defineAsyncComponent(() => import('./types.vue'))

const route = useRoute()
const appStore = useAppStore()
const typeStore = useTypeStore()
const groupStore = useGroupStore()
const productStore = useProductStore()
const form = computed(() => productStore.item)
const isDialogGroup = ref(false)
const isDialogUnits = ref(false)
const isDialogTypes = ref(false)
const isDialogDrive = ref(false)
const typeView = ref(0)
const units = ref(typeStore.all.filter(x => x.flag == 1 && x.key == 'unit').sort((a, b) => a.order - b.order))
const unit = ref(null)
const groups = ref([])
const flag = ref(false)
const imagesSelected = ref([])
const activeTab = ref('basicInf')

const initForm = async () => {
  if (route.params.id && !form.value._id) await productStore.getItem(route.params)
  groups.value = groupStore.all.filter(x => form.value.groups.includes(x._id)).sort((a, b) => a.level - b.level)
  flag.value = form.value.flag ? true : false
  unit.value = units.value.find(x => x.code === form.value.unit)
  console.log(form.value)
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
const onSelectImages = (val) => {
  // console.log(val)
  isDialogDrive.value = true
}
const onDeleteIamge = (img) => {
  // console.log(img)
  // console.log(imagesSelected.value)
}
const onSelectDriveImage = (arg) => {
  console.log(arg)
  isDialogDrive.value = false
  form.value.images.push(arg)
}
const onEditType = (arg) => {
  isDialogTypes.value = true
  typeView.value = arg
}
const onSubmit = async () => {
  try {
    if (form.value._id) {
      form.value.flag = flag.value ? 1 : 0
      console.log(form.value)
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
    console.log(error)
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
          <van-field v-model="form.code" name="code" :label="$t('global.code')" disabled
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="groups.length" name="groups" :label="$t('group.title')" readonly is-link
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]"
            @click="isDialogGroup = true">
            <template #input>
              {{ groups && groups.length ? groups.map(x => x.title).join(', ') : 'Root' }}
            </template>
          </van-field>
          <van-field v-model="form.title" name="title" :label="$t('global.title')"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.unit" name="unit" :label="$t('global.unit')" is-link
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]"
            @click="isDialogUnits = true">
            <template #input>
              {{ unit ? unit.name : $t('global.updating') }}
            </template>
          </van-field>
          <van-field name="unit" :label="$t('product.type')" is-link :placeholder="$t('global.inputPlaceholder')"
            @click="onEditType(0)">
            <template #input>
              {{ form.types && form.types.length ? form.types.map(x => x.label).join(', ') : $t('global.updating') }}
              <!-- {{ form.types.length ? form.types.map(x => x.label).join(', ') : $t('global.updating') }} -->
            </template>
          </van-field>
          <van-field name="unit" :label="$t('product.price')" is-link :placeholder="$t('global.inputPlaceholder')"
            @click="onEditType(1)">
            <template #input>
              {{
                form.typeData ? productStore.getValueTypeDataMinMax(form, 'price', ' - ', true) : $t('global.updating')
              }}
            </template>
          </van-field>
          <van-field name="unit" :label="$t('product.quantity')" is-link :placeholder="$t('global.inputPlaceholder')"
            @click="onEditType(1)">
            <template #input>
              {{
                form.typeData ? productStore.getValueTypeDataMinMax(form, 'quantity', ' - ', true) : $t('global.updating')
              }}
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
          <van-field name="flag" :label="$t('global.status')">
            <template #input>
              <van-switch v-model="flag" />
            </template>
          </van-field>
          <van-field v-model="form.desc" type="textarea" rows="1" autosize name="note" :label="$t('global.note')"
            :placeholder="$t('global.inputPlaceholder')" />
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
      <van-tab :title="$t('tabs.mediaInf')" name="mediaInf">
        <div class="flex justify-end">
          <div class="pr-3" @click="isDialogDrive = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 48 48">
              <g fill="none" stroke="currentColor" stroke-width="4">
                <path stroke-linejoin="round"
                  d="M5 8a2 2 0 0 1 2-2h12l5 6h17a2 2 0 0 1 2 2v26a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
                <path stroke-linecap="round" d="M18 27h12m-6-6v12" />
              </g>
            </svg>
          </div>
          <div class="pr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 48 48">
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                <rect width="38" height="38" x="5" y="5" rx="2" />
                <path d="M24 5v38M5 24h38" />
              </g>
            </svg>
          </div>
          <div class="pr-3">
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
          <tm-view-box v-model="form.images" border="" v-model:selected="imagesSelected" is-preview multiple is-delete
            is-trashed />
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
      :lbl-submit="$t('global.confirm')" :lbl-cancel="$t('global.back')" is-bot @on-submit="onSelectGroup"
      @on-cancel="isDialogGroup = false" />
  </van-dialog>
  <van-dialog v-model:show="isDialogUnits" :title="$t('global.unit')" close-on-click-overlay
    :show-confirm-button="false" :show-cancel-button="false">
    <div class="overscroll-none overflow-auto h-96">
      <van-cell v-for="(e, i) in units" :title="e.name" :value="e.code" is-link @click="onChangeUnit(e)" />
    </div>
  </van-dialog>
  <van-dialog v-model:show="isDialogDrive" title="Drive" class="full-screen" :show-cancel-button="false"
    :show-confirm-button="false" close-on-click-action>
    <template #title>
    </template>
    <google-drive @on-close="isDialogDrive = false" multiple @on-select="onSelectDriveImage" />
  </van-dialog>
  <van-dialog v-model:show="isDialogTypes" :title="$t('global.unit')" class="full-screen footer" close-on-click-overlay
    :show-confirm-button="false" :show-cancel-button="false">
    <template #title></template>
    <component-types :types="form.types" :typeData="form.typeData" v-model:typeView="typeView"
      @on-close="isDialogTypes = false" @on-update="isDialogTypes = false" />
    <template #footer></template>
  </van-dialog>
</template>
