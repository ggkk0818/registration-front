<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="医生姓名">
                <a-input v-model="queryParam.name" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
                <!-- <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a> -->
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
        <span slot="description" slot-scope="text">
          <ellipsis :length="12" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="diagnoseDate" slot-scope="text">
          {{ text | moment('YYYY-MM-DD') }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleView(record)">预约</a>
          </template>
        </span>
      </s-table>
    </a-card>
    <mobile-table v-if="isMobile" ref="table" :data="loadData" style="margin-top: 20px;" @click="handleView"></mobile-table>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { STable, Ellipsis } from '@/components'
import MobileTable from './components/DocMobileTable'
import { getDoctorResourceList } from '@/api/doctor'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '医生姓名',
    dataIndex: 'realName'
  },
  {
    title: '描述',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '剩余号源',
    dataIndex: 'resourceCount'
  },
  {
    title: '日期',
    dataIndex: 'diagnoseDate',
    scopedSlots: { customRender: 'diagnoseDate' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '220px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'DoctorResourceList',
  components: {
    STable,
    Ellipsis,
    MobileTable
  },
  data () {
    this.columns = columns
    return {
      // create model
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
        return getDoctorResourceList(requestParameters)
      },
      selectedRowKeys: [],
      selectedRows: []
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
    handleView (record) {
      this.$router.push({ path: `${this.$route.path}/deal/${record.id}` })
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
  }
}
</script>
