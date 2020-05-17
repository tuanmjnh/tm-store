import * as http from '@/utils/http-client'
const collection = '/products'

export async function select(params) {
  return http.API_MAIN.get(collection, { params })
}

export async function find(params) {
  return http.API_MAIN.get(`${collection}/find`, { params })
}

export async function exist(params) {
  return http.API_MAIN.get(`${collection}/exist`, { params })
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

export async function loadFileImport(params) {
  return http.API_MAIN.post(`${collection}/load-file-import`, params)
}

export async function finds(params) {
  return http.API_MAIN.post(`${collection}/finds`, params)
}

export async function imports(params) {
  return http.API_MAIN.post(`${collection}/imports`, params)
}
