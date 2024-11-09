import { http } from '@/utils/http-axios'
import { ICreated, IResponseList, IResponseItem } from './interfaces/common'
import { GoogleTokenInfo } from '@/services/google/oauth2'

export interface IModelConnectProfile {
  email?: string
  email_verified?: boolean
  name?: string
  picture?: string
  given_name?: string
  family_name?: string
  iat?: number
  exp?: number
}
export interface IModelConnect {
  _id?: string
  name: string
  key: string
  access_token?: string
  profile?: IModelConnectProfile
  config?: string
  order?: number
  flag?: number
  created?: ICreated
}

const API_PATH = 'connects'
export const useConnectsStore = defineStore('connectsStore', {
  persist: true,
  state: (): {
    google: IModelConnect
    facebook: IModelConnect
    tiktok: IModelConnect
  } => ({
    google: { key: 'google', name: 'Google', profile: {} },
    facebook: { key: 'facebook', name: 'Facebook', profile: {} },
    tiktok: { key: 'tiktok', name: 'Tiktok', profile: {} },
  }),
  getters: {
  },
  actions: {
    async googleVerifyAccessToken(arg?: any): Promise<boolean> {
      try {
        const rs = await GoogleTokenInfo(this.google.access_token)
        if (rs.exp) return true
        else {
          const credential = await this.googleGetAuth()
          return credential.status
        }
      } catch (e) { throw e }
    },
    async googleGetAuth(arg?: any): Promise<IResponseList> {
      try {
        const rs: IResponseList = await http.axiosInstance.get(`/${API_PATH}/google`, { params: arg })
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
    async googleRemoveAuth(arg?: any): Promise<IResponseList> {
      try {
        const rs: IResponseList = await http.axiosInstance.patch(`/${API_PATH}/google`, arg)
        if (rs.status) {
          this.google.access_token = null
          this.google.profile = null
        }
        return rs
      } catch (e) { throw e }
    },
    async googleSetClientID(arg?: any): Promise<IResponseList> {
      try {
        const rs: IResponseList = await http.axiosInstance.put(`/${API_PATH}/google`, arg)
        this.google = rs.data
        return rs
      } catch (e) { throw e }
    },
    async googleRemoveClientID(arg?: any): Promise<IResponseList> {
      try {
        const rs: IResponseList = await http.axiosInstance.delete(`/${API_PATH}/google`, arg)
        if (rs.status) {
          this.google.access_token = null
          this.google.profile = null
        }
        return rs
      } catch (e) { throw e }
    },
    // easily reset state using `$reset`
    clear() {
      this.$reset()
    }
  }
})
