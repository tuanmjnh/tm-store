<script setup lang="ts">
import { useUserStore } from '@/store'
import { historyBack } from '@/router'
import { $t } from '@/i18n'
import { showNotify } from 'vant'

const route = useRoute();
const userStore = useUserStore()
const form = computed(() => userStore.item)
const active = ref('basicInf')
const showGender = ref(false)
const showDatePicker = ref(false)
if (route.params.id && !form.value._id) userStore.getItem(route.params)
const genders = [
  { text: 'Male', value: 'Male' },
  { text: 'Filmale', value: 'Florida' },
  { text: 'Georgia', value: 'Georgia' },
  { text: 'Indiana', value: 'Indiana' },
  { text: 'Maine', value: 'Maine' },
];
const onConfirmGender = ({ selectedOptions }) => {
  console.log(selectedOptions)
  showGender.value = false
}
const onConfirmDatePicker = ({ selectedValues }) => {
  form.value.dateBirth = selectedValues.join('/')
  showDatePicker.value = false
}
const onSubmit = async () => {
  try {
    if (form.value._id) {
      const rs = await userStore.update(form.value)
      if (rs.data) showNotify({ type: 'success', message: $t('success.update') })
    } else {
      const rs = await userStore.create(form.value)
      if (rs.data) {
        showNotify({ type: 'primary', message: $t('success.create') })
        userStore.setItem()
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
    <van-tabs v-model:active="active">
      <van-tab :title="$t('tabs.basicInf')" name="basicInf">
        <van-cell-group inset>
          <van-field v-model="form.username" name="username" :label="$t('user.username')" disabled
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.fullName" name="fullName" :label="$t('user.fullName')"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.dateBirth" is-link readonly name="dateBirth" :label="$t('user.dateBirth')"
            :placeholder="$t('global.inputPlaceholder')" @click="showDatePicker = true" />
          <van-field v-model="form.email" name="email" :label="$t('user.email')"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.phone" name="phone" :label="$t('user.phone')"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.personNumber" name="personNumber" :label="$t('user.personNumber')"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.region" name="region" :label="$t('user.region')"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.address" type="textarea" rows="1" autosize name="address" :label="$t('user.address')"
            :placeholder="$t('global.inputPlaceholder')" />
          <van-field v-model="form.gender" is-link readonly name="gender" :label="$t('user.gender')"
            :rules="[{ required: true, message: $t('error.required') }]" :placeholder="$t('global.inputPlaceholder')"
            @click="showGender = true" />
          <van-field name="verified" :label="$t('user.verified')" :placeholder="$t('global.inputPlaceholder')"
            :rules="[{ required: true, message: $t('error.required') }]">
            <template #input>
              <van-switch v-model="form.verified" disabled />
            </template>
          </van-field>
          <van-field name="enable" :label="$t('global.status')" :placeholder="$t('global.inputPlaceholder')"
            :rules="[{ required: true, message: $t('error.required') }]">
            <template #input>
              <van-switch v-model="form.enable" disabled />
            </template>
          </van-field>
          <van-field v-model="form.lastLogin" is-link readonly name="lastLogin" :label="$t('user.lastLogin')"
            :placeholder="$t('table.noData')" />
          <van-field v-model="form.lastChangePass" is-link readonly name="lastChangePass"
            :label="$t('user.lastChangePass')" :placeholder="$t('table.noData')" />
        </van-cell-group>
      </van-tab>
      <van-tab :title="$t('user.roles')" name="roles">
      </van-tab>
      <van-tab :title="$t('global.avatar')" name="avatar">
      </van-tab>
      <van-tab :title="$t('global.note')" name="note">
        <van-field v-model="form.note" type="textarea" rows="1" autosize name="note" :label="$t('global.note')"
          :placeholder="$t('global.inputPlaceholder')" />
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
  <van-popup v-model:show="showGender" position="bottom">
    <van-picker :columns="genders" @confirm="onConfirmGender" @cancel="showGender = false"
      :confirm-button-text="$t('global.confirm')" :cancel-button-text="$t('global.cancel')" />
  </van-popup>
  <van-popup v-model:show="showDatePicker" position="bottom">
    <van-date-picker @confirm="onConfirmDatePicker" @cancel="showDatePicker = false"
      :confirm-button-text="$t('global.confirm')" :cancel-button-text="$t('global.cancel')" />
  </van-popup>
</template>