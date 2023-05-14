import request from '@/utils/request'
/**
 * 查询公告列表
 * @param {*} params
 * @returns
 */
export function getPublicAnnouncementList (params) {
  return request({
    url: `public/announcement`,
    method: 'get',
    params: params
  })
}

export function getConfigList (params) {
  return request({
    url: `config/`,
    method: 'get',
    params: params
  })
}

export function saveConfig (params) {
  return request({
    url: `config/`,
    method: 'put',
    data: params
  })
}
