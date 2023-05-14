<template>
  <!-- hidden PageHeaderWrapper title demo -->
  <page-header-wrapper :title="isEdit ? '编辑用户' : '新增用户'">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form-model
        ref="form"
        :model="formData"
        :rules="formRules"
        :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-form-model-item label="用户名" prop="name">
          <a-input v-model="formData.name" placeholder="请输入用户名" />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="password">
          <a-input-password v-model="formData.password" placeholder="请输入密码" />
        </a-form-model-item>
        <a-form-model-item label="昵称" prop="nickName">
          <a-input v-model="formData.nickName" placeholder="请输入昵称" />
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email">
          <a-input v-model="formData.email" placeholder="请输入邮箱" />
        </a-form-model-item>
        <a-form-model-item label="手机号" prop="mobile">
          <a-input v-model="formData.mobile" placeholder="请输入手机号" />
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remark">
          <a-input v-model="formData.remark" placeholder="请输入备注" />
        </a-form-model-item>
        <a-form-model-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button type="primary" @click="onSubmit">提交</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { addUser, updateUser, getUserDetail } from '@/api/user'
const DEFAULT_VALUES = {
  id: null,
  name: '',
  password: '',
  nickName: '',
  email: '',
  mobile: '',
  remark: ''
}
export default {
  name: 'UserEdit',
  data () {
    return {
      isLoading: false,
      formData: { ...DEFAULT_VALUES },
      formRules: {
        name: [{ required: true, message: '请输入用户名' }]
      },
      detailData: null
    }
  },
  computed: {
    isEdit ({ $route }) {
      return !!$route.params.id
    }
  },
  watch: {
    $route: {
      handler () {
        this.init()
      },
      immediate: true
    }
  },
  methods: {
    async init () {
      this.formData = { ...DEFAULT_VALUES }
      if (this.isEdit) {
        this.isLoading = true
        try {
          const data = await getUserDetail(this.$route.params.id)
          this.detailData = data || null
          if (data) {
            Object.keys(DEFAULT_VALUES).forEach((key) => {
              if (data[key] != null) {
                this.formData[key] = data[key]
              }
            })
          }
        } finally {
          this.isLoading = false
        }
      }
    },
    onSubmit (e) {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.isLoading = true
          try {
            if (this.isEdit) {
              await updateUser({ ...this.detailData, ...this.formData })
            } else {
              await addUser(this.formData)
            }
            this.$message.success('操作成功')
            this.$router.back()
          } finally {
            this.isLoading = false
          }
        } else {
          return false
        }
      })
    },
    resetForm () {
      this.$refs.form.resetFields()
    }
  }
}
</script>
