<template>
  <page-header-wrapper :title="isEdit ? '编辑科室' : '新增科室'">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form-model
        ref="form"
        :model="formData"
        :rules="formRules"
        :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-form-model-item label="上级科室" prop="parentId">
          <a-tree-select
            v-model="formData.parentId"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="departmentTreeData"
            placeholder="请选择上级科室"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="科室名称" prop="name">
          <a-input v-model="formData.name" placeholder="请输入科室名称" />
        </a-form-model-item>
        <a-form-model-item label="科室描述" prop="description">
          <a-input v-model="formData.description" placeholder="请输入科室描述" />
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
import { addDepartment, updateDepartment, getDepartmentDetail, getDepartmentTree } from '@/api/department'
const DEFAULT_VALUES = {
  id: null,
  parentId: null,
  name: '',
  description: ''
}
export default {
  name: 'DepartmentEdit',
  data () {
    return {
      isLoading: false,
      formData: { ...DEFAULT_VALUES },
      formRules: {
        name: [{ required: true, message: '请输入部门名称' }]
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
          const data = await getDepartmentDetail(this.$route.params.id)
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
              await updateDepartment({ ...this.detailData, ...this.formData })
            } else {
              await addDepartment(this.formData)
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
