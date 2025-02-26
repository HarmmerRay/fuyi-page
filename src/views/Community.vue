<template>
  <div class="community">
    <div class="search-and-post">
      <van-search v-model="search_query" placeholder="搜索资讯" />
      <img src="@/assets/publish.png" alt="发布" @click="goToPost" class="publish-icon" />
    </div>
    <van-tabs v-model="active_tab" @click="fetch_data">
      <van-tab title="附近"></van-tab>
    </van-tabs>
    <div class="news-list">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">

      </van-list>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.community {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.search-and-post {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.publish-icon {
  width: 40px; /* 设置图标大小 */
  height: 40px; /* 设置图标大小 */
  margin-top: 8px;
  margin-right: 10px;
  cursor: pointer; /* 鼠标悬停时显示手形图标 */
}

.news-list {
  flex: 1;
}

.news-item {
  margin-bottom: 10px;
}

.text-content {
  padding: 10px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.summary {
  font-size: 14px;
  color: #666;
}

.date {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}


</style>
