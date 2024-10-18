import { http } from '@/utils/http-axios'
import { IResponseList, IResponseItem } from './interfaces/common'

const API_PATH = 'connects'
export const useConnectsStore = defineStore('connectsStore', {
  persist: true,
  state: (): {
    google: any,
    facebook: any,
    tiktok: any
  } => ({
    google: { key: 'google', name: 'Google', profile: {} as any },
    facebook: { key: 'facebook', name: 'Facebook', profile: {} as any },
    tiktok: { key: 'tiktok', name: 'Tiktok', profile: {} as any },
  }),
  getters: {
  },
  actions: {
    async googleGetAuth(arg?: any): Promise<IResponseList> {
      try {
        const rs: IResponseList = await http.axiosInstance.get(`/${API_PATH}`, { params: arg })
        this.google = rs.data
        return rs
      } catch (e) { throw e }
    },
    async googleAuthByCode(arg?: any): Promise<IResponseList> {
      try {
        const rs: IResponseList = await http.axiosInstance.post(`/${API_PATH}/google`, arg)
        this.google = rs.data
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
