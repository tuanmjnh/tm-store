import Cookies from 'js-cookie';
import * as routers from '@/router';
import { constant } from '@/router/routes';
import http from '@/utils/http-client';
const source = '/auth';

const state = {
  verified: false,
  token: Cookies.get('token') || undefined,
  user: undefined,
  roles: [],
  routesConstant: constant,
  routes: []
};
const mutations = {
  SET_VERIFIED(state, value) {
    state.verified = value;
  },
  SET_TOKEN(state, value) {
    state.token = value;
    Cookies.set('token', value);
  },
  REMOVE_TOKEN(state) {
    state.token = null;
    Cookies.remove('token');
  },
  SET_USER(state, value) {
    state.user = value;
  },
  SET_ROUTES(state, value) {
    state.routes = value;
  },
  SET_IS_ADD_ROUTER(state, value) {
    state.isAddRouter = value;
  }
};
const actions = {
  async login({ commit }, params) {
    const rs = await http.post(source, params);
    if (rs) {
      commit('SET_VERIFIED', true);
      if (rs.token) commit('SET_TOKEN', rs.token);
      if (rs.user) commit('SET_USER', rs.user);
      if (rs.user && rs.user.routes) {
        const routes = await routers.generateRoutes(rs.user.routes);
        routers.router.addRoutes(routes, { replace: true });
        commit('SET_ROUTES', routes);
      }
    }
  },
  async verify({ commit, dispatch }, params) {
    let rs;
    if (params) {
      rs = await http.post(source, params);
    } else {
      rs = await http.get(source, { params });
    }
    if (rs) {
      commit('SET_VERIFIED', true);
      if (rs.token) commit('SET_TOKEN', rs.token);
      if (rs.user) commit('SET_USER', rs.user);
      if (rs.user && rs.user.routes) {
        const routes = await routers.generateRoutes(rs.user.routes);
        routers.router.addRoutes(routes, { replace: true });
        commit('SET_ROUTES', routes);
      }
    } else dispatch('logout');
  },
  logout({ commit }) {
    commit('SET_VERIFIED', false);
    commit('REMOVE_TOKEN');
    commit('SET_USER', null);
    commit('SET_ROUTES', []);
    routers.resetRouter();
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
