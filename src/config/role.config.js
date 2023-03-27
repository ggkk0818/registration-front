export const AdminRole = {
  id: 'admin',
  name: '管理员',
  describe: '拥有所有权限',
  permissions: [{
    roleId: 'admin',
    permissionId: 'dashboard',
    permissionName: '仪表盘',
    actionEntitySet: [],
    actionList: ['add', 'query', 'get', 'update', 'delete']
  }, {
    roleId: 'admin',
    permissionId: 'exception',
    permissionName: '异常页面权限',
    actionEntitySet: [],
    actionList: ['add', 'query', 'get', 'update', 'delete']
  }, {
    roleId: 'admin',
    permissionId: 'result',
    permissionName: '结果权限',
    actionEntitySet: [],
    actionList: ['add', 'query', 'get', 'update', 'delete']
  }, {
    roleId: 'admin',
    permissionId: 'profile',
    permissionName: '详细页权限',
    actionEntitySet: [],
    actionList: ['add', 'query', 'get', 'update', 'delete']
  }, {
    roleId: 'admin',
    permissionId: 'table',
    permissionName: '表格权限',
    actionEntitySet: [],
    actionList: ['add', 'query', 'get', 'update', 'delete']
  }, {
    roleId: 'admin',
    permissionId: 'form',
    permissionName: '表单权限',
    actionEntitySet: [],
    actionList: ['add', 'query', 'get', 'update', 'delete']
  }, {
    roleId: 'admin',
    permissionId: 'order',
    permissionName: '订单管理',
    actionEntitySet: [],
    actionList: ['add', 'query', 'get', 'update', 'delete']
  }, {
    roleId: 'admin',
    permissionId: 'permission',
    permissionName: '权限管理',
    actionEntitySet: [],
    actionList: ['add', 'query', 'get', 'update', 'delete']
  }, {
    roleId: 'admin',
    permissionId: 'role',
    permissionName: '角色管理',
    actionEntitySet: [],
    actionList: ['add', 'query', 'get', 'update', 'delete']
  }, {
    roleId: 'admin',
    permissionId: 'table',
    permissionName: '桌子管理',
    actionEntitySet: [],
    actionList: ['add', 'query', 'get', 'update', 'delete']
  }, {
    roleId: 'admin',
    permissionId: 'system',
    permissionName: '系统管理',
    actionEntitySet: [],
    actionList: ['add', 'query', 'get', 'update', 'delete']
  }, {
    roleId: 'admin',
    permissionId: 'user',
    permissionName: '用户管理',
    actionEntitySet: [],
    actionList: ['add', 'query', 'get', 'update', 'delete']
  }]
}
