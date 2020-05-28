import * as http from '@/utils/http-client';
const collection = '/store-imports';

export async function select(params) {
  return http.axiosApi.get(collection, params);
}

export async function finds(params) {
  return http.axiosApi.post(collection, params);
}

export async function imports(params) {
  return http.axiosApi.put(collection, params);
}
