<template>
  <div class="tab-bar">
    <router-link to="/home">首页</router-link>
    <router-link to="/community">社区资讯</router-link>
    <router-link to="/profile">我的</router-link>
  </div>
</template>

<script setup></script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #eee;
}

a {
  text-decoration: none;
  color: #333;
}

a.router-link-active {
  color: #42b983;
}
</style>
