import { api } from '../utils/axios'
import { objectUpdateUndefined } from '../utils/index'
export default (collection, pagination) => {
  return {
    set({ commit }, params) {
      commit('SET_ITEM', params)
    },
    get({ commit }, { params, scroll }) {
      return api.get(collection, { params }).then((res) => {
        if (res && res.data) {
          const page = JSON.parse(JSON.stringify(params))
          page.rowsNumber = res.rowsNumber
          page.totalPage = Math.ceil(res.rowsNumber / params.rowsPerPage)
          if (scroll) {
            commit('CONCAT_ITEMS', res.data)
            page.page = page.page + 1
          } else commit('SET_ITEMS', res.data)
          commit('SET_PAGINATION', page)
        }
        return res
      })
    },
    // getSub({ commit }, params) {
    //   return api.get(`${collection}/get-sub`, { params })
    // },
    find({ commit }, params) {
      return api.get(`${collection}/find`, { params })// .then((res) => { return res })
    },
    exist({ commit }, params) {
      return api.debonce({ method: 'get', params: params, url: `${collection}/exist` })
    },
    select({ commit }, params) {
      return api.post(`${collection}/select`, params)
    },
    post({ commit }, params) {
      return api.post(collection, { data: params }).then((res) => {
        if (res.data) commit('ADD_ITEMS', res.data)
        commit('SET_ITEM')
        return res
      })
    },
    put({ commit }, params) {
      return api.put(collection, { data: params }).then((res) => {
        commit('UPDATE_ITEMS', params)
        return res
      })
    },
    patch({ commit }, params) {
      return api.patch(collection, { data: params }).then((res) => {
        commit('FLAG_REMOVE_ITEMS', res.success)
        return res
      })
    },
    delete({ commit }, params) {
      return api.delete(collection, { data: params }).then((res) => {
        commit('REMOVE_ITEMS', params)
        return res
      })
    },
    import({ commit }, params) {
      return api.post(`${collection}/import`, params).then((res) => {
        return res
      })
    },
    setPagination({ commit }, params) {
      commit('SET_PAGINATION', objectUpdateUndefined(pagination, params))
    }
  }
}
