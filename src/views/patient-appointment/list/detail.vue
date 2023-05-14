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
        <!-- 取消预约 -->
        <div
          class="actions"
          v-if="
            detailData.status !== APPOINTMENT_STATUS.DIAGNOSE_DONE && detailData.status !== APPOINTMENT_STATUS.CANCEL
          "
        >
          <a-button type="link" :disabled="isLoadingSubmit" @click="handleDel">取消预约</a-button>
        </div>
        <!-- 诊断结果 -->
        <div class="reseult" v-if="detailData.status === APPOINTMENT_STATUS.DIAGNOSE_DONE">
          <a-descriptions title="诊断结果"></a-descriptions>
          <pre>{{ detailData.diagnoseResult || '暂无' }}</pre>
        </div>
      </template>
      <a-empty v-else />
    </a-card>
    <div class="btns">
      <a-button type="primary" :disabled="isLoadingSubmit" @click="back">返回</a-button>
    </div>
    <van-action-sheet
      v-model="actionSheetVisible"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect"
    />
  </page-header-wrapper>
</template>

<script>
import { mapGetters } from 'vuex'
import QRCode from 'qrcode'
import { getAppointmentDetail, checkin, delAppointment } from '@/api/appointment'
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_MAP } from '@/utils/consts'
export default {
  data () {
    return {
      APPOINTMENT_STATUS,
      isLoading: false,
      isLoadingSubmit: false,
      detailData: null,
      qrcodeImg: null,
      actionSheetVisible: false, // 移动端取消预约面板开关
      actions: [{ code: 'remove', name: '取消预约', color: '#ee0a24' }]
    }
  },
  computed: {
    ...mapGetters(['isMobile']),
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
    },
    isMobile (val) {
      if (!val) {
        this.actionSheetVisible = false
      }
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
    },
    // 取消预约
    handleDel () {
      if (!this.detailData) {
        return
      }
      if (this.isMobile) {
        this.actionSheetVisible = true
      } else {
        this.$confirm({
          title: '提示',
          content: '是否确认取消？',
          onOk: () => {
            this.doCancel()
          }
        })
      }
    },
    onSelect (item) {
      if (item?.code === 'remove') {
        this.doCancel()
      }
    },
    doCancel () {
      delAppointment(this.detailData.id)
        .then(() => {
          this.$message.success('操作成功')
          this.init()
        })
        .finally(() => {
          this.isLoadingSubmit = true
        })
    },
    // 返回
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
  padding: 20px 20px 0;
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
.actions {
  text-align: center;
  .ant-btn-link {
    color: #f5222d;
  }
}
.result {
  padding: 20px;
}
.btns {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
