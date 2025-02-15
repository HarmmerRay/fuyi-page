<template>
  <div class="home">
    <div class="header">
      <img src="../../public/default_avatar.jpg" alt="用户头像" class="avatar" />
      <div class="welcome-message">欢迎回来，{{ timeOfDay }}好{{ userName }}</div>
    </div>
    <button class="voice-button">录入语音</button>
    <div class="reminders-title">提醒事项</div>
    <div class="reminder-item" v-for="item in visibleReminders" :key="item.id">
      <div class="time-and-summary">
        <div class="time">{{ item.time }}</div>
        <div class="summary">{{ item.summary }}</div>
      </div>
      <div class="full-description">{{ item.description }}</div>
      <div class="time-left">{{ item.timeLeft }}</div>
      <van-switch v-model="item.enabled" />
    </div>
    <button v-if="reminders.length >= maxVisibleCount" @click="loadMore" class="load-more">
      加载更多...
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const maxVisibleCount = ref(2)

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
  {
    id: 2,
    time: '18:00',
    summary: '吃晚饭',
    description: '吃晚饭时间到了',
    timeLeft: '30分钟后',
    enabled: true,
  },
  {
    id: 3,
    time: '18:00',
    summary: '吃晚饭',
    description: '吃晚饭时间到了',
    timeLeft: '30分钟后',
    enabled: true,
  },
  {
    id: 4,
    time: '18:00',
    summary: '吃晚饭',
    description: '吃晚饭时间到了',
    timeLeft: '30分钟后',
    enabled: true,
  },
  {
    id: 5,
    time: '18:00',
    summary: '吃晚饭',
    description: '吃晚饭时间到了',
    timeLeft: '30分钟后',
    enabled: true,
  },
  {
    id: 6,
    time: '18:00',
    summary: '吃晚饭',
    description: '吃晚饭时间到了',
    timeLeft: '30分钟后',
    enabled: true,
  },
  // {
  //   id: 7,
  //   time: '18:00',
  //   summary: '吃晚饭',
  //   description: '吃晚饭时间到了',
  //   timeLeft: '30分钟后',
  //   enabled: true,
  // },
  // {
  //   id: 8,
  //   time: '18:00',
  //   summary: '吃晚饭',
  //   description: '吃晚饭时间到了',
  //   timeLeft: '30分钟后',
  //   enabled: true,
  // },
  // {
  //   id: 9,
  //   time: '18:00',
  //   summary: '吃晚饭',
  //   description: '吃晚饭时间到了',
  //   timeLeft: '30分钟后',
  //   enabled: true,
  // },
  // 更多提醒事项
])
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

.time-left {
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
