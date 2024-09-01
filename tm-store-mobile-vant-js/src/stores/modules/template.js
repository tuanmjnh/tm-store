import { api } from '../../plugins/axios'
const NAMESPACED = 'app'
const CONSTANT = {}
export default {
  id: NAMESPACED,
  persist: true,
  state: () => ({

  }),
  getters: {},
  actions: {

    // easily reset state using `$reset`
    clear() {
      this.$reset()
    }
  }
}