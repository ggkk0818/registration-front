<template>
  <div class="page-container" :class="{'is-layout': isLayout}">
    <!-- 导航栏 -->
    <div class="nav-area">
      <div class="navbar">
        <div class="navbar-brand">
          <logo-svg />
          <span>在线预约挂号系统</span>
        </div>
        <div class="others-option">
          <avatar-dropdown v-if="isLogin" :current-user="userInfo" />
          <a-space v-else>
            <a-button type="primary" @click="goLogin()">登录</a-button>
            <a-button @click="goRegister()">注册</a-button>
          </a-space>
        </div>
      </div>
    </div>
    <section class="section-poster">
      <img src="@/assets/portal/poster.webp" />
      <div class="page-width">
        <div class="slider-content">
          <div class="sub-title">分时段</div>
          <div class="main-title">在线预约挂号</div>
          <a-button type="primary" size="large" @click="goAppointment()">现在预约</a-button>
        </div>
      </div>
    </section>
    <section class="section-carousel">
      <div class="carousel-item">
        <div class="image-container">
          <img src="@/assets/portal/C1_1.webp" />
        </div>
        <div class="text-container">Baby Care</div>
      </div>
      <div class="carousel-item">
        <div class="image-container">
          <img src="@/assets/portal/C1_2.webp" />
        </div>
        <div class="text-container">Baby Care</div>
      </div>
      <div class="carousel-item">
        <div class="image-container">
          <img src="@/assets/portal/C1_3.webp" />
        </div>
        <div class="text-container">Baby Care</div>
      </div>
      <div class="carousel-item">
        <div class="image-container">
          <img src="@/assets/portal/C1_4.webp" />
        </div>
        <div class="text-container">Baby Care</div>
      </div>
      <div class="carousel-item">
        <div class="image-container">
          <img src="@/assets/portal/C1_5.webp" />
        </div>
        <div class="text-container">Baby Care</div>
      </div>
    </section>
    <section class="section-feature">
      <div class="feature-item">
        <div class="feature-img">
          <img src="@/assets/portal/s1.png" />
        </div>
        <div class="feature-content">
          <div class="service-title">应急服务</div>
          <div class="service-desc">提供上门紧急服务</div>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-img">
          <img src="@/assets/portal/s2.png" />
        </div>
        <div class="feature-content">
          <div class="service-title">24 X 7 支持</div>
          <div class="service-desc">全天客服在线</div>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-img">
          <img src="@/assets/portal/s3.png" />
        </div>
        <div class="feature-content">
          <div class="service-title">可靠支付</div>
          <div class="service-desc">预约失败自动退款</div>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-img">
          <img src="@/assets/portal/s4.png" />
        </div>
        <div class="feature-content">
          <div class="service-title">活动奖品</div>
          <div class="service-desc">参加活动获取奖品</div>
        </div>
      </div>
    </section>
    <!-- 底部 -->
    <div class="footer-bottom-area">
      <div class="container">
        <div class="copy-right">
          <p>Copyright 2023 All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LogoSvg from '@/assets/logo.svg?inline'
import AvatarDropdown from '@/components/GlobalHeader/AvatarDropdown'
import { mapGetters } from 'vuex'
export default {
  components: {
    LogoSvg,
    AvatarDropdown
  },
  computed: {
    ...mapGetters(['userInfo']),
    isLogin ({ userInfo }) {
      return !userInfo || Object.keys(userInfo).length > 0
    },
    isLayout () {
      console.log(this.$route)
      return this.$route?.matched[0]?.name === 'patientAppointment'
    }
  },
  methods: {
    goLogin () {
      this.$router.push('/user/login')
    },
    goRegister () {
      this.$router.push('/user/register')
    },
    goAppointment () {
      if (this.isLogin) {
        this.$router.push('/patient-appointment/doctor')
      } else {
        this.$router.push('/user/login')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.page-container {
  position: relative;
  padding-top: 64px;
  &.is-layout {
    padding-top: 0;
    margin: -24px;
  }
}
.nav-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 64px;
  margin: auto;
  z-index: 999;
  background-color: #ffffff;
  box-shadow: 0 8px 6px -6px rgba(0, 0, 0, 0.4);
  animation: 500ms ease-in-out 0s normal none 1 running fadeInDown;
  transition: all 0.5s;
  .navbar {
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: space-between;
    height: 64px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .navbar-brand {
    display: flex;
    align-items: center;
    padding: 0 15px;
    svg {
      width: 36px;
      height: 36px;
    }
    span {
      color: #1890ff;
      font-size: 24px;
    }
  }
  .others-option {
    padding: 0 15px;
  }
}
section {
  position: relative;
}
.section-poster {
  img {
    width: 100%;
    max-height: 800px;
    object-fit: cover;
  }
  .page-width {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 15px;
    padding-right: 15px;
    transform: translateY(-50%);
  }
  .slider-content {
    width: 50%;
    float: right;
    text-align: left;
  }
  .main-title {
    font-size: 65px;
    text-transform: unset;
    line-height: 65px;
    margin-bottom: 20px;
    letter-spacing: 0.5px;
    font-weight: 700;
    color: #232323;
  }
  .sub-title {
    font-size: 25px;
    text-transform: unset;
    line-height: 25px;
    margin-bottom: 20px;
    letter-spacing: 0.5px;
    position: relative;
    color: #666666;
  }
}
.section-carousel {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 60px 0;
  .carousel-item {
    margin: 30px;
  }
  .image-container {
    width: 200px;
    height: 200px;
    margin-bottom: 15px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .text-container {
    max-width: 200px;
    margin: 0 auto;
    padding: 5px 0;
    font-size: 18px;
    font-weight: 400;
    color: #232323;
    transition: all 0.5s;
    text-align: center;
  }
}
.section-feature {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 60px 0;
  background-color: #f5f5f5;
  .feature-item {
    display: flex;
    align-items: center;
    width: 200px;
    margin: 15px 30px;
  }
  .feature-img {
    width: 60px;
    height: 60px;
    position: relative;
    text-align: center;
    border: 1px solid rgba(226, 0, 39, 0.5);
    border-radius: 50%;
    transition: all 0.4s ease-in-out;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .feature-content {
    flex: 1 1 0;
    overflow: hidden;
    text-align: left;
    margin-left: 20px;
  }
  .service-title {
    font-size: 15px;
    font-weight: 500;
    transition: all 0.4s;
  }
  .service-desc {
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 0;
    transition: all 0.4s;
  }
}
.footer-bottom-area {
  background-color: #122738;
  padding: 20px 0;
  .container {
    width: 100%;
    max-width: 1620px;
    margin: 0 auto;
    padding: 0 15px;
  }
  .copy-right {
    text-align: center;
  }
  p {
    text-transform: capitalize;
    margin-bottom: 0;
    color: #ffffff;
  }
}
@media (min-width: 0) and (max-width: 750px) {
  .page-container {
    padding-top: 64px;
  }
  .nav-area {
    height: 64px;
    .navbar {
      height: 64px;
    }
    .navbar-brand {
      svg {
        width: 36px;
        height: 36px;
      }
      span {
        display: none;
      }
    }
  }
  .section-poster {
    img {
      height: 400px;
    }
    .slider-content {
      width: 70%;
    }
    .main-title {
      font-size: 55px;
    }
    .sub-title {
      margin-bottom: 10px;
    }
  }
}
</style>
