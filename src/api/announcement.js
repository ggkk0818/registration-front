import request from '@/utils/request'
const url = 'announcement'
/**
 * 查询公告列表
 * @param {*} params
 * @returns
 */
export function getAnnouncementList (params) {
  return request({
    url: `${url}`,
    method: 'get',
    params: params
  })
}
/**
 * 查询公告详情
 * @param {*} id
 * @returns
 */
export function getAnnouncementDetail (id) {
  return request({
    url: `${url}/${encodeURIComponent(id)}`,
    method: 'get'
  })
}
/**
 * 新增公告
 * @param {*} params
 * @returns
 */
export function addAnnouncement (params) {
  return request({
    url: `${url}`,
    method: 'post',
    data: params
  })
}
/**
 * 更新公告
 * @param {*} params
 * @returns
 */
export function updateAnnouncement (params) {
  return request({
    url: `${url}`,
    method: 'put',
    data: params
  })
}
/**
 * 删除公告
 * @param {*} id
 * @returns
 */
export function delAnnouncement (id) {
  return request({
    url: `${url}/${id}`,
    method: 'delete'
  })
}
