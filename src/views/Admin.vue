<template>
  <div class="admin-layout">
    <AdminSide class="sidebar"/>
    <div class="main-content">
      <AdminHeader class="header"/>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminSide from "@/components/AdminSide.vue";
import AdminHeader from "@/components/AdminHeader.vue";
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background: #1a1a1a;
  border-right: 1px solid rgba(255,255,255,0.1);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  flex-shrink: 0;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>

