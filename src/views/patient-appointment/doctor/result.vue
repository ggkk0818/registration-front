<template>
  <page-header-wrapper>
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
