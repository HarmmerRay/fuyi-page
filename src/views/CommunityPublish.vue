<template>
  <div class="container">
    <!-- 顶部导航栏 -->
    <div class="header">
      <img
        :src="backButtonSrc"
        alt="返回"
        class="back-icon"
        @click="goBack"
      />
      <h1 class="title">资讯发布</h1>
      <button
        class="publish-btn"
        @click="publish"
        :disabled="!articleContent.trim()"
      >
        发布
      </button>
    </div>

    <!-- 模式切换按钮 -->
    <div class="mode-toggle">
      <button 
        :class="['toggle-btn', { active: !isPreviewMode }]" 
        @click="isPreviewMode = false"
      >
        编辑
      </button>
      <button 
        :class="['toggle-btn', { active: isPreviewMode }]" 
        @click="isPreviewMode = true"
      >
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
        <img
          :src="insertImageButtonSrc"
          alt="插入图片"
          class="image-icon"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watch} from 'vue'
import goBackGrey from '@/assets/go_back_grey.png'
import goBackBlue from '@/assets/go_back_blue.png'
import MarkdownIt from 'markdown-it'
import hljs from 'markdown-it-highlightjs'

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
      } catch (__) {}
    }
    return '' // 使用默认的转义
  }
})

// 响应式数据
const articleContent = ref('')
const editorRef = ref(null)
const isBackActivate = ref(false)
const isPreviewMode = ref(false) // 预览模式状态

// 计算属性：渲染后的Markdown内容
const renderedContent = computed(() => {
  return md.render(articleContent.value || '')
})

const backButtonSrc = computed(() => {
  return isBackActivate.value
      ? goBackBlue
      : goBackGrey
})

// 返回按钮功能
function goBack() {
  isBackActivate.value = !isBackActivate.value
  window.history.back()
}

// 发布按钮功能
function publish() {
  if (articleContent.value.trim()) {
    alert('文章已发布：\n' + articleContent.value)
  } else {
    alert('内容不能为空！')
  }
}

import galleryBlue from "@/assets/gallery_blue.png"
import galleryGrey from "@/assets/gallery_grey.png"
const isGalleryActivate = ref(false)
const insertImageButtonSrc = computed(() => {
  return isGalleryActivate.value
      ? galleryBlue
      : galleryGrey
})
// 插入图片功能
function insertImage() {
  isGalleryActivate.value = !isGalleryActivate.value
  const textarea = editorRef.value
  if (!textarea) return

  // 获取光标位置
  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  // 构造插入内容
  const imageSyntax = '![图片描述](https://)'
  const cursorPosition = start

  // 更新内容
  articleContent.value =
    articleContent.value.substring(0, start) +
    imageSyntax +
    articleContent.value.substring(end)

  // 移动光标到插入后的位置
  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd = cursorPosition + 5 // 将光标定位到图片描述位置
    textarea.focus()
  }, 0)
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
.markdown-preview :deep(ul), .markdown-preview :deep(ol) {
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
</style>
