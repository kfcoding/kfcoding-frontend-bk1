import request from '../utils/request';

const API = 'http://192.168.1.109:8081';

export function query() {
  return request('/api/users');
}
