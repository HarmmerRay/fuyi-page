<template>
  <div class="login">
    <h2>登录页面</h2>
    <div class="form">
      <input v-model="phone" type="text" placeholder="请输入手机号" />
      <input v-model="code" type="text" placeholder="请输入验证码" />
      <button @click="handleLogin">登录</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const phone = ref('')
const code = ref('')

const handleLogin = () => {
  if (phone.value === 'admin' && code.value === '1111') {
    router.push('/home')
  } else {
    alert('手机号或验证码错误')
  }
}
</script>

<style scoped>
.login {
  padding: 20px;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
