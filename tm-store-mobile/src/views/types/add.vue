<script setup lang="ts">
import { useTypeStore } from '@/store'
const typeStore = useTypeStore()
import router from '@/router';

const form = computed(() => typeStore.item)

const onSubmit = (values) => {
  console.log('submit', values);
};
const onBackPage = () => {
  if (window.history.state.back) history.back()
  else router.replace('/')
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
      <van-field v-model="form.order" name="name" :label="$t('global.order')" :placeholder="$t('global.inputPlaceholder')"
        :rules="[{ required: true, message: $t('error.required') }]" />
      <van-field v-model="form.desc" type="textarea" rows="1" autosize name="desc" :label="$t('global.desc')"
        :placeholder="$t('global.inputPlaceholder')" />
    </van-cell-group>
    <!-- <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        Submit
      </van-button>
    </div> -->
    <van-action-bar>
      <van-action-bar-icon icon="arrow-left" @click="onBackPage()" />
      <van-action-bar-icon />
      <!-- <van-action-bar-button type="success" text="Copy" /> -->
      <van-action-bar-button type="primary" native-type="submit" :text="$t('global.add')" />
    </van-action-bar>
  </van-form>
</template>