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
          :title="item.realName"
          :label="item.description"
          :is-link="item.resourceCount > 0"
          center
          @click="onClick(item)">
          <span slot="title">{{ item.realName }}<span class="date">{{ item.diagnoseDate | moment('YYYY-MM-DD') }}</span></span>
          {{ item.resourceCount > 0 ? '可预约' : '约满' }}
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
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
