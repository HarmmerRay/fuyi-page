<template>
  <div class="container">
    <!-- 顶部导航栏 -->
    <div class="header">
      <button class="back-btn" @click="goBack">返回</button>
      <h1 class="title">资讯发布</h1>
      <button class="publish-btn" @click="publish">发布</button>
    </div>

    <!-- Markdown 编辑器 -->
    <textarea
      v-model="articleContent"
      ref="editorRef"
      class="editor"
      placeholder="请输入Markdown内容..."
    ></textarea>

    <!-- 工具栏 -->
    <div class="toolbar">
      <button class="image-btn" @click="insertImage" :class="{ active: isImageBtnActive }">
        <i class="fas fa-image"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 响应式数据
const articleContent = ref('')
const editorRef = ref(null)
const isImageBtnActive = ref(false)

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
  const imageSyntax = '![](https://)'
  const cursorPosition = start

  // 更新内容
  articleContent.value =
    articleContent.value.substring(0, start) +
    imageSyntax +
    articleContent.value.substring(end)

  // 设置按钮激活状态
  isImageBtnActive.value = true
  setTimeout(() => {
    isImageBtnActive.value = false
  }, 300)

  // 移动光标到插入后的位置
  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd = cursorPosition
    textarea.focus()
  }, 0)
}
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

/* 顶部导航栏样式 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.title {
  flex: 1;
  text-align: center;
  margin: 0 20px;
  font-size: 1.5em;
}

/* 按钮样式 */
button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn {
  background-color: #f0f0f0;
  color: #333;
}

.publish-btn {
  background-color: #42b883;
  color: white;
}

.publish-btn:hover {
  background-color: #36a372;
}

/* 编辑器样式 */
.editor {
  width: 100%;
  height: 60vh;
  resize: none;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

/* 工具栏样式 */
.toolbar {
  margin-top: 10px;
  text-align: right;
}

.image-btn {
  background: none;
  border: none;
  color: #000;
  font-size: 1.5em;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.image-btn.active {
  color: #42b883;
  transform: scale(1.1);
}

.image-btn:hover {
  color: #42b883;
}
</style>
