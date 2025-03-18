<template>
  <div class="help-container">
    <h1 class="title">常见问题</h1>
    <div class="question-list">
      <div
        v-for="question in questions"
        :key="question.id"
        class="question-item"
        @click="goToDetail(question.id)"
      >
        <div class="question-content">
          <span class="text">{{ question.title }}</span>
          <span class="icon">›</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.help-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  color: #333;
  font-size: 24px;
  margin-bottom: 30px;
  text-align: center;
}

.question-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.question-item {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: all 0.3s ease;
}

.question-item:hover {
  background: #f8f9fa;
}

.question-item:last-child {
  border-bottom: none;
}

.question-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 16px;
  color: #333;
}

.icon {
  font-size: 24px;
  color: #999;
  transform: scale(1.5);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .help-container {
    padding: 15px;
  }

  .title {
    font-size: 20px;
  }

  .question-item {
    padding: 12px 15px;
  }

  .text {
    font-size: 14px;
  }
}
</style>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 常见问题列表数据
const questions = ref([
  { id: 1, title: '如何通过语音创建辅助记忆事项？' },
  { id: 2, title: '如何联系工作人员？' },
  { id: 3, title: '如何查看系统推送消息？' },
  // 可以继续添加更多问题...
])

// 跳转到问题详情页
const goToDetail = (questionId) => {
  router.push({
    name: 'HelpDetail',
    params: {id: questionId}
  })
}
</script>
