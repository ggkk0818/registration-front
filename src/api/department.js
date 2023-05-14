import request from '@/utils/request'
const url = 'department'
/**
 * 查询科室列表
 * @param {*} params
 * @returns
 */
export function getDepartmentList (params) {
  return request({
    url: `${url}`,
    method: 'get',
    params: params
  })
}
/**
 * 查询科室详情
 * @param {*} id
 * @returns
 */
export function getDepartmentDetail (id) {
  return request({
    url: `${url}/${encodeURIComponent(id)}`,
    method: 'get'
  })
}
/**
 * 新增科室
 * @param {*} params
 * @returns
 */
export function addDepartment (params) {
  return request({
    url: `${url}`,
    method: 'post',
    data: params
  })
}
/**
 * 更新科室
 * @param {*} params
 * @returns
 */
export function updateDepartment (params) {
  return request({
    url: `${url}`,
    method: 'put',
    data: params
  })
}
/**
 * 删除科室
 * @param {*} id
 * @returns
 */
export function delDepartment (id) {
  return request({
    url: `${url}/${id}`,
    method: 'delete'
  })
}
/**
 * 获取部门树
 * @returns
 */
export function getDepartmentTree () {
  return request({
    url: `${url}/all`,
    method: 'get'
  }).then(data => {
    const treeList = []
    if (data && data.length) {
      const nodeMap = data.reduce((obj, item) => {
        if (item.id != null) {
          obj[item.id] = item
        }
        return obj
      }, {})
      data.forEach(item => {
        item.title = item.name
        item.key = String(item.id)
        item.value = item.id
        item.children = []
      })
      data.forEach(item => {
        const pid = item.parentId
        const parent = nodeMap[pid]
        if (pid == null || !parent) {
          treeList.push(item)
        } else {
          parent.children.push(item)
        }
      })
    }
    return treeList
  })
}
