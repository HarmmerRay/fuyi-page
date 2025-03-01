<template>

  <!--  二级试图路由  第一级在App.vue文件中-->
  <div class="main-layout">
    <div class="page-content">
      <div class="content-wrapper">
        <router-view></router-view>

      </div>
    </div>
    <TabBar/>
  </div>
</template>

<script setup>
import TabBar from '../components/TabBar.vue'
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
</style>
