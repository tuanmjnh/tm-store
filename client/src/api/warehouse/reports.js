import * as http from '@/utils/http-client'
const collection = '/product-reports'

export async function date(params) {
  return http.API_MAIN.get(collection, { params: params })
}

export async function weekly(params) {
  return http.API_MAIN.get(`${collection}/weekly`, { params: params })
}

export async function month(params) {
  return http.API_MAIN.get(`${collection}/month`, { params: params })
}

export async function quarter(params) {
  return http.API_MAIN.get(`${collection}/quarter`, { params: params })
}

export async function year(params) {
  return http.API_MAIN.get(`${collection}/year`, { params: params })
}

export async function fiveYear(params) {
  return http.API_MAIN.get(`${collection}/five-year`, { params: params })
}
