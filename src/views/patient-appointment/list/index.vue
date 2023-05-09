<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="医生姓名">
                <a-input v-model="queryParam.docName" style="width: 100%" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择" allow-clear>
                  <a-select-option :value="item.value" v-for="(item, index) of APPOINTMENT_STATUS_LIST" :key="index">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :class="isMobile ? 'is-mobile' : ''"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        v-if="!isMobile"
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="remark" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="dateTime" slot-scope="text">
          {{ text | moment }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleView(record)">查看</a>
            <template v-if="record.status !== APPOINTMENT_STATUS.DIAGNOSE_DONE">
              <a-divider type="vertical" />
              <a :disabled="record.status === APPOINTMENT_STATUS.CANCEL" @click="handleDel(record)">取消</a>
            </template>
          </template>
        </span>
      </s-table>
    </a-card>
    <mobile-table
      v-if="isMobile"
      ref="table"
      :data="loadData"
      style="margin-top: 20px"
      @click="handleView"
    ></mobile-table>
  </page-header-wrapper>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import MobileTable from './components/MobileTable'
import { getPatientAppointmentList, delAppointment } from '@/api/appointment'
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_LIST, APPOINTMENT_STATUS_MAP } from '@/utils/consts'
const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '医生姓名',
    dataIndex: 'docName'
  },
  {
    title: '科室',
    dataIndex: 'deptName'
  },
  {
    title: '就诊时间',
    dataIndex: 'diagnoseTime',
    scopedSlots: { customRender: 'dateTime' }
  },
  {
    title: '诊断结果',
    dataIndex: 'diagnoseResult',
    scopedSlots: { customRender: 'diagnoseResult' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    scopedSlots: { customRender: 'dateTime' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '220px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'PatientAppointmentList',
  components: {
    STable,
    Ellipsis,
    MobileTable
  },
  data () {
    this.columns = columns
    return {
      APPOINTMENT_STATUS,
      APPOINTMENT_STATUS_LIST,
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getPatientAppointmentList(requestParameters)
      },
      selectedRowKeys: [],
      selectedRows: [],
      actionSheetVisible: false, // 移动端取消预约面板开关
      actionSheetData: null, // 当前取消预约记录
      actions: [{ code: 'remove', name: '取消预约', color: '#ee0a24' }]
    }
  },
  computed: {
    ...mapGetters(['isMobile']),
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleAdd () {
      this.$router.push({ path: `${this.$route.path}/add` })
    },
    handleEdit (record) {
      this.$router.push({ path: `${this.$route.path}/edit/${record.id}` })
    },
    handleView (record) {
      this.$router.push({ path: `${this.$route.path}/detail/${record.id}` })
    },
    handleDel (record) {
      if (this.isMobile) {
        this.actionSheetVisible = true
      } else {
        this.$confirm({
          title: '提示',
          content: '是否确认取消？',
          onOk: () => {
            this.doCancel(record)
          }
        })
      }
    },
    onSelect (item) {
      if (item?.code === 'remove') {
        this.doCancel(this.actionSheetData)
      }
    },
    doCancel (record) {
      delAppointment(record.id).then(() => {
        this.$message.success('操作成功')
        this.$refs.table.refresh()
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
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
.table-page-search-submitButtons.is-mobile {
  margin-bottom: 0;
}
</style>
