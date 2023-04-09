import request from '@/utils/request'
const url = 'patient'
/**
 * 查询患者列表
 * @param {*} params
 * @returns
 */
export function getPatientList (params) {
  return request({
    url: `${url}`,
    method: 'get',
    params: params
  })
}
/**
 * 查询患者详情
 * @param {*} id
 * @returns
 */
export function getPatientDetail (id) {
  return request({
    url: `${url}/${encodeURIComponent(id)}`,
    method: 'get'
  })
}
/**
 * 新增患者
 * @param {*} params
 * @returns
 */
export function addPatient (params) {
  return request({
    url: `${url}`,
    method: 'post',
    data: params
  })
}
/**
 * 更新患者
 * @param {*} params
 * @returns
 */
export function updatePatient (params) {
  return request({
    url: `${url}`,
    method: 'put',
    data: params
  })
}
/**
 * 删除患者
 * @param {*} id
 * @returns
 */
export function delPatient (id) {
  return request({
    url: `${url}/${id}`,
    method: 'delete'
  })
}
