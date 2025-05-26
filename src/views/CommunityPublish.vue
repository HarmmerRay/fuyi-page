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

    <!-- Markdown 编辑器 -->
    <div class="editor-container">
      <textarea
        v-model="articleContent"
        ref="editorRef"
        class="editor"
        placeholder="请输入Markdown内容..."
      ></textarea>
    </div>

    <!-- 插入图片按钮 -->
    <div class="image-toolbar">
      <button class="image-btn" @click="insertImage">
        <img
          src="@/assets/gallery_grey.png"
          alt="插入图片"
          class="image-icon"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import goBackGrey from '@/assets/go_back_grey.png'
import goBackBlue from '@/assets/go_back_blue.png'

// 响应式数据
const articleContent = ref('')
const editorRef = ref(null)
const isBackActivate = ref(false)
const backButtonSrc = computed(() => {
  return isBackActivate.value
      ? goBackBlue
      : goBackGrey
})

// 返回按钮功能
function goBack() {
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

// 插入图片功能
function insertImage() {
  const textarea = editorRef.value
  if (!textarea) return

  // 获取光标位置
  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  // 构造插入内容
  const imageSyntax = '[](https://)'
  const cursorPosition = start

  // 更新内容
  articleContent.value =
    articleContent.value.substring(0, start) +
    imageSyntax +
    articleContent.value.substring(end)

  // 移动光标到插入后的位置
  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd = cursorPosition + imageSyntax.length - 5
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
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #b3d9ff;
}

.title {
  flex: 1;
  text-align: center;
  margin: 0 20px;
  font-size: 1.5em;
  color: #1a73e8;
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
  width: 24px;
  height: 24px;
  filter: invert(40%);
  transition: transform 0.3s ease;
}

.image-icon:hover {
  transform: scale(1.1);
}
</style>
