<template>
  <div class="container">
    <!-- 顶部导航栏 -->
    <div class="header">
      <img :src="backButtonSrc" alt="返回" class="back-icon" @click="goBack" />
      <h1 class="title">资讯发布</h1>
      <button class="publish-btn" @click="publish" :disabled="!articleContent.trim()">发布</button>
    </div>

    <!-- 模式切换按钮 -->
    <div class="mode-toggle">
      <button :class="['toggle-btn', { active: !isPreviewMode }]" @click="isPreviewMode = false">
        编辑
      </button>
      <button :class="['toggle-btn', { active: isPreviewMode }]" @click="isPreviewMode = true">
        预览
      </button>
    </div>

    <!-- Markdown 编辑器 -->
    <div class="editor-container" v-show="!isPreviewMode">
      <textarea
        v-model="articleContent"
        ref="editorRef"
        class="editor"
        placeholder="请输入Markdown内容..."
      ></textarea>
    </div>

    <!-- Markdown 预览区域 -->
    <div class="preview-container" v-show="isPreviewMode">
      <div class="markdown-preview" v-html="renderedContent"></div>
    </div>

    <!-- 插入图片按钮 -->
    <div class="image-toolbar">
      <button class="image-btn" @click="insertImage">
        <img :src="insertImageButtonSrc" alt="插入图片" class="image-icon" />
      </button>
      <!-- 隐藏的文件输入框 -->
      <input
        type="file"
        ref="fileInputRef"
        class="file-input"
        accept="image/*"
        @change="handleFileChange"
      />
    </div>

    <!-- 上传进度提示 -->
    <div class="upload-progress" v-if="isUploading">
      <div class="progress-text">图片上传中...</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import goBackGrey from '@/assets/go_back_grey.png'
import goBackBlue from '@/assets/go_back_blue.png'
import MarkdownIt from 'markdown-it'
import hljs from 'markdown-it-highlightjs'
import { upload_picture } from '@/api/aliyun'
import { useCounterStore } from '@/stores/counter'
import { publish_news } from '@/api/db' // 导入发布资讯的方法

// 获取用户ID
const counterStore = useCounterStore()
const userId = computed(() => counterStore.user_id)

// 初始化markdown-it解析器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {
        console.error('Highlight.js 语法高亮错误:', __)
      }
    }
    return '' // 使用默认的转义
  },
})

// 响应式数据
const articleContent = ref('')
const editorRef = ref(null)
const fileInputRef = ref(null) // 文件输入引用
const isBackActivate = ref(false)
const isPreviewMode = ref(false) // 预览模式状态
const isUploading = ref(false) // 上传状态
const cursorPosition = ref(0) // 保存当前光标位置

// 计算属性：渲染后的Markdown内容
const renderedContent = computed(() => {
  return md.render(articleContent.value || '')
})

const backButtonSrc = computed(() => {
  return isBackActivate.value ? goBackBlue : goBackGrey
})

// 返回按钮功能
function goBack() {
  isBackActivate.value = !isBackActivate.value
  window.history.back()
}

// 发布按钮功能
async function publish() {
  // 将函数改为异步
  if (!articleContent.value.trim()) {
    alert('内容不能为空！')
    return
  }

  try {
    // 1. 获取当前位置 (假设存在一个全局或导入的 getCurrentLocation 方法)
    // 如果您的位置获取方法不同，请替换这里的调用
    const position = await getCurrentLocation() // 假设此函数返回 { latitude, longitude }
    if (!position) {
      alert('无法获取当前位置，请检查位置权限设置。')
      return
    }

    // 2. 从Markdown内容中提取图片URL列表
    const imageUrls = extractImageUrls(articleContent.value)

    // 3. 构造发布数据
    const newsData = {
      content: articleContent.value,
      images: imageUrls,
      position: {
        // 将位置信息作为字典类型添加
        latitude: position.latitude,
        longitude: position.longitude,
      },
      // 您可能还需要添加其他字段，例如 user_id，取决于后端接口要求
      user_id: userId.value, // 假设后端需要user_id
    }

    // 4. 调用发布接口
    const response = await publish_news(newsData)

    console.log('发布结果:', response)
    // 5. 处理发布结果
    if (response && response.data && response.data.status) {
      // 假设后端返回 success 字段表示成功
      alert('文章发布成功！')
      // 发布成功后可以考虑清空编辑器或跳转页面
      articleContent.value = ''
    } else {
      // 假设后端返回错误信息在 response.data.message 或其他字段
      alert(
        '文章发布失败：' +
          (response && response.data && response.data.message ? response.data.message : '未知错误'),
      )
    }
  } catch (error) {
    console.error('发布文章出错:', error)
    alert('发布文章出错，请重试。')
  }
}

import galleryBlue from '@/assets/gallery_blue.png'
import galleryGrey from '@/assets/gallery_grey.png'
const isGalleryActivate = ref(false)
const insertImageButtonSrc = computed(() => {
  return isGalleryActivate.value ? galleryBlue : galleryGrey
})

