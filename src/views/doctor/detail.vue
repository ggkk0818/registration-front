<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-descriptions title="用户信息">
        <a-descriptions-item label="用户名">{{ detailData && detailData.name }}</a-descriptions-item>
        <a-descriptions-item label="昵称">{{ detailData && detailData.nickName }}</a-descriptions-item>
        <a-descriptions-item label="邮箱">{{ detailData && detailData.email }}</a-descriptions-item>
        <a-descriptions-item label="手机号">{{ detailData && detailData.mobile }}</a-descriptions-item>
        <a-descriptions-item label="备注"> {{ detailData && detailData.remark }}</a-descriptions-item>
      </a-descriptions>
      <!-- <a-divider style="margin-bottom: 32px"/>
      <a-descriptions title="用户信息">
        <a-descriptions-item label="用户姓名">付小小</a-descriptions-item>
        <a-descriptions-item label="联系电话">18100000000</a-descriptions-item>
        <a-descriptions-item label="常用快递">菜鸟仓储</a-descriptions-item>
        <a-descriptions-item label="取货地址">浙江省杭州市西湖区万塘路18号</a-descriptions-item>
        <a-descriptions-item label="备注">	无</a-descriptions-item>
      </a-descriptions> -->
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getUserDetail } from '@/api/user'
export default {
  data () {
    return {
      isLoading: false,
      detailData: null
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
        const data = await getUserDetail(this.$route.params.id)
        this.detailData = data || null
      } finally {
        this.isLoading = false
      }
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
</style>
