<script setup lang="ts">
import router from '@/router';
import { $t } from '@/i18n';
import { useTypeStore } from '@/store'
const typeStore = useTypeStore()

const filter = ref({
  text: '',
  flag: 1
})
const optionFlag = [
  { text: $t(`app.activite`), value: 1 },
  { text: $t(`app.inactivite`), value: 0 },
];
const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const isShowFilter = ref(false);
const onLoadData = () => {
  const a = typeStore.getAll()
  console.log(a)
  // setTimeout(() => {
  //   if (refreshing.value) {
  //     list.value = [];
  //     refreshing.value = false;
  //   }

  //   for (let i = 0; i < 10; i++) {
  //     list.value.push(list.value.length + 1);
  //   }
  //   loading.value = false;

  //   if (list.value.length >= 40) {
  //     finished.value = true;
  //   }
  // }, 1000);
};

const onRefresh = () => {
  finished.value = false;
  loading.value = true;
  onLoadData();
};
const onChangeFlag = () => {
  filter.value.flag = filter.value.flag == 0 ? 1 : 0
}
const onBackPage = () => {
  if (window.history.state.back) history.back()
  else router.replace('/')
}
</script>

<template>
  <van-pull-refresh v-model="refreshing" :pulling-text="$t('app.textPulling')" :loosing-text="$t('app.textLoosing')"
    :loading-text="$t('app.textLoading')" @refresh="onRefresh">
    <van-list v-model:loading="loading" :finished="finished" :finished-text="$t('app.textFinished')"
      :loading-text="$t('app.textLoading')" @load="onLoadData">
      <van-swipe-cell v-for="item in list" :key="item">
        <template #left>
          <van-button square icon="passed" type="primary" />
        </template>
        <van-cell :title="item" value="Cell Content" />
        <template #right>
          <van-button square icon="edit" type="warning" />
          <van-button square icon="close" type="danger" />
        </template>
      </van-swipe-cell>
    </van-list>
  </van-pull-refresh>
  <van-tabbar placeholder fixed>
    <van-tabbar-item icon="arrow-left" @click="onBackPage()">{{ $t('app.back') }}</van-tabbar-item>
    <van-tabbar-item icon="add-o" @click="router.push('add').catch(e => { })">{{ $t('app.add') }}</van-tabbar-item>
    <van-tabbar-item icon="filter-o" @click="isShowFilter = !isShowFilter">{{ $t('app.filter') }}</van-tabbar-item>
    <!-- <van-tabbar-item v-if="filter.flag == 0" icon="completed-o" @click="onChangeFlag">
      {{ $t('app.activite') }}
    </van-tabbar-item>
    <van-tabbar-item v-else icon="delete-o" @click="onChangeFlag">
      {{ $t('app.bin') }}
    </van-tabbar-item> -->
  </van-tabbar>
  <van-popup v-model:show="isShowFilter" position="bottom" :style="{ height: '30%' }">
    <van-search v-model="filter.text" :placeholder="$t('app.search')" />
    <van-cell-group>
      <van-cell :title="$t('app.status')">
        <template #value>
          <van-dropdown-menu>
            <van-dropdown-item v-model="filter.flag" :options="optionFlag">
            </van-dropdown-item>
          </van-dropdown-menu>
        </template>
      </van-cell>
    </van-cell-group>
  </van-popup>
</template>