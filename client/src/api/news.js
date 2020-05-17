import * as http from '@/utils/http-client'
const collection = '/news'

export async function select(params) {
  return http.API_MAIN.get(collection, { params })
}

export async function getAttr(params) {
  return http.API_MAIN_ONCE({ method: 'get', params: params, url: `${collection}/get-attr` })
}

export async function insert(params) {
  return http.API_MAIN.post(collection, params)
}

export async function update(params) {
  return http.API_MAIN.put(collection, params)
}

export async function lock(params) {
  return http.API_MAIN.patch(collection, params)
}
