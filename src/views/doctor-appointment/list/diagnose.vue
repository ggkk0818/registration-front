<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-skeleton active v-if="isLoading" />
      <template v-else-if="detailData">
        <a-descriptions title="预约信息">
          <a-descriptions-item label="患者姓名">{{ detailData.patientName || '' }}</a-descriptions-item>
          <a-descriptions-item label="就诊时间">{{ detailData.diagnoseTime | moment }}</a-descriptions-item>
          <a-descriptions-item label="医生姓名">{{ detailData.docName || '' }}</a-descriptions-item>
          <a-descriptions-item label="科室">{{ detailData.deptName || '' }}</a-descriptions-item>
          <a-descriptions-item label="状态">{{ detailData.status | statusFilter }}</a-descriptions-item>
        </a-descriptions>
        <a-divider style="margin: 20px 0" />
        <!-- 诊断表单 -->
        <a-form-model
          ref="form"
          :model="formData"
          :rules="formRules"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-form-model-item label="诊断信息" prop="diagnoseResult">
            <a-textarea
              rows="4"
              v-model="formData.diagnoseResult"
              placeholder="请输入诊断信息" />
          </a-form-model-item>
          <a-form-model-item :wrapperCol="{ span: 24 }" style="text-align: center">
            <a-button type="primary" :loading="isLoadingSubmit" @click="onSubmit">提交</a-button>
            <a-button style="margin-left: 8px" :disabled="isLoadingSubmit">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </template>
      <a-empty v-else />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getAppointmentDetail, diagnose } from '@/api/appointment'
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_MAP } from '@/utils/consts'
export default {
  data () {
    return {
      APPOINTMENT_STATUS,
      isLoading: false,
      isLoadingSubmit: false,
      detailData: null,
      qrcodeImg: null,
      formData: {
        diagnoseResult: ''
      },
      formRules: {
        diagnoseResult: [{ required: true, message: '请输入诊断信息' }]
      }
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
      this.isLoading = true
      try {
        const data = await getAppointmentDetail(this.$route.params.id)
        this.detailData = data || null
        if (data) {
          this.formData.diagnoseResult = data.diagnoseResult || ''
        }
      } finally {
        this.isLoading = false
      }
    },
    // 提交
    async onSubmit () {
      this.isLoadingSubmit = true
      try {
        const params = {
          ...this.formData,
          id: this.detailData.id
        }
        await diagnose(params)
        this.$message.success('操作成功')
        this.back()
      } finally {
        this.isLoadingSubmit = false
      }
    },
    back () {
      this.$router.back()
    }
  },
  filters: {
    statusFilter (type) {
      return APPOINTMENT_STATUS_MAP[type].text
    },
    statusTypeFilter (type) {
      return APPOINTMENT_STATUS_MAP[type].status
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
.qr-code {
  display: flex;
  align-items: center;
  flex-direction: column;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  p {
    margin: 0;
  }
  img {
    max-width: 100%;
  }
}
.hold-tips {
  padding: 20px;
  text-align: center;
  .anticon {
    margin-right: 8px;
  }
}
</style>
