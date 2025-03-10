<template>

  <!--  二级试图路由  第一级在App.vue文件中-->
  <div class="main-layout">
    <div class="nav-bar">
      <div class="left-action" @click="handleBack">
        <span class="back-icon">‹</span>
        <span v-if="!isMobile">返回</span>
      </div>
      <div class="title">{{ currentTitle }}</div>
    </div>
    <div class="page-content">
      <div class="content-wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMobile = ref(window.innerWidth < 750)
const navBarHeight = ref(48) // 根据实际高度调整

// 获取当前路由标题
const currentTitle = computed(() => {
  return router.currentRoute.value.meta?.title || '当前页面'
})

// 返回逻辑
const handleBack = () => {
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push('/') // 没有历史记录时退回首页
  }
}

// 响应式处理
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 750
})
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 50px;
}

.content-wrapper {
  max-width: 750px;
  margin: 0 auto;
  width: 100%;
  min-height: 100%;
}

@media screen and (min-width: 750px) {
  .page-content {
    background-color: #f5f5f5;
  }

  .content-wrapper {
    background-color: #fff;
    min-height: calc(100vh - 50px);
  }
}

.nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  height: v-bind(navBarHeight + 'px');
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 0 16px;
}

.left-action {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #1989fa;
  cursor: pointer;
  font-size: 16px;
}

.back-icon {
  font-size: 24px;
  line-height: 1;
}

.title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 17px;
  font-weight: 500;
  color: #333;
  max-width: 60%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 调整原有样式 */
.content-wrapper {
  padding-top: 0; /* 通过内联样式动态设置 */
}

@media screen and (min-width: 750px) {
  .nav-bar {
    max-width: 750px;
    margin: 0 auto;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
  }
}
</style>
