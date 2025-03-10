<template>
  <div class="admin-sidebar">
    <div class="logo">
      <img src="../../public/logo.png" alt="Logo">
    </div>
    <nav class="nav-menu">
      <router-link to="/admin/videos" class="nav-item">
        <i class="fas fa-tv"></i>
        <span>视频管理</span>
      </router-link>
      <router-link to="/admin/comments" class="nav-item">
        <i class="fas fa-comments"></i>
        <span>评论管理</span>
      </router-link>
      <router-link to="/admin/users" class="nav-item">
        <i class="fas fa-users"></i>
        <span>用户管理</span>
      </router-link>
      <router-link to="/admin/logs" class="nav-item">
        <i class="fas fa-history"></i>
        <span>日志管理</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.admin-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: center;
}

.logo img {
  width: 218px;
  filter: drop-shadow(0 2px 4px rgba(229, 9, 20, 0.2));
}

.nav-menu {
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #8f9ba8;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: rgba(84, 54, 168, 0.1);
  color: #5436a8;
}

.nav-item.router-link-active {
  background: rgba(255,255,255,0.1);
  color: white;
  border-left: 3px solid #5436a8;
}

.nav-item i {
  width: 20px;
  text-align: center;
}
</style>

