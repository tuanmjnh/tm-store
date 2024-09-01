import Cookies from 'js-cookie'
import { Router, generateRoutes, resetRouter, constant } from '../../router'
import { api } from '../../utils/axios'
const collection = '/auth'

const state = {
  verified: false,
  loading: false,
  token: Cookies.get('token') || undefined,
  user: undefined,
  roles: [],
  routesConstant: constant,
  routes: []
}
const mutations = {
  SET_VERIFIED(state, value) {
    state.verified = value
  },
  SET_LOADING(state, value) {
    state.loading = value
  },
  SET_TOKEN(state, value) {
    if (value) {
      state.token = value
      Cookies.set('token', value)
    } else {
      state.token = null
      Cookies.remove('token')
    }
  },
  SET_USER(state, value) {
    state.user = value
  },
  SET_USER_PROFILE(state, value) {
    if (value.fullName) state.user.fullName = value.fullName
    if (value.email) state.user.email = value.email
    if (value.phone) state.user.phone = value.phone
    if (value.personNumber) state.user.personNumber = value.personNumber
    if (value.region) state.user.region = value.region
    if (value.avatar) state.user.avatar = value.avatar
    if (value.note) state.user.note = value.note
    if (value.dateBirth) state.user.dateBirth = value.dateBirth
    if (value.gender) state.user.gender = value.gender
    if (value.address) state.user.address = value.address
  },
  SET_ROUTES(state, value) {
    state.routes = [[], ...value]
  },
  SET_IS_ADD_ROUTER(state, value) {
    state.isAddRouter = value
  }
}
const actions = {
  async login({ commit }, params) {
    try {
      commit('SET_LOADING', true)
      const rs = await api.post(collection, params)
      if (rs) {
        commit('SET_VERIFIED', true)
        if (rs.token) commit('SET_TOKEN', rs.token)
        if (rs.user) commit('SET_USER', rs.user)
        if (rs.user && rs.user.routes) {
          const routes = await generateRoutes(rs.user.routes)
          Router.addRoutes(routes, { replace: true })
          commit('SET_ROUTES', routes)
        }
      }
    } catch (e) {
      return null
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async verify({ commit, dispatch, rootState }, params) {
    commit('SET_LOADING', true)
    let rs
    try {
      if (params) rs = await api.post(collection, params)
      else rs = await api.get(collection, { params })
      if (rs) {
        commit('SET_VERIFIED', true)
        if (rs.token) commit('SET_TOKEN', rs.token)
        if (rs.user) commit('SET_USER', rs.user)
        if (rs.user && rs.user.routes) {
          const routes = await generateRoutes(rs.user.routes)
          for await (const r of routes) {
            Router.addRoute(r)
          }
          commit('SET_ROUTES', routes)
        }
      } else {
        dispatch('logout')
      }
      return rs
    } catch (e) {
      return null
    } finally {
      commit('SET_LOADING', false)
    }
  },
  logout({ commit }) {
    commit('SET_VERIFIED', false)
    commit('SET_TOKEN')
    commit('SET_USER', null)
    commit('SET_ROUTES', [])
    resetRouter()
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
