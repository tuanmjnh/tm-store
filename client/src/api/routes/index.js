import * as http from '@/utils/http-client';
const collection = '/routes';

export function select(params) {
  return http.axiosApi.get(collection, { params });
}

export async function getMeta(params) {
  return http.axiosApiDebonce({
    method: 'get',
    params: params,
    url: `${collection}/get-meta`
  });
}

export async function insert(params) {
  return http.axiosApi.post(collection, params);
}

export async function update(params) {
  return http.axiosApi.put(collection, params);
}

export async function updateOrder(params) {
  return http.axiosApi.put(`${collection}/update-order`, params);
}

export async function lock(params) {
  return http.axiosApi.patch(collection, params);
}
