<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-descriptions title="患者信息">
        <a-descriptions-item label="用户名">{{ detailData && detailData.name }}</a-descriptions-item>
        <a-descriptions-item label="姓名">{{ detailData && detailData.realName }}</a-descriptions-item>
        <a-descriptions-item label="年龄">{{ detailData && detailData.age }}</a-descriptions-item>
        <a-descriptions-item label="性别">{{ detailData && detailData.gender }}</a-descriptions-item>
        <a-descriptions-item label="手机号">{{ detailData && detailData.mobile }}</a-descriptions-item>
        <a-descriptions-item label="身份证号"> {{ detailData && detailData.idCard }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getPatientDetail } from '@/api/patient'
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
        const data = await getPatientDetail(this.$route.params.id)
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
