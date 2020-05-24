import * as http from '@/utils/http-client';
const collection = '/product-reports';

export async function date(params) {
  return http.axiosApi.get(collection, { params: params });
}

export async function weekly(params) {
  return http.axiosApi.get(`${collection}/weekly`, { params: params });
}

export async function month(params) {
  return http.axiosApi.get(`${collection}/month`, { params: params });
}

export async function quarter(params) {
  return http.axiosApi.get(`${collection}/quarter`, { params: params });
}

export async function year(params) {
  return http.axiosApi.get(`${collection}/year`, { params: params });
}

export async function fiveYear(params) {
  return http.axiosApi.get(`${collection}/five-year`, { params: params });
}
