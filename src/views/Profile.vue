<template>
  <div class="profile">
    <div class="bg_img" :style="{ 'background-image': `url(${bg_img_url})` }">
      <div class="user-info">
        <div class="avatar">
          <img :src="avatar_url" alt="用户头像" />
        </div>
        <div class="info">
          <div class="username">{{ user_name }}</div>
          <div class="phone">手机：{{ phone_number }}</div>
        </div>
        <div class="more" @click="showDropdown = true">
          <i class="el-icon-more"></i>
          <div class="dropdown" v-if="showDropdown">
            <div class="dropdown-item" @click="handlePrivacy">隐私政策</div>
            <div class="dropdown-item" @click="handleLogoff">注销账号</div>
          </div>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <div class="action-btn" @click="go_reminders">
        <img style="width: 26px" src="../../public/tixing_items.png" alt="" />
        <div>提醒事项</div>
      </div>
      <div class="action-btn" @click="go_notification">
        <img style="width: 26px" src="../../public/notifications.png" alt="" />
        <div>消息中心</div>
      </div>
      <!--      <div class="action-btn" @click="goReminders">提醒事项</div>-->
    </div>

    <div class="menu-list">
      <div class="menu-item" @click="goHelp">
        <div><img class="img0" src="../../public/help_center.png" alt="" /></div>
        <div class="miaoshu1">帮助中心</div>
        <div class="jiantou"><img class="img2" src="../../public/jiantou.png" alt="" /></div>
      </div>
      <div class="menu-item" @click="goContact">
        <div><img class="img0" src="../../public/connection.png" alt="" /></div>
        <div class="miaoshu1">联系我们</div>
        <div class="jiantou"><img class="img2" src="../../public/jiantou.png" alt="" /></div>
      </div>
      <div class="menu-item" @click="logout">
        <div><img class="img0" src="../../public/logout.png" alt="" /></div>
        <div class="miaoshu1">退出登录</div>
        <div class="jiantou"><img class="img2" src="../../public/jiantou.png" alt="" /></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { user_info } from '@/api/db.js'
import { getCookie } from '@/router/index.js'

const bg_img_url = ref('')
const avatar_url = ref('')
const user_name = ref('')
const phone_number = ref('')
const showDropdown = ref(false)

user_info(getCookie('user_id')).then((res) => {
  console.log(res)
  bg_img_url.value = res.data.bg_img_url
  avatar_url.value = res.data.avatar_url
  user_name.value = res.data.user_name
  phone_number.value = mask_phone_number(res.data.phone_number)
})

function mask_phone_number(phone_number) {
  // 检查输入是否为11位手机号
  if (phone_number.length !== 11) {
    throw new Error('Invalid phone number. It should be 11 digits long.')
  }
  // 手机号前三位，中间四位替换为星号，后四位
  return phone_number.substring(0, 3) + '****' + phone_number.substring(7)
}

function handlePrivacy() {
  showDropdown.value = false
  // 处理隐私政策
}

const handleLogoff = () => {
  showDropdown.value = false
  // 处理注销账号
}

const go_notification = () => {
  // 跳转到消息中心
}

const go_reminders = () => {
  // 跳转到提醒事项
}

const goMessages = () => {
  // 跳转到消息中心
}

const goHelp = () => {
  // 跳转到帮助中心
}

const goContact = () => {
  // 跳转到联系我们
}

const logout = () => {
  // 处理退出登录
}
</script>

<style scoped>
.profile {
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: auto;
  background-color: #f6f6f6;
}

.bg_img {
  height: 20vh;
  width: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.user-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 15px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  position: relative; /* 添加此行 */
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  position: absolute;
  top: 60px; /* 头像高度为60px */
  left: 0;
  margin-right: 15px;
  width: 100%;
}

.username {
  font-size: 20px;
  font-weight: bold;
  color: #000000;
}

.phone {
  font-size: 14px;
  color: rgba(170, 170, 170, 0.6);
  margin-top: 5px;
}

.more {
  position: relative;
  padding: 10px;
}

.dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 1;
}

.dropdown-item {
  padding: 10px 20px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.action-btn {
  text-align: center;
  cursor: pointer;
}

.menu-list {
  color: #333333;
  font-size: 12px;
  padding-top: 10px;
  width: 343px;
  border-radius: 10px;
  background-color: #fff;
  margin: 15px 15px 0 15px;
}

.menu-item {
  padding: 12px 16px;
  display: flex;
  .img1 {
    width: 24px;
    height: 28px;
  }

  .img0 {
    width: 22px;
    height: 21px;
  }

  .img2 {
    width: 8px;
    height: 12px;
    margin: 5px 0 5px 0;
  }
}

.tabs1 {
  padding: 12px 16px;
  display: flex;

  .img1 {
    width: 24px;
    height: 28px;
  }

  .img0 {
    width: 22px;
    height: 21px;
  }

  .img2 {
    width: 8px;
    height: 12px;
    margin: 5px 0 5px 0;
  }
}

.miaoshu1 {
  margin-left: 5px;
  padding-top: 1px;
  font-family:
    PingFang SC,
    PingFang SC,
    sans-serif;
  font-weight: normal;
  font-size: 15px;
  color: #333333;
  line-height: 20px;
  text-align: center;
  font-style: normal;
  text-transform: none;
}

.jiantou {
  margin-left: auto;
}
</style>
