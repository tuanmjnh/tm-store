<script setup lang="ts">
import componentGroup from "@/views/groups/groups.vue"
import { showNotify } from 'vant'
import { useGroupStore } from '@/store'
import { historyBack } from '@/router'
import { $t } from '@/i18n'
import router from '@/router'
const $route = useRoute()
const groupStore = useGroupStore()
const form = computed(() => groupStore.item)
const isDialogGroup = ref(false)
const parent = ref(null)

const onSelectParent = async (arg) => {
  try {
    isDialogGroup.value = false
    console.log(arg)
  } catch (error) {
    if (error.data && error.data.message) showNotify({ type: 'danger', message: $t(`error.${error.data.message}`) })
    else showNotify({ type: 'danger', message: $t(`http.${error.status}`) })
  }
}
const onSubmit = async () => {
  try {
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
      <van-field v-model="parent" name="parent" :label="$t('group.parent')" readonly
        :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]"
        @click="isDialogGroup = true">

      </van-field>
      <van-field v-model="form.code" name="code" :label="$t('global.code')" :placeholder="$t('global.inputPlaceholder')"
        :rules="[{ required: true, message: $t('error.required') }]" />
      <van-field v-model="form.title" name="name" :label="$t('global.name')"
        :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
      <van-field v-model="form.order" name="name" :label="$t('global.order')"
        :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
      <van-field v-model="form.desc" type="textarea" rows="1" autosize name="desc" :label="$t('global.desc')"
        :placeholder="$t('global.inputPlaceholder')" />
    </van-cell-group>
    <!-- <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit">
        Submit
      </van-button>
    </div> -->

    <van-dialog v-model:show="isDialogGroup" title="Title" show-cancel-button>
      <componentGroup :flag="1" text="" :type="$route.meta.module" @on-select="onSelectParent" />
    </van-dialog>
    <van-action-bar placeholder>
      <van-action-bar-icon icon="arrow-left" @click="historyBack()" />
      <van-action-bar-icon />
      <!-- <van-action-bar-button type="success" text="Copy" /> -->
      <van-action-bar-button v-if="form._id" type="success" native-type="submit" :text="$t('global.update')" />
      <van-action-bar-button v-else type="primary" native-type="submit" :text="$t('global.add')" />
    </van-action-bar>
  </van-form>
</template>