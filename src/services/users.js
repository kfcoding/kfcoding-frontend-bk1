import request from '../utils/request';

const API = 'http://192.168.1.100:8081';

export function currentUser() {
  return request(API + '/users/current', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });
}

export function getToken(code) {
  return request(API + '/auth?authType=github&code=' + code);
}

export function getMyKongfu() {
  return request(API + '/users/' + localStorage.getItem('uid') + '/kongfu', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });
}
