import request from '../utils/request';
import API from "../utils/api";


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
