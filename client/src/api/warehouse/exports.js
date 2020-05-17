import * as http from '@/utils/http-client'
const collection = '/product-exports'

export async function select(params) {
  return http.API_MAIN.get(collection, params)
}

export async function finds(params) {
  return http.API_MAIN.post(collection, params)
}

export async function exports(params) {
  return http.API_MAIN.put(collection, params)
}
