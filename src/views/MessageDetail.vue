<template>
  <div class="message-detail">
    <!-- 消息内容 -->
    <div class="content-box">
      <van-image
        round
        width="60"
        height="60"
        :src="detail.sender_avatar"
      />
      <div class="sender">{{ detail.sender_name }}</div>
      <div class="time">{{ detail.create_time }}</div>
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
  console.log("getMessageDetail",res.data);
  detail.value = res.data['data'];
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

<style scoped>
.content-box {
  padding: 20px;
}
.sender {
  font-size: 18px;
  margin: 10px 0;
}
.time {
  color: #999;
  margin-bottom: 15px;
}
.title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}
.content {
  line-height: 1.6;
}
.action-buttons {
  position: fixed;
  bottom: 20px;
  width: 100%;
  padding: 0 20px;
  display: flex;
  gap: 10px;
}
</style>
