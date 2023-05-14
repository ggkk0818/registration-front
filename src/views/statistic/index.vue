<template>
  <div>
    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
        <a-tab-pane loading="true" tab="科室数量趋势" key="1">
          <chart-line :data="barData" title="科室总量" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-card :loading="loading" :bordered="false" title="报表明细" :style="{ marginTop: '24px' }">
      <div class="ant-table-wrapper">
        <a-table row-key="x" size="small" :columns="tableColumns" :dataSource="tableData" :pagination="{ pageSize: 5 }">
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
import { ChartLine } from '@/components'
import { getStatisticList } from '@/api/statistic'
export default {
  components: { ChartLine },
  data () {
    return {
      loading: false,
      barData: [
        { x: '04-01', y: 42 },
        { x: '04-02', y: 42 },
        { x: '04-03', y: 46 },
        { x: '04-04', y: 46 },
        { x: '04-05', y: 46 },
        { x: '04-06', y: 46 },
        { x: '04-07', y: 52 }
      ],
      tableColumns: [
        {
          dataIndex: 'x',
          title: '日期'
        },
        {
          dataIndex: 'y',
          title: '科室总量'
        },
        {
          dataIndex: 'increce',
          title: '新增数量'
        },
        {
          dataIndex: 'decrece',
          title: '流失数量'
        }
      ],
      tableData: [
        { x: '04-01', y: 42, increce: 0, decrece: 0 },
        { x: '04-02', y: 42, increce: 1, decrece: 1 },
        { x: '04-03', y: 46, increce: 4, decrece: 0 },
        { x: '04-04', y: 46, increce: 0, decrece: 0 },
        { x: '04-05', y: 46, increce: 0, decrece: 0 },
        { x: '04-06', y: 46, increce: 0, decrece: 0 },
        { x: '04-07', y: 52, increce: 6, decrece: 0 }
      ]
    }
  },
  methods: {
    // 查询图表数据
    getData () {
      this.isLoading = true
      getStatisticList()
        .then((data) => {
          const list = data || []
          this.barData = list.map((item) => ({ x: item.date, y: item.total }))
          this.tableData = list
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>

<style lang="less" scoped></style>
