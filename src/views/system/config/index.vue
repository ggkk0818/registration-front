<template>
  <page-header-wrapper title="系统配置">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form-model
        ref="form"
        :model="formData"
        :rules="formRules"
        :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-form-model-item label="放号时间" prop="generateTime">
          <a-time-picker v-model="formData.generateTime" placeholder="请选择时间" />
        </a-form-model-item>
        <a-form-model-item label="问诊结果通知接口" prop="password">
          <a-input v-model="formData.password" placeholder="请输入接口地址" />
        </a-form-model-item>
        <a-form-model-item label="候诊通知接口" prop="nickName">
          <a-input v-model="formData.nickName" placeholder="请输入接口地址" />
        </a-form-model-item>
        <a-form-model-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button type="primary" @click="onSubmit">提交</a-button>
          <a-button style="margin-left: 8px" @click="back">返回</a-button>
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
        generateTime: [{ required: true, message: '请选择放号时间' }]
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
    },
    back () {
      this.$router.back()
    }
  }
}
</script>
