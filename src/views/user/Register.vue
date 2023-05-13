<template>
  <div class="main user-layout-register">
    <h3>
      <span>{{ $t('user.register.register') }}</span>
    </h3>
    <a-form-model
      ref="form"
      :model="formData"
      :rules="formRules"
    >
      <a-form-model-item label="用户名" prop="name">
        <a-input v-model="formData.name" placeholder="请输入用户名" />
      </a-form-model-item>
      <a-form-model-item label="密码" prop="password">
        <a-input-password v-model="formData.password" placeholder="请输入密码" />
      </a-form-model-item>
      <a-form-model-item label="姓名" prop="realName">
        <a-input v-model="formData.realName" placeholder="请输入姓名" />
      </a-form-model-item>
      <a-form-model-item label="年龄" prop="age">
        <a-input v-model="formData.age" placeholder="请输入年龄" />
      </a-form-model-item>
      <a-form-model-item label="性别" prop="gender">
        <a-select v-model="formData.gender" placeholder="请选择性别" style="width: 120px">
          <a-select-option :value="0">其他</a-select-option>
          <a-select-option :value="1">男</a-select-option>
          <a-select-option :value="2">女</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="手机号" prop="mobile">
        <a-input v-model="formData.mobile" placeholder="请输入手机号" />
      </a-form-model-item>
      <a-form-model-item label="身份证号" prop="idCard">
        <a-input v-model="formData.idCard" placeholder="请输入身份证号" />
      </a-form-model-item>
      <a-form-item>
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="register-button"
          :loading="isLoading"
          @click.stop.prevent="onSubmit"
          :disabled="isLoading"
        >{{ $t('user.register.register') }}
        </a-button>
      </a-form-item>
      <div class="user-login-other">
        <router-link class="login" :to="{ name: 'login' }">{{ $t('user.register.sign-in') }}</router-link>
      </div>
    </a-form-model>
  </div>
</template>

<script>
import { register } from '@/api/login'
import { deviceMixin } from '@/store/device-mixin'

const DEFAULT_VALUES = {
  id: null,
  name: '',
  password: '',
  realName: '',
  age: null,
  gender: undefined,
  mobile: '',
  idCard: ''
}
export default {
  name: 'Register',
  components: {},
  mixins: [deviceMixin],
  data () {
    return {
      isLoading: false,
      formData: { ...DEFAULT_VALUES },
      formRules: {
        name: [{ required: true, message: '请输入用户名' }],
        password: [{ required: true, message: '请输入密码' }],
        realName: [{ required: true, message: '请输入姓名' }],
        age: [{ required: true, message: '请输入年龄' }],
        gender: [{ required: true, message: '请选择性别' }],
        mobile: [{ required: true, message: '请输入手机号' }],
        idCard: [{ required: true, message: '请输入身份证号' }]
      }
    }
  },
  methods: {
    onSubmit (e) {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.isLoading = true
          try {
              await register(this.formData)
            this.$message.success('注册成功')
            this.$router.replace({ name: 'login' })
          } finally {
            this.isLoading = false
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="less">
.user-register {
  &.error {
    color: #ff0000;
  }

  &.warning {
    color: #ff7e05;
  }

  &.success {
    color: #52c41a;
  }
}

.user-layout-register {
  .ant-input-group-addon:first-child {
    background-color: #fff;
  }
}
</style>
<style lang="less" scoped>
.user-layout-register {
  & > h3 {
    font-size: 16px;
    margin-bottom: 20px;
    text-align: center;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .register-button {
    width: 100%;
  }

  .login {
    float: right;
    line-height: 40px;
  }
}
.user-login-other {
  text-align: left;
  margin-top: 24px;
  line-height: 22px;

  .item-icon {
    font-size: 24px;
    color: rgba(0, 0, 0, 0.2);
    margin-left: 16px;
    vertical-align: middle;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #1890ff;
    }
  }

  .login {
    float: right;
  }
}
</style>
