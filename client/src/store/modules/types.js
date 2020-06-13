import http from '@/utils/http-client';
const source = '/example';

const state = {
  items: [],
  item: {},
  rowsNumber: 0
};
const mutations = {
  SET_ITEMS(state, value) {
    state.items = value ? value : [];
  },
  SET_ITEM(state, value) {
    state.item = value ? value : {};
  },
  SET_ROWS_NUMBER(state, value) {
    state.rowsNumber = value ? value : 0;
  }
};
const actions = {
  async get({ commit }, params) {
    const rs = await http.get(source, { params });
    if (rs && rs.data) commit('SET_ITEMS', rs.data);
    if (rs && rs.rowsNumber) commit('SET_ROWS_NUMBER', rs.rowsNumber);
  },
  async find({ commit }, params) {
    const rs = await http.get(`${source}/find`, { params });
    if (rs) commit('SET_ITEMS', rs);
  },
  async exist({ commit }, params) {
    const rs = await http.get(`${source}/exist`, { params });
    if (rs) commit('SET_ITEMS', rs);
  },
  async getKey({ commit }, params) {
    const rs = await http.get(`${source}/get-key`, { params });
    if (rs) commit('SET_ITEMS', rs);
  },
  async getMeta({ commit }, params) {
    const rs = await http.get(`${source}/get-meta`, { params });
    if (rs) commit('SET_ITEMS', rs);
  },
  async post({ commit }, params) {
    const rs = await http.post(source, params);
    if (rs) commit('SET_ITEMS', rs);
  },
  async put({ commit }, params) {
    const rs = await http.put(source, params);
    if (rs) commit('SET_ITEMS', rs);
  },
  async patch({ commit }, params) {
    const rs = await http.patch(source, params);
    if (rs) commit('SET_ITEMS', rs);
  },
  async delete({ commit }, params) {
    const rs = await http.delete(source, params);
    if (rs) commit('SET_ITEMS', rs);
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
