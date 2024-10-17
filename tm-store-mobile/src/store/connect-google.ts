import { http } from '@/utils/http-axios'
import { IResponseList, IResponseItem } from './interfaces/common'

const API_PATH = 'google-auth'
export const useConnectGoogleStore = defineStore('connectGoogleStore', {
  // persist: true,
  state: (): {
  } => ({
  }),
  getters: {
  },
  actions: {
    async authCode(arg?: any): Promise<IResponseList> {
      try {
        const rs: IResponseList = await http.axiosInstance.get(`/${API_PATH}`, { params: arg })
        this.item = rs.data
        return rs
      } catch (e) { throw e }
    },
    async create(arg?: any) {
      try {
        const rs: IResponseItem = await http.axiosInstance.post(`/${API_PATH}`, arg)
        return rs
      } catch (e) { throw e }
    },
    async update(arg?: any) {
      try {
        const rs: IResponseItem = await http.axiosInstance.put(`/${API_PATH}`, arg)
        return rs
      } catch (e) { throw e }
    },
    // easily reset state using `$reset`
    clear() {
      this.$reset()
    }
  }
})
