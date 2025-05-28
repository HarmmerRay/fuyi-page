<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'

import highlightjs from 'markdown-it-highlightjs'
import {
  select_news_by_id,
  like_news,
  unlike_news,
  add_comment,
  get_comments,
  check_like_status,
} from '@/api/db.js'

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
const comments = ref([]) // 存储评论列表

// 计算属性：渲染后的Markdown内容
const renderedContent = computed(() => {
  return md.render(articleContent.value || '')
})

// 获取资讯详情
const fetchNewsDetail = async () => {
  try {
    loading.value = true
    const news_id = route.params.news_id
    // console.log('获取资讯详情，news_id:', news_id)

    // 调用API获取资讯详情
    const response = await select_news_by_id(news_id)
    // console.log('获取资讯详情成功:', response.data)
    if (response.data.status === '1' && response.data.data) {
      newsData.value = response.data.data
      // 确保publish_time和location有默认值
      newsData.value.publish_time = newsData.value.publish_time || '未知时间'
      newsData.value.location = newsData.value.location || '未知地点'

      // 设置文章内容
      articleContent.value = `# ${newsData.value.title || '资讯详情'}\n\n${newsData.value.content || ''}`

      // 检查是否已点赞
      if (newsData.value.is_liked) {
        isLiked.value = true
        likeId.value = newsData.value.like_id || null
      } else {
        isLiked.value = false
        likeId.value = null
      }
    } else {
      console.error('获取资讯详情失败:', response.data.msg)
      // 使用localStorage中的数据作为备选
      const cachedItem = JSON.parse(localStorage.getItem('item_' + news_id) || '{}')
      if (cachedItem) {
        newsData.value = cachedItem
        // 确保从localStorage加载的数据也有默认值
        newsData.value.publish_time = newsData.value.publish_time || '未知时间'
        newsData.value.location = newsData.value.location || '未知地点'
        articleContent.value = `# ${cachedItem.title || '资讯详情'}\n\n${cachedItem.content || ''}`
        // 检查是否已点赞
        if (cachedItem.is_liked) {
          isLiked.value = true
          likeId.value = cachedItem.like_id || null
        } else {
          isLiked.value = false
          likeId.value = null
        }
      }
    }
  } catch (error) {
    console.error('获取资讯详情出错:', error)
  } finally {
    loading.value = false
  }
}

// 获取评论列表
const fetchComments = async (news_id) => {
  try {
    const response = await get_comments(news_id)
    // console.log('comments', response.data.data)
    if (response.data.status === '1' && response.data.data) {
      comments.value = response.data.data
    } else {
      console.error('获取评论失败:', response.data.msg)
    }
  } catch (error) {
    console.error('获取评论出错:', error)
  }
}

// 在组件挂载时获取资讯详情和评论
onMounted(async () => {
  await fetchNewsDetail()
  if (newsData.value && newsData.value.news_id) {
    fetchComments(newsData.value.news_id)
    // 查询当前用户是否已点赞
    const likeStatusRes = await check_like_status(newsData.value.news_id)
    if (likeStatusRes.data && likeStatusRes.data.status === '1' && likeStatusRes.data.data) {
      isLiked.value = !!likeStatusRes.data.data.is_liked
    } else {
      isLiked.value = false
    }
  }
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
      // console.log('点赞响应:', response.data)
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
        // alert('评论已提交：' + commentText.value)
        commentText.value = ''
        // 评论成功后刷新评论列表
        if (newsData.value && newsData.value.news_id) {
          fetchComments(newsData.value.news_id)
        }
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

const handleShareToWeChat = () => {
  // 这里实现转发到微信的功能调度
  alert('转发到微信待实现，需要前往微信开发者中心申请权限（无域名暂时申请不了）')
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
      </div>
      <h1 class="title">资讯详细</h1>
      <button class="share-btn" @click="handleShareToWeChat">
        <img src="@/assets/wechat-icon.png" alt="微信转发" class="logo" />
      </button>
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

      <!-- 评论区 -->
      <div class="comments-section">
        <h2>评论 ({{ comments.length }})</h2>
        <div v-if="comments.length > 0" class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <img
                :src="comment.avatar_url || 'https://picsum.photos/40/40'"
                class="comment-avatar"
              />
              <span class="comment-user">{{ comment.user_name || '匿名用户' }}</span>
              <span class="comment-time">{{ comment.create_time }}</span>
            </div>
            <p class="comment-content">{{ comment.content }}</p>
          </div>
          <div class="comments-end">—— 已经到底啦 ——</div>
        </div>
        <div v-else class="no-comments">暂无评论，快来发表你的看法吧！</div>
      </div>

      <!-- 固定底部栏 -->
      <footer class="article-footer fixed-footer">
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
  min-height: 100vh;
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

.title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  flex: 1;
  text-align: center;
}

.share-btn {
  background: none;
  border: none;
  font-size: 0.9rem;
  color: #07c160;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.logo {
  height: 2rem;
  vertical-align: middle;
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
  padding: 1.5rem;
  background-color: #fff;
  word-break: break-word;
  line-height: 1.6;
  color: #333;
}

.article-content img {
  max-width: 100%; /* 限制图片最大宽度为父容器的100% */
  height: auto; /* 保持图片宽高比 */
  display: block; /* 避免图片下方出现空白 */
  margin: 10px auto; /* 图片居中显示，并添加上下边距 */
}

/* 评论区样式 */
.comments-section {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border-top: 1px solid #eee;
}

.comments-section h2 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
  border-bottom: 2px solid #409eff;
  padding-bottom: 10px;
}

.comments-list {
  margin-top: 10px;
}

.comment-item {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
  vertical-align: middle;
}

.comment-user {
  font-weight: bold;
  color: #555;
  margin-right: 10px;
}

.comment-time {
  font-size: 12px;
  color: #999;
  margin-left: auto;
}

.comment-content {
  font-size: 15px;
  color: #333;
  line-height: 1.6;
}

.comments-end {
  text-align: center;
  color: #bbb;
  margin: 20px 0 0 0;
  font-size: 14px;
}

.no-comments {
  text-align: center;
  color: #999;
  padding: 20px;
  border: 1px dashed #eee;
  border-radius: 8px;
  margin-top: 10px;
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

/* 样式调整：固定底部栏 */
.fixed-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
}

/* 给内容和评论区底部留出空间，避免被底部栏遮挡 */
.article-content,
.comments-section {
  padding-bottom: 70px;
}
</style>
