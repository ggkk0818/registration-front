<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-descriptions title="医生信息">
        <a-descriptions-item label="用户名">{{ detailData && detailData.name }}</a-descriptions-item>
        <a-descriptions-item label="姓名">{{ detailData && detailData.realName }}</a-descriptions-item>
        <a-descriptions-item label="年龄">{{ detailData && detailData.age }}</a-descriptions-item>
        <a-descriptions-item label="性别">{{ detailData && detailData.gender }}</a-descriptions-item>
        <a-descriptions-item label="手机号">{{ detailData && detailData.mobile }}</a-descriptions-item>
        <a-descriptions-item label="描述"> {{ detailData && detailData.description }}</a-descriptions-item>
      </a-descriptions>
      <a-descriptions title="排班信息" style="margin-top: 20px"> </a-descriptions>
      <a-table bordered row-key="rowTitle" :data-source="tableData" :columns="tableColumns" :pagination="false">
        <template slot="schedule" slot-scope="text">
          <ScheduleTableCell v-model="text.value" />
        </template>
      </a-table>
      <div class="btns">
        <a-button type="primary" :loading="isLoading" @click="onSubmit">提交</a-button>
        <a-button style="margin-left: 8px" :disabled="isLoading" @click="back">返回</a-button>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getDoctorDetail, updateSchedule } from '@/api/doctor'
import ScheduleTableCell from './components/ScheduleTableCell'
import moment from 'moment'
const columns = [
  {
    dataIndex: 'week01',
    title: '周一',
    dayOfWeek: 1,
    width: '12.5%',
    align: 'center',
    scopedSlots: { customRender: 'schedule' }
  },
  {
    dataIndex: 'week02',
    title: '周二',
    dayOfWeek: 2,
    width: '12.5%',
    align: 'center',
    scopedSlots: { customRender: 'schedule' }
  },
  {
    dataIndex: 'week03',
    title: '周三',
    dayOfWeek: 3,
    width: '12.5%',
    align: 'center',
    scopedSlots: { customRender: 'schedule' }
  },
  {
    dataIndex: 'week04',
    title: '周四',
    dayOfWeek: 4,
    width: '12.5%',
    align: 'center',
    scopedSlots: { customRender: 'schedule' }
  },
  {
    dataIndex: 'week05',
    title: '周五',
    dayOfWeek: 5,
    width: '12.5%',
    align: 'center',
    scopedSlots: { customRender: 'schedule' }
  },
  {
    dataIndex: 'week06',
    title: '周六',
    dayOfWeek: 6,
    width: '12.5%',
    align: 'center',
    scopedSlots: { customRender: 'schedule' }
  },
  {
    dataIndex: 'week07',
    title: '周日',
    dayOfWeek: 7,
    width: '12.5%',
    align: 'center',
    scopedSlots: { customRender: 'schedule' }
  }
]
export default {
  components: { ScheduleTableCell },
  data () {
    return {
      isLoading: false,
      detailData: null,
      tableData: [],
      tableColumns: [
        {
          dataIndex: 'rowTitle',
          title: '时间'
        },
        ...columns
      ]
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
        const data = await getDoctorDetail(this.$route.params.id)
        this.detailData = data || null
        this.buildTableData(data?.scheduleList || [])
      } finally {
        this.isLoading = false
      }
    },
    // 生成排班表格数据
    buildTableData (scheduleList) {
      const arr = []
      const startTime = moment('2020-01-01 08:00:00')
      for (let i = 0; i < 20; i++) {
        const endTime = startTime.clone().add(30, 'minutes')
        const row = {
          docId: this.$route.params.id,
          startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
          endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
          rowTitle: startTime.format('HH:mm') + ' - ' + endTime.format('HH:mm')
        }
        columns.forEach((col) => {
          const colummData = { ...col, value: null }
          // 从已有排班数据中查找当前时间段与日期的排班信息
          const schedule = scheduleList.find((item) => {
            return startTime.isSame(item.startTime) && item.dayOfWeek === col.dayOfWeek
          })
          if (schedule) {
            colummData.value = schedule.resourceCount
          }
          row[col.dataIndex] = colummData
        })
        arr.push(row)
        startTime.add(30, 'minutes')
      }
      this.tableData = arr
    },
    async onSubmit () {
      this.isLoading = true
      try {
        const list = []
        this.tableData.forEach((row) => {
          const { docId, startTime, endTime } = row
          columns.forEach((col) => {
            const { dataIndex, dayOfWeek } = col
            const colData = row[dataIndex] || {}
            if (colData.value != null && String(colData.value).length > 0) {
              list.push({
                docId,
                startTime,
                endTime,
                dayOfWeek,
                resourceCount: colData.value
              })
            }
          })
        })
        await updateSchedule({ docId: this.$route.params.id, scheduleList: list })
        this.$message.success('操作成功')
        this.$router.back()
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
.btns {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
