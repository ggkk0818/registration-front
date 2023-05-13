<template>
  <a-dropdown v-if="currentUser && currentUser.nickName" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-avatar size="small" src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" class="antd-pro-global-header-index-avatar" />
      <span>{{ currentUser.nickName }}</span>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item v-if="menu && isAdmin" key="center" @click="handleToCenter">
          <a-icon type="dashboard" />
          工作台
        </a-menu-item>
        <a-menu-item v-if="menu && isDoctor" key="doctor" @click="handleToCenterDoctor">
          <a-icon type="dashboard" />
          工作台
        </a-menu-item>
        <a-menu-item v-if="menu && isPatient" key="doctor" @click="handleToAppointment">
          <a-icon type="snippets" />
          预约挂号
        </a-menu-item>
        <a-menu-item v-if="menu && isPatient" key="doctor" @click="handleToMy">
          <a-icon type="user" />
          我的预约
        </a-menu-item>
        <a-menu-divider v-if="menu" />
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />
          {{ $t('menu.account.logout') }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>
import { Modal } from 'ant-design-vue'
import router, { resetRouter } from '@/router'
import { USER_ROLE } from '@/utils/consts'

export default {
  name: 'AvatarDropdown',
  props: {
    currentUser: {
      type: Object,
      default: () => null
    },
    menu: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isAdmin () {
      return this.currentUser?.roleId === USER_ROLE.ADMIN
    },
    isDoctor () {
      return this.currentUser?.roleId === USER_ROLE.DOCTOR
    },
    isPatient () {
      return this.currentUser?.roleId === USER_ROLE.PATIENT
    }
  },
  methods: {
    handleToCenter () {
      this.$router.push({ path: '/dashboard/workplace' })
    },
    handleToCenterDoctor () {
      this.$router.push({ path: '/dashboard' })
    },
    handleToAppointment () {
      this.$router.push({ path: '/patient-appointment/doctor' })
    },
    handleToMy () {
      this.$router.push({ path: '/patient-appointment/list' })
    },
    handleLogout (e) {
      Modal.confirm({
        title: this.$t('layouts.usermenu.dialog.title'),
        content: this.$t('layouts.usermenu.dialog.content'),
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return this.$store.dispatch('Logout').then(() => {
            console.log('重置路由')
            resetRouter()
            router.hasDynamicRoute = false
            console.log('跳转登录')
            this.$router.push({ name: 'login' })
          })
        },
        onCancel () {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
