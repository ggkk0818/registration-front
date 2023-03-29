import request from '@/utils/request'
/**
 * 查询用户列表
 * @param {*} params
 * @returns
 */
export function getUserList (params) {
  return request({
    url: 'admin',
    method: 'get',
    params: params
  })
}
/**
 * 查询用户详情
 * @param {*} id
 * @returns
 */
export function getUserDetail (id) {
  return request({
    url: `admin/${encodeURIComponent(id)}`,
    method: 'get'
  })
}
/**
 * 新增用户
 * @param {*} params
 * @returns
 */
export function addUser (params) {
  return request({
    url: 'admin',
    method: 'post',
    data: params
  })
}
/**
 * 更新用户
 * @param {*} params
 * @returns
 */
export function updateUser (params) {
  return request({
    url: 'admin',
    method: 'put',
    data: params
  })
}
/**
 * 删除用户
 * @param {*} id
 * @returns
 */
export function delUser (id) {
  return request({
    url: `admin/${id}`,
    method: 'delete'
  })
}
