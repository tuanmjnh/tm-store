import Axios, { type AxiosInstance, type AxiosError, type AxiosResponse, type AxiosRequestConfig } from "axios";
import NProgress from "./progress";
import { showFailToast } from "vant";
import "vant/es/toast/style";

/**
 * @description: ContentType
 */
export enum ContentTypeEnum {
  // form-data qs
  FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
  // form-data upload
  FORM_DATA = "multipart/form-data;charset=UTF-8",
  // json
  JSON = "application/json;charset=UTF-8"
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
    "Content-Type": ContentTypeEnum.JSON
  },
  timeout: 0,
  baseURL: import.meta.env.VITE_BASE_API,
  data: {}
};

class Http {
  // Current instance
  private static axiosInstance: AxiosInstance;
  // Request Configuration
  private static axiosConfigDefault: AxiosRequestConfig;

  // Request interception
  private httpInterceptorsRequest(): void {
    Http.axiosInstance.interceptors.request.use(
      config => {
        NProgress.start();
        // Before sending a request, you can carry a token here
        // if (token) {
        //   config.headers['token'] = token
        // }
        return config;
      },
      (error: AxiosError) => {
        showFailToast(error.message);
        return Promise.reject(error);
      }
    );
  }

  // Response Interception
  private httpInterceptorsResponse(): void {
    Http.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        NProgress.done();
        // The return fields of the contract with the backend
        const { code, result } = response.data;
        // const { message } = response.data;
        // Determine whether the request is successful
        const isSuccess = result && Reflect.has(response.data, "code")
        if (isSuccess) {
          return result;
        } else {
          // Handling request errors
          // showFailToast(message);
          return Promise.reject(response.data);
        }
      },
      (error: AxiosError) => {
        NProgress.done();
        // Handle HTTP network errors
        let message = "";
        // HTTP Status Code
        const status = error.response?.status;
        switch (status) {
          case 400:
            message = "Request error";
            break;
          case 401:
            message = "Unauthorized, please log in";
            break;
          case 403:
            message = "Access denied";
            break;
          case 404:
            message = `Request address error: ${error.response?.config?.url}`;
            break;
          case 408:
            message = "Request timeout";
            break;
          case 500:
            message = "Server internal error";
            break;
          case 501:
            message = "Service not implemented";
            break;
          case 502:
            message = "Gateway error";
            break;
          case 503:
            message = "Service unavailable";
            break;
          case 504:
            message = "Gateway timeout";
            break;
          case 505:
            message = "HTTP version not supported";
            break;
          default:
            message = "Network connection failure";
        }

        showFailToast(message);
        return Promise.reject(error);
      }
    );
  }

  constructor(config: AxiosRequestConfig) {
    Http.axiosConfigDefault = config;
    Http.axiosInstance = Axios.create(config);
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  // Common request functions
  public request<T>(paramConfig: AxiosRequestConfig): Promise<T> {
    const config = { ...Http.axiosConfigDefault, ...paramConfig };
    return new Promise((resolve, reject) => {
      Http.axiosInstance
        .request(config)
        .then((response: any) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export const http = new Http(configDefault);