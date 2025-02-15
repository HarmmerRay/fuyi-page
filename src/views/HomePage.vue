<template>
  <div class="home">
    <div class="header">
      <img src="../../public/default_avatar.jpg" alt="用户头像" class="avatar" />
      <div class="welcome-message">欢迎回来，{{ timeOfDay }}好{{ userName }}</div>
    </div>
    <button class="voice-button">录入语音</button>
    <div class="reminders-title">提醒事项</div>
    <div class="reminder-item" v-for="item in reminders" :key="item.id">
      <div class="time-and-summary">
        <div class="time">{{ item.time }}</div>
        <div class="summary">{{ item.summary }}</div>
      </div>
      <div class="full-description">{{ item.description }}</div>
      <div class="time-left">{{ item.timeLeft }}</div>
      <van-switch v-model="item.enabled" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const userName = ref('XXX') // 用户名
const reminders = ref([
  {
    id: 1,
    time: '18:00',
    summary: '吃晚饭',
    description: '吃晚饭时间到了',
    timeLeft: '30分钟后',
    enabled: true,
  },
  // 更多提醒事项
])

const timeOfDay = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早上'
  else if (hour < 18) return '中午'
  else return '晚上'
})
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

.time-left {
  margin-right: 10px;
}
</style>
