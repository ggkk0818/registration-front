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
        <div class="reseult">
          <a-descriptions title="诊断结果"></a-descriptions>
          <pre>{{ detailData.diagnoseResult || '暂无' }}</pre>
        </div>
      </template>
      <a-empty v-else />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getAppointmentDetail, checkin } from '@/api/appointment'
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_MAP } from '@/utils/consts'
export default {
  data () {
    return {
      APPOINTMENT_STATUS,
      isLoading: false,
      isLoadingSubmit: false,
      detailData: null,
      qrcodeImg: null
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
      } finally {
        this.isLoading = false
      }
    },
    async checkIn () {
      this.isLoadingSubmit = true
      try {
        await checkin(this.detailData.id)
        this.$message.success('操作成功')
        this.init()
      } finally {
        this.isLoadingSubmit = false
      }
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
.result {
  padding: 20px;
}
</style>
