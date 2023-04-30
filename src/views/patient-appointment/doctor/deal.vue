<template>
  <page-header-wrapper>
    <!-- 选择时间段 -->
    <template v-if="currentStep === APPOINTMENT_STEP.TIME">
      <a-card :bordered="false">
        <a-descriptions title="医生信息">
          <a-descriptions-item label="用户名">{{ doctorData && doctorData.name }}</a-descriptions-item>
          <a-descriptions-item label="姓名">{{ doctorData && doctorData.realName }}</a-descriptions-item>
          <a-descriptions-item label="年龄">{{ doctorData && doctorData.age }}</a-descriptions-item>
          <a-descriptions-item label="性别">{{ doctorData && doctorData.gender }}</a-descriptions-item>
          <a-descriptions-item label="描述"> {{ doctorData && doctorData.description }}</a-descriptions-item>
        </a-descriptions>
      </a-card>
      <a-card :bordered="false">
        <s-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :showPagination="false"
        >
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <span slot="startTime" slot-scope="text">
            {{ text | moment('MM-DD HH:mm') }}
          </span>
          <span slot="endTime" slot-scope="text">
            {{ text | moment('MM-DD HH:mm') }}
          </span>
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handleView(record)">预约</a>
            </template>
          </span>
        </s-table>
      </a-card>
    </template>
    <template v-else-if="currentStep === APPOINTMENT_STEP.CONFIRM">

    </template>
    <template v-else-if="currentStep === APPOINTMENT_STEP.RESULT">
      <a-card :bordered="false">
        <div class="result-info">
          <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
          <p class="msg">预约成功</p>
        </div>
        <a-divider style="margin: 32px 0"/>
        <a-descriptions title="预约信息">
          <a-descriptions-item label="患者姓名">张三</a-descriptions-item>
          <a-descriptions-item label="就诊时间">2023-04-23 08:00:00</a-descriptions-item>
          <a-descriptions-item label="医生姓名">陈医生</a-descriptions-item>
          <a-descriptions-item label="科室">外科</a-descriptions-item>
        </a-descriptions>
      </a-card>
    </template>
  </page-header-wrapper>
</template>

<script>
import { getDoctorResourceList } from '@/api/doctor'
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
    title: '操作',
    dataIndex: 'action',
    width: '220px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data () {
    return {
      APPOINTMENT_STEP,
      columns,
      isLoading: false,
      doctorData: null,
      scheduleList: [],
      appointmentData: null,
      // 加载数据方法 必须为 Promise 对象
      loadData: () => {
        return Promise.resolve({ records: this.scheduleList })
      },
      currentStep: APPOINTMENT_STEP.DOCTOR
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
        if (this.$route.params.doctor) {
          this.doctorData = this.$route.params.doctor
        } else {
          const res = await getDoctorResourceList({ query: { id: this.$route.params.id } })
          this.doctorData = res?.records?.[0]
        }
        this.scheduleList = this.doctorData?.scheduleList || []
      } finally {
        this.isLoading = false
      }
    },
    back () {
      this.$router.back()
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
</style>
