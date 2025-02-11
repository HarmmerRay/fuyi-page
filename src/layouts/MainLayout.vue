<template>
  <div class="main-layout">
    <div>
      <router-view></router-view>
    </div>
    <TabBar />
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
</style>
