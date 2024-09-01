export default (constant, pagination) => {
  return {
    SET_ITEMS(state, value) {
      state.items = value ? value : []
    },
    CONCAT_ITEMS(state, value) {
      state.items = value ? state.items.concat(value) : [] //.concat(value).concat(value).concat(value).concat(value)
    },
    SET_ITEM(state, value) {
      if (value) state.item = value
      else state.item = JSON.parse(JSON.stringify(constant)) //  { ...constant }
    },
    ADD_ITEMS(state, value) {
      if (Array.isArray(value)) state.items.concat(value)
      else state.items.push(value)
      // if (Array.isArray(value)) value.forEach(e => { state.items.push(e) })
      // else state.items.push(value)
    },
    UPDATE_ITEMS(state, value) {
      if (Array.isArray(value)) {
        value.forEach(e => {
          const i = state.items.findIndex(x => x._id === e._id)
          if (i > -1) state.items.splice(i, 1, e)
        })
      } else {
        const i = state.items.findIndex(x => x._id === value._id)
        if (i > -1) state.items.splice(i, 1, value)
      }
    },
    FLAG_REMOVE_ITEMS(state, value) {
      if (Array.isArray(value)) {
        value.forEach(e => {
          const i = state.items.findIndex(x => x._id === e)
          if (i > -1) state.items.splice(i, 1)
        })
      } else {
        const i = state.items.findIndex(x => x._id === value)
        if (i > -1) state.items.splice(i, 1)
      }
    },
    SET_PAGINATION(state, value) {
      state.pagination = value ? value : JSON.parse(JSON.stringify(pagination)) //  { ...pagination }
    }
  }
}
