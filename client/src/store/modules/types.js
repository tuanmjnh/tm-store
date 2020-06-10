import http from '@/utils/http-client';
const controller = '/example';

const state = {
  items: [],
  item: {}
};
const mutations = {
  SET_ITEMS(state, value) {
    state.items = value ? value : [];
  },
  SET_ITEM(state, value) {
    state.item = value ? value : {};
  }
};
const actions = {
  async select({ commit }, params) {
    const rs = await http.get(controller, { params });
    if (rs) commit('SET_ITEMS', rs);
  },
  async insert({ commit }, params) {
    const rs = await http.post(controller, params);
    if (rs) commit('SET_ITEMS', rs);
  },
  async update({ commit }, params) {
    const rs = await http.put(controller, params);
    if (rs) commit('SET_ITEMS', rs);
  },
  async trash({ commit }, params) {
    const rs = await http.patch(controller, params);
    if (rs) commit('SET_ITEMS', rs);
  },
  async remove({ commit }, params) {
    const rs = await http.delete(controller, params);
    if (rs) commit('SET_ITEMS', rs);
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
