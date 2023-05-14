import request from '@/utils/request'
const url = 'statistic'
/**
 * 查询报表数据
 * @param {*} params
 * @returns
 */
export function getStatisticList (params) {
  return request({
    url: `${url}/summary`,
    method: 'get',
    params: params
  })
}
