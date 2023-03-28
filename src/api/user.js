import request from '@/utils/request'
/**
 * 查询用户列表
 * @param {*} paras
 * @returns
 */
export function getUserList (paras) {
  return request({
    url: 'admin',
    method: 'get',
    params: paras
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
