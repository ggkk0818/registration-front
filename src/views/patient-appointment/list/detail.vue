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
        <!-- 候诊二维码 -->
        <div class="qr-code" v-if="detailData.status === APPOINTMENT_STATUS.RESERVED">
          <p>请在分诊时出示此二维码</p>
          <img :src="qrcodeImg" />
          <a-button type="link" :disabled="isLoadingSubmit" @click="checkIn">手动签到</a-button>
        </div>
        <!-- 候诊提示 -->
        <div class="hold-tips" v-if="detailData.status === APPOINTMENT_STATUS.DIAGNOSE_HOLD">
          <p><a-icon type="info-circle" />请等待医生叫号</p>
        </div>
      </template>
      <a-empty v-else />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import QRCode from 'qrcode'
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
        if (data) {
          // 使用预约id生成二维码
          QRCode.toDataURL(data.id, { width: 300, margin: 1 }, (err, url) => {
            console.log('生成二维码', err, url)
            this.qrcodeImg = url
          })
        }
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
