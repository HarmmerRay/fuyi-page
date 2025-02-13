<template>
  <div class="tab-bar">
    <router-link to="/home">
      <img v-if="show1" src="../../public/home_grey.png" style="width: 6vw" alt="" />
      <img v-else src="../../public/home_blue.png" style="width: 6vw" alt="" />
      <div>首页</div>
    </router-link>
    <router-link to="/community">
      <img v-if="show2" src="../../public/community_grey.png" style="width: 6vw" alt="" />
      <img v-else src="../../public/community_blue.png" style="width: 6vw" alt="" />
      <div>资讯</div>
    </router-link>
    <router-link to="/profile">
      <img v-if="show3" src="../../public/profile_grey.png" style="width: 6vw" alt="" />
      <img v-else src="../../public/profile_blue.png" style="width: 6vw" alt="" />
      <div>我的</div>
    </router-link>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const show1 = ref(route.path !== '/home')
const show2 = ref(route.path !== '/community')
const show3 = ref(route.path !== '/profile')

watch(
  () => route.path,
  (newPath) => {
    show1.value = newPath !== '/home'
    show2.value = newPath !== '/community'
    show3.value = newPath !== '/profile'
  },
)
</script>

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
