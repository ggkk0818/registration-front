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
 * 患者查询我的预约
 * @param {*} params
 * @returns
 */
export function getPatientAppointmentList (params) {
  return request({
    url: `${url}/my`,
    method: 'get',
    params: params
  })
}
/**
 * 医生查询患者预约
 * @param {*} params
 * @returns
 */
export function getDoctorAppointmentList (params) {
  return request({
    url: `${url}/patient`,
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
/**
 * 预约前锁定号源
 * @param {*} params
 * @returns
 */
export function prepare (params) {
  return request({
    url: `${url}/prepare`,
    method: 'post',
    data: params
  })
}
/**
 * 预约号源
 * @param {*} params
 * @returns
 */
export function deal (params) {
  return request({
    url: `${url}/deal`,
    method: 'post',
    data: params
  })
}
/**
 * 患者候诊
 * @param {*} id
 * @returns
 */
export function checkin (id) {
  return request({
    url: `${url}/checkin`,
    method: 'post',
    data: { id }
  })
}
/**
 * 医生诊断
 * @param {*} params
 * @returns
 */
export function diagnose (params) {
  return request({
    url: `${url}/diagnose`,
    method: 'post',
    data: params
  })
}
