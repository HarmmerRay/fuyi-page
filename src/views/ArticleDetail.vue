<script setup>
import { ref } from 'vue'

// 页面数据
const articleContent = ref(`# 资讯标题\n\n![示例图片](https://picsum.photos/800/400)\n\n这是一篇示例资讯文章，支持以下格式：\n- 无序列表项\n- 支持代码：\n  \`\`\`javascript\n  console.log('Hello Vue 3!');\n  \`\`\`\n\n> 引用内容示例\n\n**加粗文本** 和 *斜体文本*`)
const isLiked = ref(false)
const commentText = ref('')

// 操作方法
const handleBack = () => {
  window.history.back()
}

const handleLike = () => {
  isLiked.value = !isLiked.value
}

const handleComment = () => {
  if (commentText.value.trim()) {
    // 这里可以添加提交评论的逻辑
    alert('评论已提交：' + commentText.value)
    commentText.value = ''
  }
}
</script>

<template>
  <!--  上方一行 从左到右 返回logo（有功能），资讯详细字样， 右对齐是转发按钮仅支持转发到微信即可  -->
  <!--  在下方，呈现用户头像，用户名，发布时间，发布地点-->
  <!--  中间所有区域呈现markdown文本的资讯信息-->
  <!--  底部栏，从左到右是 评论输入框，点赞按钮 -->
  <div class="container">
    <!-- 顶部导航 -->
    <header class="article-header">
      <div class="left-group">
        <button class="back-btn" @click="handleBack">←</button>
        <img src="@/assets/wechat-icon.png" alt="Logo" class="logo" />
        <h1 class="title">资讯详细</h1>
      </div>
      <button class="share-btn">转发</button>
    </header>

    <!-- 用户信息 -->
    <section class="user-info">
      <img
        src="https://picsum.photos/50/50"
        alt="用户头像"
        class="avatar"
      />
      <div class="user-meta">
        <span class="username">用户名</span>
        <div class="time-location">
          <span class="time">2023-09-15 14:30</span>
          <span class="location">• 北京</span>
        </div>
      </div>
    </section>

    <!-- Markdown 内容 -->
    <article class="article-content" v-html="articleContent"></article>

    <!-- 底部栏 -->
    <footer class="article-footer">
      <input
        v-model="commentText"
        type="text"
        placeholder="输入评论..."
        @keyup.enter="handleComment"
        class="comment-input"
      />
      <button
        class="like-btn"
        :class="{ 'liked': isLiked }"
        @click="handleLike"
      >
        {{ isLiked ? '❤️' : '🤍' }}
      </button>
    </footer>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
}

/* 顶部导航 */
.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #ffffff;
  position: relative;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.left-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.logo {
  height: 2rem;
  vertical-align: middle;
}

.title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.share-btn {
  background: none;
  border: none;
  font-size: 0.9rem;
  color: #07c160;
  cursor: pointer;
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e9e9e9;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.time-location {
  font-size: 0.85rem;
  color: #888;
}

/* 文章内容 */
.article-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background-color: #fff;
}

/* Markdown 样式 */
.article-content h1, .article-content h2, .article-content h3 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.article-content p {
  margin: 1rem 0;
  line-height: 1.6;
}

.article-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.article-content pre {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}

.article-content code {
  background: #f0f0f0;
  padding: 2px 4px;
  border-radius: 4px;
}

.article-content blockquote {
  border-left: 3px solid #e6e6e6;
  margin: 1.5rem 0;
  padding-left: 1rem;
  color: #666;
}

/* 底部栏 */
.article-footer {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  background-color: #ffffff;
  border-top: 1px solid #e9e9e9;
  position: sticky;
  bottom: 0;
  box-shadow: 0 -1px 3px rgba(0,0,0,0.05);
}

.comment-input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  margin-right: 0.8rem;
  font-size: 0.95rem;
}

.like-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.like-btn.liked {
  color: #ff4949;
}

.like-btn:hover {
  color: #ff7875;
}
</style>
