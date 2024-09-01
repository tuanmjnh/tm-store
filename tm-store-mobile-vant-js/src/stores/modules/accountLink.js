const NAMESPACED = 'accountLink'
const CONSTANT = {
  name: null,
  key: null,
  clientID: null,
  credentials: null,
  authUri: null,
  redirectUris: null,
  flag: 1,
  created: null
}
export default {
  id: NAMESPACED,
  persist: false,
  state: () => ({
    all: null,
    items: [],
    item: { ...CONSTANT },
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
  }),
  getters: {},
  actions: {

    // easily reset state using `$reset`
    clear() {
      this.$reset()
    }
  }
}