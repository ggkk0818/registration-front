<template>
  <div class="table-wrapper">
    <van-pull-refresh v-model="isRefresh" @refresh="refresh">
      <van-list
        v-model="isLoading"
        :finished="isFinish"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          v-for="(item, index) in dataList"
          :key="index"
          :title="formatDate(item)"
          :label="'剩余号源：' + item.resourceCount"
          center>
          <a-button
            type="primary"
            :disabled="item.resourceCount < 1"
            @click="onClick(item)"
          >预约</a-button
          >
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { formatDate } from '@/utils/util'
export default {
  props: {
    data: {
      type: Function,
      default: null
    },
    showPagination: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isRefresh: false,
      isLoading: false,
      isFinish: false,
      dataList: [],
      pageNo: 1,
      pageSize: 20,
      total: 0
    }
  },
  created () {
    this.refresh()
  },
  methods: {
    async onLoad () {
      if (!this.data) {
        this.isLoading = false
        this.isFinish = true
        return
      }
      try {
        const params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        const res = await this.data(params)
        const list = res?.records || []
        this.total = res?.total || 0
        this.dataList = this.pageNo <= 1 ? list : this.dataList.concat(list)
        this.isFinish = !this.showPagination || this.dataList.length >= this.total
      } catch (err) {
        this.isFinish = true
      } finally {
        this.isLoading = false
      }
    },
    refresh () {
      this.pageNo = 1
      this.dataList = []
      this.isRefresh = false
      this.isFinish = false
      this.isLoading = true
      this.onLoad()
    },
    onClick (item) {
      this.$emit('click', item)
    },
    formatDate (item) {
      return `${formatDate(item.startTime, 'HH:mm')} - ${formatDate(item.endTime, 'HH:mm')}`
    }
  }
}
</script>

<style lang="less" scoped>
.van-pull-refresh {
  overflow: visible;
}
.date {
  padding-left: 8px;
  color: #969799;
}
</style>
