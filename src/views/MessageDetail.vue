<template>
  <div class="message-detail">
    <!-- 消息内容 -->
    <div class="content-box">
      <van-image
        round
        width="60"
        height="60"
        :src="detail.avatar_url"
      />
      <div class="sender">{{ detail.user_name }}</div>
      <div class="time">{{ detail.created_at }}</div>
      <div class="title">{{ detail.title }}</div>
      <div class="content">{{ detail.content }}</div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <van-button
        round
        type="primary"
        @click="handleMarkRead"
        v-if="!detail.is_read"
      >
        标记已读
      </van-button>
      <van-button
        round
        type="danger"
        @click="handleDelete"
      >
        删除消息
      </van-button>
    </div>
  </div>
</template>

<style scoped>
.message-detail {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.content-box {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.content-box > * {
  margin-bottom: 15px;
}

/* 头像样式 */
van-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 20px;
}

/* 用户信息容器 */
.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
}

.sender {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.time {
  font-size: 13px;
  color: #666;
}

/* 消息内容区域 */
.title {
  font-size: 18px;
  font-weight: 500;
  color: #2c2c2c;
  margin-bottom: 10px;
}

.content {
  font-size: 15px;
  line-height: 1.6;
  color: #555;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  gap: 10px;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.action-buttons .van-button {
  flex: 1;
}

/* 响应式调整（可选） */
@media (max-width: 768px) {
  .content-box {
    flex-direction: column;
    align-items: center;
  }
  van-image {
    margin: 10px 0;
  }
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { getMessageDetail, markRead, deleteMessage } from '@/api/db.js';

const route = useRoute();
const router = useRouter();
const detail = ref({});

// 加载详情数据
const loadDetail = async () => {
  // console.log(route.params.id);
  const res = await getMessageDetail(route.params.id);
  console.log("getMessageDetail",res.data['data'][0]);
  detail.value = res.data['data'][0];
};

// 标记已读
const handleMarkRead = async () => {
  await markRead(route.params.id);
  detail.value.is_read = 1;
};

// 删除消息
const handleDelete = async () => {
  await deleteMessage(route.params.id);
  router.back();
};

onMounted(() => {
  loadDetail();
});
</script>
