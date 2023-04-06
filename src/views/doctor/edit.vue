<template>
  <!-- hidden PageHeaderWrapper title demo -->
  <page-header-wrapper :title="isEdit ? '编辑医生' : '新增医生'">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form-model
        ref="form"
        :model="formData"
        :rules="formRules"
        :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-form-model-item label="所属科室" prop="deptId">
          <a-tree-select
            v-model="formData.deptId"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="departmentTreeData"
            placeholder="请选择上级科室"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-model-item>
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
          <a-select v-model="formData.gender" style="width: 120px">
            <a-select-option :value="0">其他</a-select-option>
            <a-select-option :value="1">男</a-select-option>
            <a-select-option :value="2">女</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="手机号" prop="mobile">
          <a-input v-model="formData.mobile" placeholder="请输入手机号" />
        </a-form-model-item>
        <a-form-model-item label="描述" prop="description">
          <a-input v-model="formData.description" placeholder="请输入描述" />
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
import { addDoctor, updateDoctor, getDoctorDetail } from '@/api/doctor'
import { getDepartmentTree } from '@/api/department'
const DEFAULT_VALUES = {
  id: null,
  deptId: null,
  name: '',
  password: '',
  realName: '',
  age: null,
  gender: null,
  mobile: '',
  description: ''
}
export default {
  name: 'DoctorEdit',
  data () {
    return {
      isLoading: false,
      formData: { ...DEFAULT_VALUES },
      formRules: {
        deptId: [{ required: true, message: '请选择所属科室' }],
        name: [{ required: true, message: '请输入用户名' }],
        password: [{ required: true, message: '请输入密码' }],
        realName: [{ required: true, message: '请输入姓名' }],
        age: [{ required: true, message: '请输入年龄' }],
        gender: [{ required: true, message: '请选择性别' }],
        mobile: [{ required: true, message: '请输入手机号' }]
      },
      detailData: null,
      departmentTreeData: []
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
  created () {
    this.getTreeData()
  },
  methods: {
    async init () {
      this.formData = { ...DEFAULT_VALUES }
      if (this.isEdit) {
        this.isLoading = true
        try {
          const data = await getDoctorDetail(this.$route.params.id)
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
    // 查询科室树
    async getTreeData () {
      const treeData = await getDepartmentTree()
      this.departmentTreeData = treeData || []
    },
    onSubmit (e) {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.isLoading = true
          try {
            if (this.isEdit) {
              await updateDoctor({ ...this.detailData, ...this.formData })
            } else {
              await addDoctor(this.formData)
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
