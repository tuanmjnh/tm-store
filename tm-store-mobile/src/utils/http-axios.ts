import Axios, { type AxiosInstance, type AxiosError, type AxiosResponse, type AxiosRequestConfig } from 'axios'
import NProgress from './progress'
import { showFailToast } from 'vant'
import { $t } from '@/i18n'
import * as storage from './localStorage'
import 'vant/es/toast/style'
import { useAppStore } from '../store'

export const CANCEL_TOKEN = Axios.CancelToken
/**
 * @description: ContentType
 */
export enum ContentTypeEnum {
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
  // json
  JSON = 'application/json;charset=UTF-8'
}

/**
 * @description: 与后端协定的状态 code
 */
export enum ResultEnum {
  SUCCESS = 0,
  ERROR = 1
}

// Default axios instance request configuration
const configDefault = {
  headers: {
    'Content-Type': ContentTypeEnum.JSON
  },
  timeout: 0,
  baseURL: import.meta.env.VITE_APP_API,
  data: {}
}

// Create API debonce
let call

class Http {
  // Current instance
  private static axiosInstance: AxiosInstance
  // Request Configuration
  private static axiosConfigDefault: AxiosRequestConfig

  // Request interception
  private httpInterceptorsRequest(): void {
    Http.axiosInstance.interceptors.request.use(
      config => {
        NProgress.start()
        useAppStore().setLoading(config.method)
        // console.log(config)
        // Before sending a request, you can carry a token here
        // Add access-token to headers
        const accessToken = storage.get('access-token')
        if (accessToken) config.headers['x-access-token'] = `Bearer ${accessToken}`
        return config
      },
      (error: AxiosError) => {
        useAppStore().setLoading()
        showFailToast(error.message)
        return Promise.reject(error)
      }
    )
  }

  // Response Interception
  private httpInterceptorsResponse(): void {
    Http.axiosInstance.interceptors.response.use(
      (res: AxiosResponse) => {
        NProgress.done()
        useAppStore().setLoading()
        // console.log(appStore.loading)
        // // Add access-token to headers
        // const accessToken = storage.get('access-token')
        // console.log(accessToken)
        // if (accessToken) res.headers['x-access-token'] = `Bearer ${accessToken}`
        // The return fields of the contract with the backend
        return res.data
      },
      (error: AxiosError) => {
        NProgress.done()
        useAppStore().setLoading()
        // Handle HTTP network errors
        let message = ''
        // HTTP Status Code
        const status = error.response?.status
        switch (status) {
          case 400:
            message = $t('http.400', 'Request error')
            break
          case 401:
            message = $t('http.401', 'Unauthorized, please log in')
            // remove storage access-token and refresh page if 401
            storage.remove('access-token')
            location.reload()
            break
          case 403:
            message = $t('http.403', 'Access denied')
            break
          case 404:
            message = $t('http.404', `Request address error: ${error.response?.config?.url}`)
            break
          case 408:
            message = $t('http.408', 'Request timeout')
            break
          case 500:
            message = $t('http.500', 'Server internal error')
            break
          case 501:
            message = $t('http.501', 'Service not implemented')
            break
          case 502:
            message = $t('http.502', 'Gateway error')
            break
          case 503:
            message = $t('http.503', 'Service unavailable')
            break
          case 504:
            message = $t('http.504', 'Gateway timeout')
            break
          case 505:
            message = $t('http.505', 'HTTP version not supported')
            break
          default:
            message = $t('http.default', 'Network connection failure')
        }
        if (status == 409) { }
        else showFailToast(message)
        return Promise.reject(error.response)
      }
    )
  }
  public axiosInstance: AxiosInstance
  constructor(config: AxiosRequestConfig) {
    Http.axiosConfigDefault = config
    this.axiosInstance = Http.axiosInstance = Axios.create(config)
    this.httpInterceptorsRequest()
    this.httpInterceptorsResponse()
  }


  // const apiDebonce = (config = {}) => {
  //   if (call) call.cancel('canceled')
  //   call = axios.CancelToken.source()
  //   config.cancelToken = call.token
  //   return api(config)
  // }
  public debonce = (config = {} as any) => {
    if (call) call.cancel('canceled')
    call = Axios.CancelToken.source()
    config.cancelToken = call.token
    return this.axiosInstance(config)
  }

  // Common request functions
  public request<T>(paramConfig: AxiosRequestConfig): Promise<T> {
    const config = { ...Http.axiosConfigDefault, ...paramConfig }
    return new Promise((resolve, reject) => {
      Http.axiosInstance
        .request(config)
        .then((response: any) => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export const http = new Http(configDefault)
