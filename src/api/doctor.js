import request from '@/utils/request'
const url = 'doctor'
/**
 * 查询医生列表
 * @param {*} params
 * @returns
 */
export function getDoctorList (params) {
  return request({
    url: `${url}`,
    method: 'get',
    params: params
  })
}
/**
 * 查询医生详情
 * @param {*} id
 * @returns
 */
export function getDoctorDetail (id) {
  return request({
    url: `${url}/${encodeURIComponent(id)}`,
    method: 'get'
  })
}
/**
 * 新增医生
 * @param {*} params
 * @returns
 */
export function addDoctor (params) {
  return request({
    url: `${url}`,
    method: 'post',
    data: params
  })
}
/**
 * 更新医生
 * @param {*} params
 * @returns
 */
export function updateDoctor (params) {
  return request({
    url: `${url}`,
    method: 'put',
    data: params
  })
}
/**
 * 删除医生
 * @param {*} id
 * @returns
 */
export function delDoctor (id) {
  return request({
    url: `${url}/${id}`,
    method: 'delete'
  })
}
