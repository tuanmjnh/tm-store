import { api } from '../../utils/axios'
import MUTATIONS from '../mutations'
import ACTIONS from '../actions'
const collection = '/types'
const constant = {
  key: '',
  code: '',
  name: '',
  desc: '',
  meta: null,
  orders: 1,
  flag: 1
}
const state = {
  all: [],
  items: [],
  keys: [],
  // metaKeys: [],
  // metaValues: [],
  item: { ...constant },
  pagination: {
    filter: null,
    sortBy: 'level',
    flag: 1,
    page: 1,
    key: 'category',
    descending: false,
    rowsPerPage: 10,
    rowsNumber: 1,
    totalPage: 0
  }
}
const mutations = MUTATIONS(constant, state.pagination)
mutations.SET_ALL = (state, value) => {
  state.all = value ? value : []
}
mutations.SET_KEY = (state, value) => {
  state.keys = value ? value : []
}
mutations.SET_META = (state, value) => {
  state.metas = value ? value : []
}
mutations.UPDATE_ALL = (state, value) => {
  if (Array.isArray(value)) {
    value.forEach(e => {
      const i = state.all.findIndex(x => x._id === e._id)
      if (i > -1) state.all.splice(i, 1, e)
    })
  } else {
    const i = state.all.findIndex(x => x._id === value._id)
    if (i > -1) state.all.splice(i, 1, value)
  }
}
const actions = ACTIONS(collection, state.pagination)
actions.getAll = ({ commit }, params) => {
  // if (params.flag) delete params.flag
  return api.get(`${collection}/get-all`, { params }).then((res) => {
    if (res.data) {
      // Sort by orders
      res.data = res.data.sort(function (a, b) { return a.orders - b.orders })
      commit('SET_ALL', res.data)
      commit('SET_KEY', res.data.distinctArrayObject('key').sort())
    }
    return res
  })
}
actions.getKey = ({ commit }, params) => {
  return api.debonce({ method: 'get', params: params, url: `${collection}/get-key` })
}
actions.getMeta = ({ commit }, params) => {
  return api.debonce({ method: 'get', params: params, url: `${collection}/get-meta` })
}
actions.put = ({ commit }, params) => {
  return api.put(collection, { data: params }).then((res) => {
    commit('UPDATE_ITEMS', params)
    commit('UPDATE_ALL', params)
    return res
  })
}
actions.patch = ({ commit }, params) => {
  return api.patch(collection, { data: params.data }).then((res) => {
    if (params.update && params.update.length) commit('UPDATE_ITEMS', params.update)
    if (params.updateAll && params.updateAll.length) commit('UPDATE_ALL', params.updateAll)
    commit('FLAG_REMOVE_ITEMS', res.success)
    return res
  })
}
// const mutations = {
//   SET_ITEMS(state, value) {
//     state.items = value ? value : []
//     state.keys = state.items.distinctArrayObject('key').sort()
//     // state.metaKeys = [...new Set(state.items.map(x => x['meta']['key']))]
//   },
//   SET_KEY(state, value) {
//     state.keys = value ? value : []
//   },
//   SET_META(state, value) {
//     state.metas = value ? value : []
//   },
//   SET_ITEM(state, value) {
//     if (value) state.item = value
//     else state.item = { ...constant }
//   },
//   ADD_ITEMS(state, value) {
//     if (Array.isArray(value)) {
//       value.forEach(e => {
//         state.items.push(e)
//         state.keys.pushIfNotExist(e.key)
//       })
//     } else {
//       state.items.push(value)
//       state.keys.pushIfNotExist(value.key)
//     }
//   },
//   UPDATE_ITEMS(state, value) {
//     if (Array.isArray(value)) {
//       value.forEach(e => {
//         const i = state.items.findIndex(x => x._id === e._id)
//         // console.log(e)
//         if (i > -1) {
//           state.items.splice(i, 1, e)
//           state.keys.pushIfNotExist(e.key)
//         }
//       })
//     } else {
//       const i = state.items.findIndex(x => x._id === value._id)
//       if (i > -1) {
//         state.items.splice(i, 1, value)
//         state.keys.pushIfNotExist(value.key)
//       }
//     }
//   }
//   //   value.forEach(e => {
//   //     const i = state.items.find(x => x._id === e)
//   //     i.flag = i.flag === 1 ? 0 : 1
//   //   })
//   // }
//   // SET_ROWS_NUMBER (state, value) {
//   //   state.rowsNumber = value ? value : 0
//   // }
// }
// const actions = {
//   get({ commit }, params) {
//     return api.get(collection, { params }).then((res) => {
//       if (res && res.data) commit('SET_ITEMS', res.data)
//       if (res && res.rowsNumber) commit('SET_ROWS_NUMBER', res.rowsNumber)
//     })
//   },
//   getAll({ commit }, params) {
//     return api.get(`${collection}/get-all`, { params }).then((res) => {
//       if (res) {
//         // Sort by orders
//         res = res.sort(function (a, b) { return a.orders - b.orders })
//         commit('SET_ITEMS', res)
//       }
//       return res
//     })
//   },
//   set({ commit }, params) {
//     commit('SET_ITEM', params)
//   },
//   find({ commit }, params) {
//     return api.get(`${collection}/find`, { params })
//   },
//   exist({ commit }, params) {
//     return api.get(`${collection}/exist`, { params })
//   },
//   getKey({ commit }, params) {
//     return api.debonce({ method: 'get', params: params, url: `${collection}/get-key` })// .then((res) => {
//     //   if (res && res.data) commit('SET_KEY', res.data)
//     // })
//   },
//   getMeta({ commit }, params) {
//     return api.debonce({ method: 'get', params: params, url: `${collection}/get-meta` })
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
