<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="currentUser.avatar" />
        </div>
        <div class="content">
          <div class="content-title">{{ timeFix }}，{{ currentUser.nickName }}</div>
        </div>
      </div>
    </template>
    <template v-slot:extraContent>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic title="今日预约" :value="summaryData.appointmentCount" />
        </div>
      </div>
    </template>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px"
            :bordered="false"
            title="今日预约"
            :body-style="{ padding: 0 }"
          >
            <a slot="extra" @click="goAppointment()">全部预约</a>
            <div v-if="appointmentList.length > 0">
              <a-card-grid class="project-card-grid" :key="i" v-for="(item, i) in appointmentList">
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <a-avatar size="small" :src="PeopleImg" />
                      <a>{{ item.patientName }}</a>
                      <div class="title-right">
                        <template v-if="item.status === APPOINTMENT_STATUS.DIAGNOSE_HOLD">
                          <a @click="handleEdit(item)">诊断</a>
                          <a-divider type="vertical" />
                        </template>
                        <a @click="handleView(item)">查看</a>
                        <a-divider type="vertical" />
                        <a @click="handleDel(item)">取消</a>
                      </div>
                    </div>
                    <div slot="description" class="card-description">
                      {{ item.diagnoseResult }}
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <a-badge :status="item.status | statusTypeFilter" :text="item.status | statusFilter" />
                    <span class="datetime">{{ formatDate(item.updateTime) }}</span>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
            <div v-else class="msg-box">暂无数据</div>
          </a-card>

          <!-- <a-card :loading="loading" title="今日预约" :bordered="false">
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in appointmentList">
                <a-list-item-meta>
                  <a-avatar slot="avatar" size="small" :src="item.avatar" />
                  <div slot="title">
                    <span>{{ item.patientName }}</span
                    >&nbsp; <a-badge :status="item.status | statusTypeFilter" :text="item.status | statusFilter" />
                  </div>
                  <div slot="description">{{ item.updateTime }}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card> -->
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
          <a-card title="便捷导航" style="margin-bottom: 24px" :bordered="false" :body-style="{ padding: 0 }">
            <div class="item-group">
              <a @click="goAppointment()">去诊断</a>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapGetters } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { Radar } from '@/components'
import { getStatisticList } from '@/api/statistic'
import { getDoctorAppointmentList, delAppointment } from '@/api/appointment'
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_MAP } from '@/utils/consts'
import PeopleImg from '@/assets/people.png'
import moment from 'moment'
export default {
  name: 'Workplace',
  components: {
    PageHeaderWrapper,
    Radar
  },
  data () {
    return {
      PeopleImg,
      APPOINTMENT_STATUS,
      loading: false,
      timeFix: timeFix(),
      avatar: '',
      appointmentList: [],
      summaryData: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    currentUser ({ userInfo }) {
      return {
        name: userInfo?.name,
        nickName: userInfo?.nickName,
        deptName: userInfo?.deptName,
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
      }
    },
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.getAppointment()
    this.getSummary()
  },
  methods: {
    async getAppointment () {
      try {
        this.loading = true
        const res = await getDoctorAppointmentList({ diagnoseTime: moment().format('YYYY-MM-DD') })
        this.appointmentList = res?.records || []
      } finally {
        this.loading = false
      }
    },
    async getSummary () {
      const res = await getStatisticList({ date: moment().format('YYYY-MM-DD') })
      this.summaryData = res || {}
    },
    goAppointment () {
      this.$router.push('/doctor-appointment/list')
    },
    formatDate (date) {
      return date ? moment(date).fromNow() : ''
    },
    handleEdit (record) {
      this.$router.push({ path: `/doctor-appointment/list/diagnose/${record.id}` })
    },
    handleView (record) {
      this.$router.push({ path: `/doctor-appointment/list/detail/${record.id}` })
    },
    handleDel (record) {
      this.$confirm({
        title: '提示',
        content: '是否确认取消？',
        onOk: () => {
          delAppointment(record.id).then(() => {
            this.$message.success('操作成功')
            this.$refs.table.refresh()
          })
        }
      })
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
@import './Workplace.less';

.project-list::v-deep {
  .card-title {
    display: flex;
    align-items: center;
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #1890ff;
      }
    }
    .title-right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      a {
        height: auto;
        margin-left: 0;
        line-height: 1;
      }
    }
  }

  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }

  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    .ant-badge {
      flex: 1 1 0;
    }
    a {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;

      &:hover {
        color: #1890ff;
      }
    }

    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }

  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }

  .msg-box {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    color: rgba(0, 0, 0, 0.45);
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;

  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;

    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }

    &:hover {
      span {
        color: #1890ff;
      }
    }
  }
}

.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
}
</style>
