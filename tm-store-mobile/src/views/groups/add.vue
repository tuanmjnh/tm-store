<script setup lang="ts">
import componentGroup from "@/views/groups/groups.vue"
import { showNotify } from 'vant'
import { useGroupStore, useAppStore } from '@/store'
import { historyBack } from '@/router'
import { $t } from '@/i18n'
import { MdEditor } from 'md-editor-v3'

const emit = defineEmits<{
  (e: 'onClose', value: any): any,
}>()
const props = defineProps<{
  isDialog?: boolean
}>()

const $route = useRoute()
const appStore = useAppStore()
const groupStore = useGroupStore()
const form = computed(() => groupStore.item)
const isDialogGroup = ref(false)
const groupParent = ref(groupStore.root)

watch(() => form.value.parent, n => {
  if (form.value.parent) groupParent.value = groupStore.all.find(x => x._id == form.value.parent)
  else groupParent.value = { ...{}, ...groupStore.root }
}, { immediate: true,deep:true })

const onSelectParent = async (arg) => {
  try {
    isDialogGroup.value = false
    groupParent.value = arg
  } catch (error) {
    if (error.data && error.data.message) showNotify({ type: 'danger', message: $t(`error.${error.data.message}`) })
    else showNotify({ type: 'danger', message: $t(`http.${error.status}`) })
  }
}
const onBack = () => {
  if (props.isDialog) emit('onClose', true)
  else historyBack()
}
const onSubmit = async () => {
  try {
    form.value.parent = groupParent.value._id
    form.value.type = $route.meta.module
    if (form.value._id) {
      const rs = await groupStore.update(form.value)
      if (rs.data) showNotify({ type: 'success', message: $t('success.update') })
    } else {
      const rs = await groupStore.create(form.value)
      if (rs.data) {
        showNotify({ type: 'primary', message: $t('success.create') })
        groupStore.setItem()
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
    <van-cell-group inset>
      <van-field v-model="groupParent.title" name="parent" :label="$t('group.parent')" readonly right-icon="arrow"
        :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]"
        @click="isDialogGroup = true">
        <template #input>
          {{ groupParent ? groupParent.title : 'Root' }}
        </template>
      </van-field>
      <van-field v-model="form.code" name="code" :label="$t('global.code')" :placeholder="$t('global.inputPlaceholder')"
        :rules="[{ required: true, message: $t('error.required') }]" />
      <van-field v-model="form.title" name="title" :label="$t('global.name')"
        :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
      <van-field v-model="form.level" name="level" :label="$t('global.level')" type="number"
        :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
      <van-field v-model="form.order" name="order" :label="$t('global.order')" type="number"
        :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
      <van-field v-model="form.icon" name="icon" :label="$t('global.icon')" :placeholder="$t('global.inputPlaceholder')" />
      <van-field v-model="form.url" name="url" :label="$t('files.url')" :placeholder="$t('global.inputPlaceholder')" />
      <van-field v-model="form.content" name="content" :label="$t('global.content')"
        :placeholder="$t('global.inputPlaceholder')">
        <template #input>
          <MdEditor v-model="form.content" :preview="false" :theme="appStore.darkMode ? 'dark' : 'light'" />
        </template>
      </van-field>
      <van-field v-model="form.desc" type="textarea" rows="1" autosize name="desc" :label="$t('global.desc')"
        :placeholder="$t('global.inputPlaceholder')" />
    </van-cell-group>
    <!-- <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit">
        Submit
      </van-button>
    </div> -->

    <van-dialog v-model:show="isDialogGroup"
      :title="$route.meta.module == 'product' ? $t('group.titleproduct') : $t('group.titlenews')" show-cancel-button
      :cancel-button-text="$t('global.back')" :placeholder="$t('global.inputPlaceholder')" :show-confirm-button="false">
      <componentGroup :flag="1" text="" :type="$route.meta.module" @on-select="onSelectParent" />
    </van-dialog>
    <van-action-bar placeholder>
      <van-action-bar-icon icon="arrow-left" @click="onBack" />
      <van-action-bar-icon />
      <!-- <van-action-bar-button type="success" text="Copy" /> -->
      <van-action-bar-button v-if="form._id" type="success" native-type="submit" :text="$t('global.update')" />
      <van-action-bar-button v-else type="primary" native-type="submit" :text="$t('global.add')" />
    </van-action-bar>
  </van-form>
</template>