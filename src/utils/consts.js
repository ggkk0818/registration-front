// 登录类型
export const LOGIN_TYPE = {
  PATIENT: 1, // 患者
  ADMIN: 2 // 管理员&医生
}
// 公告类型
export const ANNOUNCEMENT_TYPE = {
  SYSTEM: 1, // 系统
  DEPARTMENT: 2, // 科室
  DOCTOR: 3 // 医生
}
// 用户角色
export const USER_ROLE = {
  PATIENT: 'patient', // 患者
  DOCTOR: 'doctor', // 医生
  ADMIN: 'admin' // 管理员
}
// 号源状态
export const APPOINTMENT_STATUS = {
  LOCK: 0, // 锁定号源
  RESERVED: 1, // 预约成功
  DIAGNOSE_HOLD: 2, // 候诊
  DIAGNOSE_DONE: 3, // 诊断完成
  CANCEL: 4 // 已取消
}
export const APPOINTMENT_STATUS_LIST = [
  {
    status: 'warning',
    text: '待确认',
    value: APPOINTMENT_STATUS.LOCK
  }, {
    status: 'success',
    text: '预约成功',
    value: APPOINTMENT_STATUS.RESERVED
  }, {
    status: 'processing',
    text: '候诊',
    value: APPOINTMENT_STATUS.DIAGNOSE_HOLD
  }, {
    status: 'default',
    text: '已完成',
    value: APPOINTMENT_STATUS.DIAGNOSE_DONE
  }, {
    status: 'default',
    text: '已取消',
    value: APPOINTMENT_STATUS.CANCEL
  }
]
export const APPOINTMENT_STATUS_MAP = APPOINTMENT_STATUS_LIST.reduce((map, item) => {
  map[item.value] = item
  return map
}, {})
// 性别
export const GENDER_TYPE = {
  OTHER: 0,
  MALE: 1,
  FEMALE: 2
}
export const GENDER_TYPE_LIST = [
  {
    text: '其他',
    value: GENDER_TYPE.OTHER
  },
  {
    text: '男',
    value: GENDER_TYPE.MALE
  },
  {
    text: '女',
    value: GENDER_TYPE.FEMALE
  }
]
export const GENDER_TYPE_MAP = GENDER_TYPE_LIST.reduce((map, item) => {
  map[item.value] = item
  return map
}, {})
