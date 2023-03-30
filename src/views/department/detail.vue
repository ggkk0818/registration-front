<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-descriptions title="科室信息">
        <a-descriptions-item label="名称">{{ detailData && detailData.name }}</a-descriptions-item>
        <a-descriptions-item label="描述"> {{ detailData && detailData.description }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getDepartmentDetail } from '@/api/department'
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
        const data = await getDepartmentDetail(this.$route.params.id)
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
