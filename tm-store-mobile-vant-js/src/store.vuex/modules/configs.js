import { api } from '../../utils/axios'
import MUTATIONS from '../mutations'
import ACTIONS from '../actions'
const collection = '/configs'
const constant = {
  key: '',
  value: '',
  type: 0
}
const state = {
  all: null,
  items: [],
  item: { ...constant },
  pagination: {
    filter: '',
    sortBy: 'key',
    flag: 1,
    page: 1,
    descending: false,
    rowsPerPage: 10,
    rowsNumber: 1,
    totalPage: 0
  }
}
const getConfigs = async (data) => {
  const rs = {}
  for await (const e of data) {
    rs[e.key] = e.value
  }
  // data.forEach(e => { rs[e.key] = e.value })
  return rs
}
const mutations = MUTATIONS(constant, state.pagination)
mutations.SET_ALL = (state, value) => {
  state.all = value ? value : []
}
mutations.UPDATE_ALL = (state, value) => {
  state.all[value.key] = value.value
  // console.log(state.all)

  // if (Array.isArray(value)) {
  //   value.forEach(e => {
  //     const i = state.all.findIndex(x => x._id === e._id)
  //     if (i > -1) state.all.splice(i, 1, e)
  //   })
  // } else {
  //   const i = state.all.findIndex(x => x._id === value._id)
  //   if (i > -1) state.all.splice(i, 1, value)
  // }
}
const actions = ACTIONS(collection, state.pagination)
actions.getAll = ({ commit }, params) => {
  return api.get(`${collection}/get-all`, { params }).then((res) => {
    let rs = {}
    if (res.data) {
      // Sort by orders
      // res = res.sort(function (a, b) { return a.orders - b.orders })
      getConfigs(res.data).then(x => {
        commit('SET_ALL', x)
      })
      // res.data.forEach(e => { rs[e.key] = e.value })
    }
    return rs
  })
}
actions.put = ({ commit }, params) => {
  return api.put(collection, { data: params }).then((res) => {
    commit('UPDATE_ITEMS', params)
    commit('UPDATE_ALL', params)
    return res
  })
}
// const mutations = {
//   SET_INSTANT(state, value) {
//     state.instant = value ? value : {}
//   },
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
//         // console.log(e)
//         if (i > -1) {
//           state.items.splice(i, 1, e)
//           // state.keys.pushIfNotExist(e.key)
//         }
//       })
//     } else {
//       const i = state.items.findIndex(x => x._id === value._id)
//       if (i > -1) {
//         state.items.splice(i, 1, value)
//         // state.keys.pushIfNotExist(value.key)
//       }
//     }
//   }
// }
// const actions = {
//   get({ commit }, params) {
//     return api.get(collection, { params }).then((res) => {
//       if (res) commit('SET_ITEMS', res.data)
//       return res
//     })
//   },
//   getAll({ commit }, params) {
//     return api.get(`${collection}/get-all`, { params }).then((res) => {
//       const rs = {}
//       if (res) {
//         // Sort by orders
//         // res = res.sort(function (a, b) { return a.orders - b.orders })
//         res.forEach(e => {
//           rs[e.key] = e.value
//         })
//         commit('SET_INSTANT', rs)
//       }
//       return rs
//     })
//   },
//   set({ commit }, params) {
//     commit('SET_ITEM', params)
//   },
//   exist({ commit }, params) {
//     return api.debonce({ method: 'get', params: params, url: `${collection}/exist` })
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
//   patch({ state, commit }, params) {
//     return api.patch(collection, params).then((res) => {
//       const data = []
//       state.items.forEach(x => {
//         if (res.success.indexOf(x._id) > -1) {
//           const tmp = { ...x }
//           tmp.flag = tmp.flag === 1 ? 0 : 1
//           data.push(tmp)
//         }
//       })
//       commit('UPDATE_ITEMS', data)
//       return res
//     })
//   },
//   delete({ commit }, params) {
//     return api.delete(collection, params).then((res) => {
//       return res
//     })
//   }
// }

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
