<template>
  <div class="home">
    <div class="header">
      <img :src="avatar_url" alt="用户头像" class="avatar" />
      <div class="welcome-message">欢迎回来，{{ timeOfDay }}好{{ userName }}</div>
    </div>
    <button class="voice-button" @click="audio_record">录入语音</button>
    <div class="reminders-title">提醒事项</div>
    <div class="reminder-item" v-for="item in visibleReminders" :key="item.tixing_id" @click="modifyReminder(item)">
      <div class="time-and-summary">
        <div class="time">{{ item.target_time }}</div>
<!--        <div class="summary">{{ item.brief_task }}</div>-->
      </div>
      <div class="full-description">{{ item.brief_task }}</div>
      <div class="repeat">{{ item.repeat }}</div>
      <!--      <div>{{item.state}}</div>-->
      <van-switch
        :model-value="item.state === 1"
        @update:model-value="switch_state(item.tixing_id, item.state)"
      />
    </div>
<!--    <button v-if="reminders.length >= maxVisibleCount" @click="loadMore" class="load-more">-->
<!--      加载更多...-->
<!--    </button>-->
    <div class="add-reminder-button" :class="{ 'active': isActive }" @click.stop="addReminder">
      <img
        class="add-reminder-icon"
        :src="isActive ? blueIcon : greyIcon"
        alt="分享按钮"
        @click.stop="addReminder"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import router from '../router/index.js'
import { tixing_items_info, update_tixing_state, user_info } from '@/api/db.js'
import {check_auth, get_cookie} from "@/util/auth.js";
import {showToast} from "vant";
import blueIcon from "@/assets/add_reminder_blue.png";
import greyIcon from "@/assets/add_reminder_grey.png";
const isActive = ref(false);
const addReminder = () => {
    isActive.value = !(isActive.value);
    router.push(`/add_reminders`);
}
const modifyReminder = (item) => {
  router.push({
    name: 'ModifyReminders',
    params: { id: item.tixing_id } // 假设 tixing_id 是你要传递的唯一标识符
  });
}
const maxVisibleCount = ref(20)
const userName = ref('XXX') // 用户名
const reminders = ref([
  {
    tixing_id: 1,
    target_time: '18:00',
    brief_task: '吃晚饭',
    task: '吃晚饭时间到了',
    repeat: '每天',
    state: 0,
    method: '短信',
    // timeLeft: '30分钟后',
  },
  {
    tixing_id: 2,
    target_time: '18:00',
    brief_task: '吃晚饭',
    task: '吃晚饭时间到了',
    repeat: '每天',
    state: 0,
    method: '短信',
    // timeLeft: '30分钟后',
  },
  {
    tixing_id: 3,
    target_time: '18:00',
    brief_task: '吃晚饭',
    task: '吃晚饭时间到了',
    repeat: '每天',
    state: 0,
    method: '短信',
    // timeLeft: '30分钟后',
  },
  {
    tixing_id: 4,
    target_time: '18:00',
    brief_task: '吃晚饭',
    task: '吃晚饭时间到了',
    repeat: '每天',
    state: 0,
    method: '短信',
    // timeLeft: '30分钟后',
  },
  {
    tixing_id: 5,
    target_time: '18:00',
    brief_task: '吃晚饭',
    task: '吃晚饭时间到了',
    repeat: '每天',
    state: 0,
    method: '短信',
    // timeLeft: '30分钟后',
  },
  {
    tixing_id: 6,
    target_time: '18:00',
    brief_task: '吃晚饭',
    task: '吃晚饭时间到了',
    repeat: '每天',
    state: 0,
    method: '短信',
    // timeLeft: '30分钟后',
  },
  {
    tixing_id: 7,
    target_time: '18:00',
    brief_task: '吃晚饭',
    task: '吃晚饭时间到了',
    repeat: '每天',
    state: 0,
    method: '短信',
    // timeLeft: '30分钟后',
  },
  {
    tixing_id: 8,
    target_time: '18:00',
    brief_task: '吃晚饭',
    task: '吃晚饭时间到了',
    repeat: '每天',
    state: 0,
    method: '短信',
    // timeLeft: '30分钟后',
  },
  // 更多提醒事项
])
const avatar_url = ref('../../public/default_avatar.jpg')
// 根据cookie中的user_id查询用户名及提醒事项信息
const user_id = get_cookie('user_id')
if (user_id) {
  user_info(user_id).then((res) => {
    userName.value = res.data.user_name
    avatar_url.value = res.data.avatar_url
  })
  tixing_items_info(user_id).then((res) => {
    // console.log(res)
    // 如果res.data中的task字段内容超过
    if (res.data === null){
      reminders.value = []
    }else {
      reminders.value = res.data
    }

  })
}

