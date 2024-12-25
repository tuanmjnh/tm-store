<script setup lang="ts">
import treeView from '@/components/tree-view/index.vue'
import { useRoleStore } from '@/store'
import { historyBack, routesTree } from '@/router'
// import { rootRoute } from '@/router/routes.inner'
import { $t } from '@/i18n'
import { showNotify } from 'vant'
const route = useRoute()
const roleStore = useRoleStore()
const form = computed(() => roleStore.item)
const active = ref('basicInf')
const treeItems = ref([])
const treeSelected = ref([])//form.value.routes
const onSubmit = async () => {
  try {
    form.value.routes = treeSelected.value
    if (form.value._id) {
      const rs = await roleStore.update(form.value)
      if (rs.data) showNotify({ type: 'success', message: $t('success.update') })
    } else {
      const rs = await roleStore.create(form.value)
      if (rs.data) {
        showNotify({ type: 'primary', message: $t('success.create') })
        roleStore.setItem()
      }
    }
  } catch (error) {
    if (error.data && error.data.message) showNotify({ type: 'danger', message: $t(`error.${error.data.message}`) })
    else showNotify({ type: 'danger', message: $t(`http.${error.status}`) })
  }
}
const treeItem = (route): AppTypes.TreeViewNodeItem => {
  // if (!route.meta.requiresAuth) treeSelected.value.push(route.name)
  if (form.value.routes && form.value.routes.length && form.value.routes.indexOf(route.name) > -1) treeSelected.value.push(route.name)
  return { id: route.name, name: $t(`route.${route.meta.title}`, route.name), icon: route.meta.icon, disabled: !route.meta.requiresAuth }
}
const routesToTree = (routes) => {
  const rs = [] as any
  for (const route of routes) {
    if (!route.meta.requiresAuth) continue
    const r = treeItem(route)
    if (route.children && route.children.length) r.children = routesToTree(route.children)
    rs.push(r)
  }
  return rs
}
const initForm = async () => {
  if (route.params.id && !form.value._id) await roleStore.getItem(route.params)
  // treeItems.value = routesToTree(rootRoute.children)
  treeItems.value = routesToTree(routesTree)
}
initForm()
</script>
<template>
  <van-form required="auto" @submit="onSubmit">
    <van-tabs v-model:active="active">
      <van-tab :title="$t('tabs.basicInf')" name="basicInf">
        <van-cell-group inset>
          <van-field v-model="form.key" name="key" :label="$t('global.key')"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.name" name="name" :label="$t('global.name')"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.color" name="color" :label="$t('global.color')"
            :placeholder="$t('global.inputPlaceholder')" />
          <van-field v-model="form.level" name="level" :label="$t('global.level')"
            :placeholder="$t('global.inputPlaceholder')" :rules="[{ required: true, message: $t('error.required') }]" />
          <van-field v-model="form.desc" type="textarea" rows="1" autosize name="desc" :label="$t('global.desc')"
            :placeholder="$t('global.inputPlaceholder')" />
        </van-cell-group>
      </van-tab>
      <van-tab :title="$t('tabs.routes')" name="routes">
        <!-- <Tree v-model:selectionKeys="selectedKey" :value="routesTree" selectionMode="checkbox"
          class="primevue-tree w-full md:w-[30rem] border-none">
        </Tree> -->
        <tree-view v-model="treeSelected" :items="treeItems" dense selectable color="blue" />
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
</template>