// 插入图片功能 - 触发文件选择
function insertImage() {
  isGalleryActivate.value = !isGalleryActivate.value

  // 保存当前光标位置
  const textarea = editorRef.value
  if (textarea) {
    cursorPosition.value = textarea.selectionStart
  }

  // 触发文件选择
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

// 处理文件选择和上传
async function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  try {
    // 显示上传状态
    isUploading.value = true

    // 将文件转换为base64
    const fileBase64 = await fileToBase64(file)

    // 调用上传接口
    // 注意：根据aliyun.js中的upload_picture函数定义，它只需要file_base64和oss_path
    // 如果您的后端需要user_id，请根据实际情况调整upload_picture函数或这里的调用
    const response = await upload_picture(fileBase64, 'pictures/')
    console.log('上传结果:', response)
    // 检查上传是否成功
    if (response && response.data && response.data.oss_url) {
      // 获取上传后的图片URL
      const imageUrl = response.data.oss_url
      // 插入图片到编辑器
      insertImageToEditor(imageUrl)
    } else {
      alert('图片上传失败，请重试')
    }
  } catch (error) {
    console.error('上传图片出错:', error)
    alert('图片上传出错，请重试')
  } finally {
    // 隐藏上传状态
    isUploading.value = false
    // 清空文件输入，以便再次选择同一文件
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

// 将文件转换为base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      // 移除base64前缀（如data:image/jpeg;base64,）
      const base64String = reader.result.split(',')[1]
      resolve(base64String)
    }
    reader.onerror = (error) => reject(error)
  })
}

// 插入图片到编辑器
function insertImageToEditor(imageUrl) {
  const textarea = editorRef.value
  if (!textarea) return

  // 构造Markdown图片语法
  const imageSyntax = `![图片描述](${imageUrl})`

  // 更新内容
  const position = cursorPosition.value
  articleContent.value =
    articleContent.value.substring(0, position) +
    imageSyntax +
    articleContent.value.substring(position)

  // 移动光标到插入后的位置
  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd = position + 5 // 将光标定位到图片描述位置
    textarea.focus()
  }, 0)
}

// 辅助函数：从Markdown内容中提取图片URL
function extractImageUrls(markdownContent) {
  const imageUrls = []
  // 匹配Markdown图片语法: ![alt text](url)
  const regex = /!\[.*?\]\((.*?)\)/g
  let match
  while ((match = regex.exec(markdownContent)) !== null) {
    // match[1] 包含捕获组中的URL
    imageUrls.push(match[1])
  }
  return imageUrls
}

// 假设的位置获取函数 (您需要根据您的项目实际情况实现或导入此函数)
async function getCurrentLocation() {
  // 示例：使用浏览器 Geolocation API
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error('获取位置失败:', error)
          reject(error)
        },
      )
    } else {
      console.error('浏览器不支持地理位置获取')
      reject(new Error('Geolocation is not supported by this browser.'))
    }
  })
}
</script>

<style scoped>
.container {
  background-color: #e6f7ff;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏样式 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #b3d9ff;
}

.title {
  flex: 1;
  text-align: center;
  margin: 0 20px;
  font-size: 1.5em;
  color: #4d98f8;
}

/* 返回图标样式 */
.back-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  filter: brightness(0.8);
  transition: filter 0.3s ease;
}

.back-icon:hover {
  filter: brightness(1);
}

/* 发布按钮样式 */
.publish-btn {
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.publish-btn:disabled {
  background-color: #9ec1cf;
  cursor: not-allowed;
}

/* 模式切换按钮样式 */
.mode-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.toggle-btn {
  background-color: #f0f8ff;
  border: 1px solid #b3d9ff;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn:first-child {
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}

.toggle-btn:last-child {
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}

.toggle-btn.active {
  background-color: #1a73e8;
  color: white;
  border-color: #1a73e8;
}

/* 编辑器容器 */
.editor-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* 编辑器样式 */
.editor {
  width: 100%;
  min-height: 60vh;
  height: 100%;
  resize: none;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  padding: 10px;
  border: none;
  outline: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background-color: transparent;
  overflow-y: auto;
  scrollbar-width: thin;
}

/* 预览容器 */
.preview-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  overflow-y: auto;
}

/* Markdown 预览样式 */
.markdown-preview {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #333;
}

/* Markdown 标题样式 */
.markdown-preview :deep(h1) {
  font-size: 2em;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
  color: #1a73e8;
}

.markdown-preview :deep(h2) {
  font-size: 1.5em;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
  color: #2c3e50;
}

.markdown-preview :deep(h3) {
  font-size: 1.17em;
  margin-top: 1em;
  margin-bottom: 1em;
  color: #2c3e50;
}

.markdown-preview :deep(h4) {
  font-size: 1em;
  margin-top: 1.33em;
  margin-bottom: 1.33em;
  color: #2c3e50;
}

/* Markdown 段落样式 */
.markdown-preview :deep(p) {
  margin-top: 1em;
  margin-bottom: 1em;
}

/* Markdown 列表样式 */
.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  padding-left: 2em;
  margin-top: 1em;
  margin-bottom: 1em;
}

/* Markdown 代码块样式 */
.markdown-preview :deep(pre) {
  background-color: #f6f8fa;
  border-radius: 3px;
  padding: 16px;
  overflow: auto;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 85%;
  line-height: 1.45;
}

.markdown-preview :deep(code) {
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 85%;
  padding: 0.2em 0.4em;
}

/* Markdown 引用样式 */
.markdown-preview :deep(blockquote) {
  margin: 1em 0;
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
}

/* Markdown 图片样式 */
.markdown-preview :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1em auto;
}

/* Markdown 链接样式 */
.markdown-preview :deep(a) {
  color: #0366d6;
  text-decoration: none;
}

.markdown-preview :deep(a:hover) {
  text-decoration: underline;
}

/* 图片工具栏 */
.image-toolbar {
  width: 100%;
  height: 60px;
  border-top: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f8ff;
  position: sticky;
  bottom: 0;
  left: 0;
  z-index: 10;
}

/* 插入图片按钮 */
.image-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-icon {
  width: 34px;
  height: 34px;
  filter: invert(40%);
  transition: transform 0.5s ease;
}

.image-icon:hover {
  transform: scale(1.3);
}

/* 隐藏文件输入框 */
.file-input {
  display: none;
}

/* 上传进度提示 */
.upload-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.progress-text {
  background-color: white;
  padding: 20px 30px;
  border-radius: 10px;
  font-size: 18px;
  color: #1a73e8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
