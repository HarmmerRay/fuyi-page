<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'

import highlightjs from 'markdown-it-highlightjs'
import { select_news_by_id, like_news, unlike_news, add_comment } from '@/api/db.js'

// 初始化markdown-it解析器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
})

// 使用highlightjs插件
md.use(highlightjs)

// 页面数据
const articleContent = ref('')
const isLiked = ref(false)
const commentText = ref('')
const route = useRoute()
const newsData = ref(null)
const loading = ref(true)
const likeId = ref(null) // 用于存储点赞ID，以便取消点赞

// 计算属性：渲染后的Markdown内容
const renderedContent = computed(() => {
  return md.render(articleContent.value || '')
})

// 获取资讯详情
const fetchNewsDetail = async () => {
  try {
    loading.value = true
    const news_id = route.params.news_id
    console.log('获取资讯详情，news_id:', news_id)

    // 调用API获取资讯详情
    const response = await select_news_by_id(news_id)
    console.log('获取资讯详情成功:', response.data)
    if (response.data.status === '1' && response.data.data) {
      newsData.value = response.data.data

      // 设置文章内容
      articleContent.value = `# ${newsData.value.title || '资讯详情'}\n\n${newsData.value.content || ''}`
    } else {
      console.error('获取资讯详情失败:', response.data.msg)
      // 使用localStorage中的数据作为备选
      const cachedItem = JSON.parse(localStorage.getItem('item_' + news_id) || '{}')
      if (cachedItem) {
        newsData.value = cachedItem
        articleContent.value = `# ${cachedItem.title || '资讯详情'}\n\n${cachedItem.content || ''}`
      }
    }
  } catch (error) {
    console.error('获取资讯详情出错:', error)
  } finally {
    loading.value = false
  }
}

// 在组件挂载时获取资讯详情
onMounted(() => {
  fetchNewsDetail()
})

// 操作方法
const handleBack = () => {
  window.history.back()
}

const handleLike = async () => {
  if (isLiked.value) {
    // 取消点赞
    if (likeId.value) {
      try {
        const response = await unlike_news(likeId.value)
        if (response.data.status === '1') {
          isLiked.value = false
          likeId.value = null
          alert('取消点赞成功')
        } else {
          alert('取消点赞失败: ' + response.data.msg)
        }
      } catch (error) {
        console.error('取消点赞出错:', error)
        alert('取消点赞出错')
      }
    } else {
      alert('未找到点赞记录，无法取消')
    }
  } else {
    // 点赞
    try {
      // console.log('点赞，news_id:', newsData.value.news_id)
      const response = await like_news(newsData.value.news_id)
      console.log('点赞响应:', response.data)
      if (response.data.status === '1') {
        isLiked.value = true
        likeId.value = response.data.like_id
        alert('点赞成功')
      } else {
        alert('点赞失败: ' + response.data.msg)
      }
    } catch (error) {
      console.error('点赞出错:', error)
      alert('点赞出错')
    }
  }
}

const handleComment = async () => {
  if (commentText.value.trim()) {
    try {
      const response = await add_comment(newsData.value.news_id, commentText.value)
      if (response.data.status === '1') {
        alert('评论已提交：' + commentText.value)
        commentText.value = ''
        // 可以在这里刷新评论列表或更新评论计数
      } else {
        alert('评论失败: ' + response.data.msg)
      }
    } catch (error) {
      console.error('评论出错:', error)
      alert('评论出错')
    }
  } else {
    alert('评论内容不能为空')
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

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <template v-else>
      <!-- 用户信息 -->
      <section class="user-info" v-if="newsData">
        <img
          :src="newsData.avatar_url || 'https://picsum.photos/50/50'"
          alt="用户头像"
          class="avatar"
        />
        <div class="user-meta">
          <span class="username">{{ newsData.user_name || '用户名' }}</span>
          <div class="time-location">
            <span class="time">{{ newsData.publish_date || '2023-09-15 14:30' }}</span>
            <span class="location" v-if="newsData.position">• {{ newsData.position }}</span>
          </div>
        </div>
      </section>

      <!-- Markdown 内容 -->
      <article class="article-content markdown-preview" v-html="renderedContent"></article>

      <!-- 底部栏 -->
      <footer class="article-footer">
        <input
          v-model="commentText"
          type="text"
          placeholder="输入评论..."
          @keyup.enter="handleComment"
          class="comment-input"
        />
        <button class="like-btn" :class="{ liked: isLiked }" @click="handleLike">
          {{ isLiked ? '❤️' : '🤍' }}
        </button>
      </footer>
    </template>
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #07c160;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 文章内容 */
.article-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background-color: #fff;
  word-break: break-word;
}

/* 图片样式优化 */
.markdown-preview :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
  display: block;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.markdown-preview :deep(pre) {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}

.markdown-preview :deep(code) {
  background: #f0f0f0;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 85%;
}

.markdown-preview :deep(blockquote) {
  border-left: 3px solid #e6e6e6;
  margin: 1.5rem 0;
  padding-left: 1rem;
  color: #666;
}

.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  padding-left: 2rem;
  margin: 1rem 0;
}

.markdown-preview :deep(li) {
  margin: 0.5rem 0;
}

.markdown-preview :deep(a) {
  color: #0366d6;
  text-decoration: none;
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
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
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

/* Markdown 预览样式 */
.markdown-preview :deep(h1),
.markdown-preview :deep(h2),
.markdown-preview :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.markdown-preview :deep(h1) {
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
  color: #1a73e8;
}

.markdown-preview :deep(h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
  color: #2c3e50;
}

.markdown-preview :deep(p) {
  margin: 1rem 0;
  line-height: 1.6;
}
</style>
