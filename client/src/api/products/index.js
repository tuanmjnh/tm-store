import * as http from '@/utils/http-client';
const collection = '/products';

export async function select(params) {
  return http.axiosApi.get(collection, { params });
}

export async function find(params) {
  return http.axiosApi.get(`${collection}/find`, { params });
}

export async function exist(params) {
  return http.axiosApi.get(`${collection}/exist`, { params });
}

export async function getAttr(params) {
  return http.axiosApiDebonce({
    method: 'get',
    params: params,
    url: `${collection}/get-attr`
  });
}

export async function insert(params) {
  return http.axiosApi.post(collection, params);
}

export async function update(params) {
  return http.axiosApi.put(collection, params);
}

export async function lock(params) {
  return http.axiosApi.patch(collection, params);
}

export async function loadFileImport(params) {
  return http.axiosApi.post(`${collection}/load-file-import`, params);
}

export async function finds(params) {
  return http.axiosApi.post(`${collection}/finds`, params);
}

export async function imports(params) {
  return http.axiosApi.post(`${collection}/imports`, params);
}
