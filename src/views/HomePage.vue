<template>
  <div class="home">
    <div class="header">
      <img src="../../public/default_avatar.jpg" alt="用户头像" class="avatar" />
      <div class="welcome-message">欢迎回来，{{ timeOfDay }}好{{ userName }}</div>
    </div>
    <button class="voice-button">录入语音</button>
    <div class="reminders-title">提醒事项</div>
    <div class="reminder-item" v-for="item in visibleReminders" :key="item.tixing_id">
      <div class="time-and-summary">
        <div class="time">{{ item.target_time }}</div>
        <div class="summary">{{ item.brief_task }}</div>
      </div>
      <div class="full-description">{{ item.task }}</div>
      <div class="repeat">{{ item.repeat }}</div>
<!--      <div>{{item.state}}</div>-->
      <van-switch :model-value="item.state === 1" @update:model-value="switch_state(item.tixing_id,item.state)" />
    </div>
    <button v-if="reminders.length >= maxVisibleCount" @click="loadMore" class="load-more">
      加载更多...
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getCookie } from '../router/index.js'
import {tixing_items_info, update_tixing_state, user_info} from "@/api/db.js";
const maxVisibleCount = ref(2)
const userName = ref("XXX") // 用户名
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
// todo 根据cookie中的user_id查询用户名及提醒事项信息
const user_id = getCookie('user_id')
if (user_id) {
  user_info(user_id).then((res) => {
    userName.value = res.data.user_name
  })
  tixing_items_info(user_id).then((res) => {
    // console.log(res)
    reminders.value = res.data
  })

}
function switch_state(tixing_id,state) {
  // 修改state为相反状态
  if (state === 1){
    state = 0;
  }else if(state === 0){
    state = 1;
  }
  // 更新数据库中的state字段
  try{
    update_tixing_state(tixing_id,state).then((res) => {
      if (res.data.code === 0){
        // 修改reminders的数据状态 页面才可以响应
        const reminderIndex = reminders.value.findIndex(item => item.tixing_id === tixing_id);
        if (reminderIndex !== -1) {
          reminders.value[reminderIndex].state = state;
        }
        // console.log(reminders.value[reminderIndex].state)
      }
    })
  }catch (err){
    // 失败保持原有状态
    console.error('Failed to update state:', err);
  }

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
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: start;
  width: 100%;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
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
  align-self: flex-start;
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
}

.reminder-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
}

.time-and-summary {
  display: flex;
  flex-direction: column;
}

.time {
  font-size: 16px;
  color: #666;
}

.summary {
  font-size: 14px;
  color: #333;
}

.full-description {
  flex: 1;
  text-align: center;
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
</style>
