<template>
  <!-- hidden PageHeaderWrapper title demo -->
  <page-header-wrapper :title="isEdit ? '编辑患者' : '新增患者'">
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
        <a-form-model-item label="密码" prop="password" :required="!isEdit">
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
        <a-form-model-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button type="primary" @click="onSubmit">提交</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { addPatient, updatePatient, getPatientDetail } from '@/api/patient'
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
  name: 'PatientEdit',
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
          const data = await getPatientDetail(this.$route.params.id)
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
              await updatePatient({ ...this.detailData, ...this.formData })
            } else {
              await addPatient(this.formData)
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
