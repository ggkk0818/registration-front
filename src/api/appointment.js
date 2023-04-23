import request from '@/utils/request'
const url = 'appointment'
/**
 * 查询预约列表
 * @param {*} params
 * @returns
 */
export function getAppointmentList (params) {
  return request({
    url: `${url}`,
    method: 'get',
    params: params
  })
}
/**
 * 查询预约详情
 * @param {*} id
 * @returns
 */
export function getAppointmentDetail (id) {
  return request({
    url: `${url}/${encodeURIComponent(id)}`,
    method: 'get'
  })
}
/**
 * 新增预约
 * @param {*} params
 * @returns
 */
export function addAppointment (params) {
  return request({
    url: `${url}`,
    method: 'post',
    data: params
  })
}
/**
 * 更新预约
 * @param {*} params
 * @returns
 */
export function updateAppointment (params) {
  return request({
    url: `${url}`,
    method: 'put',
    data: params
  })
}
/**
 * 删除预约
 * @param {*} id
 * @returns
 */
export function delAppointment (id) {
  return request({
    url: `${url}/${id}`,
    method: 'delete'
  })
}
/**
 * 发放号源
 * @returns
 */
export function createResource () {
  return request({
    url: `${url}/createResource`,
    method: 'post'
  })
}
