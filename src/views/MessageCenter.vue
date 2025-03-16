<template>
  <div class="message-list-container">
    <div class="message-list">
      <!-- 消息列表 -->
      <van-list v-if="messages.length > 0">
        <van-cell
          v-for="msg in messages"
          :key="msg.id"
          @click="handleViewDetail(msg)"
          class="message-item"
        >
          <template #icon>
            <van-image
              round
              width="40"
              height="40"
              :src="msg.avatar_url"
              class="message-avatar"
            />
          </template>
          <template #title>
            <div class="content-area">
              <div class="sender-name">{{ msg.user_name }}</div>
              <div class="message-title-container">
                <div class="message-title">{{ msg.content }}</div>
                <van-badge v-if="!msg.is_read" dot class="unread-dot" />
              </div>
              <div class="create-time">
                {{ formatTime(msg.created_at) }}
              </div>
            </div>
          </template>
        </van-cell>
      </van-list>

      <!-- 空状态 -->
      <van-empty v-else description="暂无消息" />
    </div>

    <!-- 底部操作栏 -->
    <div class="action-bar">
      <van-button type="primary" @click="handleMarkAllRead">一键已读</van-button>
      <van-button type="danger" @click="handleDeleteAll">一键删除</van-button>
    </div>
  </div>
</template>
<style scoped>

.message-list-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px;
}

.message-item {
  display: flex;
  align-items: flex-start;
  padding: 3px 15px;
  border-bottom: 1px solid #ebedf0;
}

.message-item:last-child {
  border-bottom: none;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  margin-top: 12px;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sender-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.message-title-container {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.message-title {
  flex: 1;
}

.unread-dot {
  margin-left: 5px;
}

.create-time {
  color: #646566;
  font-size: 12px;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background: white;
  display: flex;
  justify-content: space-between;
}

.van-button {
  flex: 1;
  margin: 0 5px;
  border-radius: 4px;
}
</style>

<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import dayjs from 'dayjs';
import {getMessages, markAllRead, deleteAll, markRead} from '@/api/db.js';

const router = useRouter();
const messages = ref([]);

// 初始化加载数据
const loadData = async () => {
  const res = await getMessages(); // 调用获取消息列表接口
  console.log(res);
  messages.value = res.data['data'];
  console.log("messages.value", messages.value);
};

// 时间格式化
const formatTime = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm');
};

// 查看详情
const handleViewDetail = (msg) => {
  console.log(msg);
  router.push({
    name: 'MessageDetail',
    params: {id: msg.id} // 假设 tixing_id 是你要传递的唯一标识符
  });
  if (!msg.is_read) {
    // 调用标记已读接口（可选）
    markRead(msg.id)
  }
};

// 一键已读
const handleMarkAllRead = async () => {
  await markAllRead();
  await loadData();
};

// 一键删除
const handleDeleteAll = async () => {
  await deleteAll();
  await loadData();
};

onMounted(() => {
  loadData();
});
</script>
