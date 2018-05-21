import request from '../utils/request';
import API from "../utils/api";

export function getOssToken(kongfu_id) {
  return request(API + '/auth/sts/' + kongfu_id);
}
