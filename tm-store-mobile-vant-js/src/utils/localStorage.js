export default {
  get(key) {
    try {
      const rs = window.localStorage.getItem(key)
      return rs ? JSON.parse(rs) : null
    } catch (e) { throw new Error(e) }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (e) { throw new Error(e) }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(key)
    } catch (e) { throw new Error(e) }
  },
  clear() {
    try {
      window.localStorage.clear()
    } catch (e) { throw new Error(e) }
  }
}