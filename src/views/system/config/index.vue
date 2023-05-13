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
          <a-time-picker v-model="formData.generateTime" placeholder="请选择时间" format="HH:mm" />
        </a-form-model-item>
        <a-form-model-item label="问诊结果通知接口" prop="notifyApiUrl">
          <a-input v-model="formData.notifyApiUrl" placeholder="请输入接口地址" />
        </a-form-model-item>
        <a-form-model-item label="候诊通知接口" prop="holdApiUrl">
          <a-input v-model="formData.holdApiUrl" placeholder="请输入接口地址" />
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
import { getConfigList, saveConfig } from '@/api/system'
import moment from 'moment'
const DEFAULT_VALUES = {
  generateTime: null,
  notifyApiUrl: '',
  holdApiUrl: ''
}
export default {
  name: 'SystemConfig',
  data () {
    return {
      moment,
      isLoading: false,
      formData: { ...DEFAULT_VALUES },
      formRules: {
        generateTime: [{ required: true, message: '请选择放号时间' }]
      },
      detailData: null
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
      this.isLoading = true
      try {
        const res = await getConfigList()
        const config = (res || []).reduce((conf, item) => {
          conf[item.confCode] = item.confValue
          return conf
        }, {})
        this.formData.generateTime = config?.generateTime
        this.formData.notifyApiUrl = config?.notifyApiUrl
        this.formData.holdApiUrl = config?.holdApiUrl
      } finally {
        this.isLoading = false
      }
    },
    onSubmit (e) {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.isLoading = true
          try {
            const configList = Object.entries(this.formData).reduce((arr, entry) => {
              arr.push({
                confCode: entry[0],
                confValue: entry[1]
              })
              return arr
            }, [])
            await saveConfig({ configList })
            this.$message.success('操作成功')
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
