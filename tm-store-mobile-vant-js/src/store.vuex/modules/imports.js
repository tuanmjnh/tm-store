import { api } from '../../utils/axios'
import MUTATIONS from '../mutations'
import ACTIONS from '../actions'
const collection = '/product-imports'
const constant = {}
const state = {
  items: [],
  item: { ...constant },
  pagination: {
    filter: '',
    sortBy: 'created.at',
    flag: 1,
    page: 1,
    descending: true,
    rowsPerPage: 10,
    rowsNumber: 1,
    totalPage: 0
  }
}
const mutations = MUTATIONS(constant, state.pagination)
const actions = ACTIONS(collection, state.pagination)
actions.getSub = ({ commit }, params) => {
  return api.get(`${collection}/get-sub`, { params })
}
// const mutations = {
//   SET_ITEMS(state, value) {
//     state.items = value ? value : []
//   },
//   CONCAT_ITEMS(state, value) {
//     state.items = value ? state.items.concat(value) : []
//   },
//   SET_ITEM(state, value) {
//     if (value) state.item = value
//     else state.item = { ...constant }
//   },
//   ADD_ITEMS(state, value) {
//     if (Array.isArray(value)) value.forEach(e => { state.items.push(e) })
//     else state.items.push(value)
//   },
//   UPDATE_ITEMS(state, value) {
//     if (Array.isArray(value)) {
//       value.forEach(e => {
//         const i = state.items.findIndex(x => x._id === e._id)
//         if (i > -1) state.items.splice(i, 1, e)
//       })
//     } else {
//       const i = state.items.findIndex(x => x._id === value._id)
//       if (i > -1) state.items.splice(i, 1, value)
//     }
//   },
//   FLAG_REMOVE_ITEMS(state, value) {
//     if (Array.isArray(value)) {
//       value.forEach(e => {
//         const i = state.items.findIndex(x => x._id === e)
//         if (i > -1) state.items.splice(i, 1)
//       })
//     } else {
//       const i = state.items.findIndex(x => x._id === value)
//       if (i > -1) state.items.splice(i, 1)
//     }
//   },
//   SET_PAGINATION(state, value) {
//     state.pagination = value ? value : {
//       filter: '',
//       sortBy: 'created.at',
//       flag: 1,
//       page: 1,
//       descending: true,
//       rowsPerPage: 10,
//       rowsNumber: 1,
//       totalPage: 0
//     }
//   }
// }
// const actions = {
//   set({ commit }, params) {
//     commit('SET_ITEM', params)
//   },
//   get({ commit }, { params, scroll }) {
//     return api.get(collection, { params }).then((res) => {
//       if (res && res.data) {
//         const pagination = JSON.parse(JSON.stringify(params))
//         pagination.rowsNumber = res.rowsNumber
//         pagination.totalPage = Math.ceil(res.rowsNumber / params.rowsPerPage)
//         commit('SET_PAGINATION', pagination)
//         if (scroll) commit('CONCAT_ITEMS', res.data)
//         else commit('SET_ITEMS', res.data)
//       }
//       return res
//     })
//   },
//   getSub({ commit }, params) {
//     return api.get(`${collection}/get-sub`, { params })
//   },
//   select({ commit }, params) {
//     return api.post(`${collection}/select`, params)
//   },
//   post({ commit }, params) {
//     return api.post(collection, params).then((res) => {
//       if (res.d) commit('ADD_ITEMS', res.d)
//       // commit('SET_ITEM')
//       return res
//     })
//   },
//   put({ commit }, params) {
//     return api.put(collection, params)
//   },
//   patch({ commit }, params) {
//     return api.patch(collection, params)
//   },
//   setPagination({ commit, state }, params) {
//     const pagination = {
//       filter: params.filter !== undefined ? params.filter : state.pagination.filter,
//       sortBy: params.sortBy !== undefined ? params.sortBy : state.pagination.sortBy,
//       flag: params.flag !== undefined ? params.flag : state.pagination.flag,
//       page: params.page !== undefined ? params.page : state.pagination.page,
//       descending: params.descending !== undefined ? params.descending : state.pagination.descending,
//       rowsPerPage: params.rowsPerPage !== undefined ? params.rowsPerPage : state.pagination.rowsPerPage,
//       rowsNumber: params.rowsNumber !== undefined ? params.rowsNumber : state.pagination.rowsNumber,
//       totalPage: params.totalPage !== undefined ? params.totalPage : state.pagination.totalPage,
//     }
//     commit('SET_PAGINATION', pagination)
//   }
// }
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
