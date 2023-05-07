<template>
  <page-header-wrapper>
    <!-- 选择时间段 -->
    <template v-if="currentStep === APPOINTMENT_STEP.TIME">
      <a-card :bordered="false">
        <a-descriptions title="医生信息">
          <a-descriptions-item label="科室">{{ doctorData && doctorData.deptName }}</a-descriptions-item>
          <a-descriptions-item label="姓名">{{ doctorData && doctorData.realName }}</a-descriptions-item>
          <a-descriptions-item label="年龄">{{ doctorData && doctorData.age }}</a-descriptions-item>
          <a-descriptions-item label="性别">{{ doctorData && doctorData.gender }}</a-descriptions-item>
          <a-descriptions-item label="描述"> {{ doctorData && doctorData.description }}</a-descriptions-item>
        </a-descriptions>
      </a-card>
      <template v-if="isMobile">
        <a-descriptions class="mobile-title" title="预约时段" style="margin-top: 20px;"></a-descriptions>
        <mobile-table ref="table" :data="loadData" @click="lockResource"></mobile-table>
      </template>
      <a-card v-else :bordered="false" style="margin-top: 20px">
        <a-descriptions title="预约时段"></a-descriptions>
        <s-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :showPagination="false">
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <span slot="startTime" slot-scope="text">
            {{ text | moment('HH:mm') }}
          </span>
          <span slot="endTime" slot-scope="text">
            {{ text | moment('HH:mm') }}
          </span>
          <span slot="resourceCount" slot-scope="text">
            {{ text > 0 ? text : '暂无' }}
          </span>
          <span slot="action" slot-scope="text, record">
            <template>
              <a-button
                type="primary"
                :disabled="record.resourceCount < 1"
                @click="lockResource(record)"
              >预约</a-button
              >
            </template>
          </span>
        </s-table>
      </a-card>
    </template>
    <template v-else-if="currentStep === APPOINTMENT_STEP.CONFIRM">
      <a-card :bordered="false">
        <a-descriptions title="医生信息">
          <a-descriptions-item label="科室">{{ doctorData && doctorData.deptName }}</a-descriptions-item>
          <a-descriptions-item label="姓名">{{ doctorData && doctorData.realName }}</a-descriptions-item>
          <a-descriptions-item label="年龄">{{ doctorData && doctorData.age }}</a-descriptions-item>
          <a-descriptions-item label="性别">{{ doctorData && doctorData.gender }}</a-descriptions-item>
          <a-descriptions-item label="描述"> {{ doctorData && doctorData.description }}</a-descriptions-item>
        </a-descriptions>
        <a-descriptions title="预约信息">
          <a-descriptions-item label="患者姓名">{{ userInfo && userInfo.realName || '' }}</a-descriptions-item>
          <a-descriptions-item label="就诊时间">{{
            (appointmentData && appointmentData.diagnoseTime) | moment
          }}</a-descriptions-item>
        </a-descriptions>
      </a-card>
      <div class="btns">
        <a-button type="primary" :loading="isLoading" @click="deal">确认预约</a-button>
        <a-button style="margin-left: 8px" :disabled="isLoading" @click="prev">返回</a-button>
      </div>
    </template>
    <template v-else-if="currentStep === APPOINTMENT_STEP.RESULT">
      <a-card :bordered="false">
        <div class="result-info">
          <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
          <p class="msg">预约成功</p>
        </div>
        <a-divider style="margin: 32px 0" />
        <a-descriptions title="预约信息">
          <a-descriptions-item label="患者姓名">{{ userInfo && userInfo.realName || '' }}</a-descriptions-item>
          <a-descriptions-item label="就诊时间">{{
            (appointmentData && appointmentData.diagnoseTime) | moment
          }}</a-descriptions-item>
          <a-descriptions-item label="医生姓名">{{ doctorData && doctorData.realName }}</a-descriptions-item>
          <a-descriptions-item label="科室">{{ doctorData && doctorData.deptName }}</a-descriptions-item>
        </a-descriptions>
      </a-card>
      <div class="btns">
        <a-button type="primary" :loading="isLoading" @click="goMy">我的预约</a-button>
        <a-button style="margin-left: 8px" :disabled="isLoading" @click="back">返回</a-button>
      </div>
    </template>
  </page-header-wrapper>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDoctorResourceList } from '@/api/doctor'
import { prepare, deal } from '@/api/appointment'
import { STable, Ellipsis } from '@/components'
import MobileTable from './components/SourceMobileTable'
// 预约步骤
const APPOINTMENT_STEP = {
  TIME: 1, // 选择时间
  CONFIRM: 2, // 确认信息
  RESULT: 3 // 预约结果
}
const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    scopedSlots: { customRender: 'startTime' }
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    scopedSlots: { customRender: 'endTime' }
  },
  {
    title: '号源数量',
    dataIndex: 'resourceCount',
    scopedSlots: { customRender: 'resourceCount' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '220px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  components: {
    STable,
    Ellipsis,
    MobileTable
  },
  data () {
    return {
      APPOINTMENT_STEP,
      columns,
      isLoading: false,
      doctorData: null,
      resourceList: [],
      appointmentData: null,
      // 加载数据方法 必须为 Promise 对象
      loadData: () => {
        return Promise.resolve({ records: this.resourceList })
      },
      currentStep: APPOINTMENT_STEP.TIME
    }
  },
  computed: {
    ...mapGetters(['isMobile', 'userInfo'])
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
        if (this.$route.params.doctor) {
          this.doctorData = this.$route.params.doctor
        } else {
          const res = await getDoctorResourceList({ id: this.$route.params.id })
          this.doctorData = res?.records?.[0]
        }
        this.resourceList = this.doctorData?.resourceList || []
        if (this.$refs.table) {
          this.$refs.table.refresh()
        }
      } finally {
        this.isLoading = false
      }
    },
    // 锁定号源
    async lockResource (item) {
      const hide = this.$message.loading('正在查询号源..', 0)
      try {
        const params = { ...item }
        const data = await prepare(params)
        if (data) {
          this.appointmentData = data
          this.currentStep++
        } else {
          this.$message.error('服务器开小差了，稍后再试吧')
        }
      } finally {
        hide()
      }
    },
    // 预约挂号
    async deal () {
      const hide = this.$message.loading('正在预约..', 0)
      try {
        const params = { ...this.appointmentData }
        await deal(params)
        this.currentStep++
      } finally {
        hide()
      }
    },
    // 上一步
    prev () {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    // 返回
    back () {
      this.$router.back()
    },
    // 进入我的预约
    goMy () {
      this.$router.replace('/patient-appointment/list')
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
.mobile-title::v-deep {
  margin-top: 20px;
  .ant-descriptions-title {
    margin-bottom: 8px;
  }
}
.result-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 32px 0;
  .anticon {
    font-size: 48px;
  }
  .msg {
    text-align: center;
    font-size: 22px;
  }
}
.btns {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
