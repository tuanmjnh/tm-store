import { api } from '../../utils/axios'
import MUTATIONS from '../mutations'
import ACTIONS from '../actions'
const collection = '/products'

const constant = {
  categories: null,
  title: null,
  code: null,
  desc: null,
  content: '',
  images: null,
  types: null,
  typeData: null,
  quantity: 0,
  price: 0,
  // priceDiscount: 0,
  priceImport: 0,
  priceExport: 0,
  priceUnit: null,
  unit: null,
  brand: null,
  originName: null,
  originAddress: null,
  weight: null,
  date: null,
  pins: [],
  tags: null,
  attr: [],
  meta: null,
  qrcode: null,
  barcode: null,
  order: 1,
  flag: 1,
  created: null
}

const state = {
  items: [],
  item: { ...constant },
  pagination: {
    filter: '',
    sortBy: 'orders',
    flag: 1,
    page: 1,
    descending: false,
    categories: null,
    rowsPerPage: 15,
    rowsNumber: 1,
    totalPage: 0
  }
}
const mutations = MUTATIONS(constant, state.pagination)
const actions = ACTIONS(collection, state.pagination)
actions.finds = ({ commit }, params) => {
  return api.post(`${collection}/finds`, params)
}
actions.getAttr = ({ commit }, params) => {
  return api.debonce({ method: 'get', params: params, url: `${collection}/get-attr` })
}
actions.getList = ({ commit }, params) => {
  return api.get(collection, { params }).then((res) => {
    // if (res && res.data) {
    //   const page = JSON.parse(JSON.stringify(params))
    //   page.rowsNumber = res.rowsNumber
    //   page.totalPage = Math.ceil(res.rowsNumber / params.rowsPerPage)
    //   commit('SET_PAGINATION', page)
    //   if (scroll) commit('CONCAT_ITEMS', res.data)
    //   else commit('SET_ITEMS', res.data)
    // }
    return res
  })
}
actions.duplicate = ({ commit }, params) => {
  params = JSON.parse(JSON.stringify(params))
  if (params.data._id) delete params.data._id
  return api.post(`${collection}/duplicate`, params).then((res) => {
    if (res.data) commit('ADD_ITEMS', res.data)
    commit('SET_ITEM')
  })
}
// const mutations = {
//   SET_ITEMS(state, value) {
//     state.items = value ? value : []
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
//   REMOVE_ITEMS(state, value) {
//     if (Array.isArray(value)) {
//       value.forEach(e => {
//         const i = state.items.findIndex(x => x._id === e._id)
//         if (i > -1) state.items.splice(i, 1)
//       })
//     } else {
//       const i = state.items.findIndex(x => x._id === value._id)
//       if (i > -1) state.items.splice(i, 1)
//     }
//   }
// }
// const actions = {
//   get({ commit }, params) {
//     return api.get(collection, { params }).then((res) => {
//       if (res && res.data) commit('SET_ITEMS', res.data)
//       // if (res && res.rowsNumber) commit('SET_ROWS_NUMBER', res.rowsNumber)
//       return res
//     })
//   },
//   set({ commit }, params) {
//     commit('SET_ITEM', params)
//   },
//   find({ commit }, params) {
//     return api.get(`${collection}/find`, { params })// .then((res) => { return res })
//   },
//   finds({ commit }, params) {
//     return api.post(`${collection}/finds`, params)
//   },
//   exist({ commit }, params) {
//     return api.debonce({ method: 'get', params: params, url: `${collection}/exist` })
//   },
//   getAttr({ commit }, params) {
//     return api.debonce({ method: 'get', params: params, url: `${collection}/get-attr` })
//   },
//   post({ commit }, params) {
//     return api.post(collection, params).then((res) => {
//       commit('ADD_ITEMS', res)
//       commit('SET_ITEM')
//       return res
//     })
//   },
//   put({ commit }, params) {
//     return api.put(collection, params).then((res) => {
//       commit('UPDATE_ITEMS', params)
//       return res
//     })
//   },
//   patch({ commit }, params) {
//     return api.patch(collection, params).then((res) => {
//       commit('FLAG_REMOVE_ITEMS', res.s)
//       return res
//     })
//   },
//   import({ commit }, params) {
//     return api.post(`${collection}/import`, params).then((res) => {
//       return res
//     })
//   },
//   delete({ commit }, params) {
//     return api.delete(collection, params).then((res) => {
//       commit('REMOVE_ITEMS', params)
//       return res
//     })
//   },
//   loadFileImport({ commit }, params) {
//     return api.post(`${collection}/load-file-import`, params)
//   },
//   // newTypeData({ commit }, params) {
//   //   return { price: params.price || 0, priceImport: params.priceImport || 0, quantity: params.quantity || 0 }
//   // },
//   // pushTypeDataOption({ commit }, params) {
//   // }
// }
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
