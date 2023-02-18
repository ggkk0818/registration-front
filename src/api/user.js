import request from '@/utils/request'

export function getUserList (paras) {
  return request({
    url: 'admin',
    method: 'get',
    params: paras
  })
}
