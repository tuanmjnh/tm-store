<script setup lang="ts">
import { showNotify } from 'vant'
import { useTypeStore } from '@/store'
import { historyBack } from '@/router'
import { $t } from '@/i18n'

const typeStore = useTypeStore()
const form = computed(() => typeStore.item)
const onSubmit = async () => {
  try {
    if (form.value._id) {
      const rs = await typeStore.update(form.value)
      if (rs.data) showNotify({ type: 'success', message: $t('success.update') })
    } else {
      const rs = await typeStore.create(form.value)
      if (rs.data) {
        showNotify({ type: 'primary', message: $t('success.create') })
        typeStore.setItem()
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
      <van-field v-model="form.key" name="key" :label="$t('global.key')" :placeholder="$t('global.inputPlaceholder')"
        :rules="[{ required: true, message: $t('error.required') }]" />
      <van-field v-model="form.code" name="code" :label="$t('global.code')" :placeholder="$t('global.inputPlaceholder')"
        :rules="[{ required: true, message: $t('error.required') }]" />
      <van-field v-model="form.name" name="name" :label="$t('global.name')" :placeholder="$t('global.inputPlaceholder')"
        :rules="[{ required: true, message: $t('error.required') }]" />
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
    <van-action-bar placeholder>
      <van-action-bar-icon icon="arrow-left" @click="historyBack()" />
      <van-action-bar-icon />
      <!-- <van-action-bar-button type="success" text="Copy" /> -->
      <van-action-bar-button v-if="form._id" type="success" native-type="submit" :text="$t('global.update')" />
      <van-action-bar-button v-else type="primary" native-type="submit" :text="$t('global.add')" />
    </van-action-bar>
  </van-form>
</template>