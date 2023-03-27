<template>
  <!-- hidden PageHeaderWrapper title demo -->
  <page-header-wrapper :title="isEdit ? '编辑用户' : '新增用户'">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form-model
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
        <a-form-model-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button type="primary" @click="onSubmit">提交</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
export default {
  name: 'BaseForm',
  data () {
    return {
      formData: {},
      formRules: {
        name: [{ required: true, message: '请输入用户名' }]
      },
      detailData: null
    }
  },
  computed: {
    isEdit ({ detailData }) {
      return !!detailData
    }
  },
  methods: {
    onSubmit (e) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