function switch_state(tixing_id, state) {
  // 修改state为相反状态
  if (state === 1) {
    state = 0
  } else if (state === 0) {
    state = 1
  }
  // 更新数据库中的state字段
  try {
    update_tixing_state(tixing_id, state).then((res) => {
      if (res.data.code === 0) {
        // 修改reminders的数据状态 页面才可以响应
        const reminderIndex = reminders.value.findIndex((item) => item.tixing_id === tixing_id)
        if (reminderIndex !== -1) {
          reminders.value[reminderIndex].state = state
        }
        // console.log(reminders.value[reminderIndex].state)
      }
    })
  } catch (err) {
    // 失败保持原有状态
    console.error('Failed to update state:', err)
  }
}
function audio_record() {
  // 检测用户是否登录
  check_auth().then((res) => {
    if (res) {
      // todo 录入语音  1、调用手机语音录入api 2、将相关语音上传到云存储 3、写入数据库语音地址
      showToast('录入语音')
    }else{
      showToast('请先登录')
      router.push('/login');
    }
  })
}

const visibleReminders = computed(() => reminders.value.slice(0, maxVisibleCount.value))
const timeOfDay = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早上'
  else if (hour < 18) return '中午'
  else return '晚上'
})


function loadMore() {
  maxVisibleCount.value += maxVisibleCount.value // 每次点击加载更多，增加6条记录
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; /* 设置宽度为100% */
  min-height: 100vh; /* 设置最小高度为视口的100% */
  padding: 0; /* 移除内边距 */
  margin: 0; /* 移除外边距 */
  overflow: auto; /* 添加滚动条 */
}

.header {
  display: flex;
  align-items: center;
  justify-content: start;
  width: 100%;
}

.header .avatar {
  margin: 16px 22px;
  width: 60px; /* 设置头像的宽度 */
  height: 60px; /* 设置头像的高度 */
  border-radius: 50%; /* 将头像裁剪为圆形 */
  object-fit: cover; /* 确保图片按比例缩放并覆盖整个容器 */
  object-position: center; /* 确保图片的中心部分显示在容器中 */
  display: block; /* 避免img标签默认的inline-block带来的额外间距 */
}

.welcome-message {
  font-size: 18px;
  font-weight: bold;
}

.voice-button {
  margin: 20px auto;
  width: 25vh; /* 设置宽度为视口高度的一半 */
  height: 25vh; /* 设置高度为视口高度的一半 */
  background-color: #09a8ed;
  color: white;
  border: none;
  border-radius: 50%; /* 设置为圆形 */
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reminders-title {
  margin-left: 20vw;
  width: 100%;
  margin-top: 15px;
  font-size: 20px;
  font-weight: bold;
}

.reminder-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
  margin-right: 6vw;
  padding: 10px; /* 给item一些内边距 */
  border-radius: 5px; /* 圆角边框 */
  transition: background-color 0.3s ease-in-out; /* 添加过渡效果 */
}
/* 当鼠标悬停在 .reminder-item 上时应用的样式 */
.reminder-item:hover {
  background-color: #d0d0d0; /* 悬停时更深的颜色 */
}
.time-and-summary {
  display: flex;
  flex-direction: column;
  width: 40vw;
  align-items: center;
}

.time {
  font-size: 26px;
  color: #000000;
}

.summary {
  font-size: 14px;
  color: #333;
}

.full-description {
  flex: 1;
  text-align: left;
}

.repeat {
  margin-right: 10px;
}

.load-more {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background-color: #09a8ed;
  border: none;
  border-radius: 25px; /* 圆角 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 阴影 */
  cursor: pointer;
  transition: all 0.3s ease; /* 平滑过渡 */
  outline: none; /* 去除默认轮廓 */
}

.load-more:hover {
  background-color: #0f53f2;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* 悬停时阴影加深 */
  transform: translateY(-2px); /* 悬停时轻微上移 */
}

.load-more:active {
  transform: translateY(0); /* 点击时恢复原位 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 点击时阴影恢复 */
}

.add-reminder-button {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.add-reminder-icon {
  width: 50px;  /* 根据实际图片尺寸调整 */
  height: 50px;
  transition: transform 0.2s;
}
</style>
