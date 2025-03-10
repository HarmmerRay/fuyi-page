<template>
  <div class="container">
    <!-- 顶部导航栏 -->
    <div class="nav-bar">
      <img v-if= "show1" src="../assets/go_back_grey.png" alt="返回" class="icon" @click="handleBack">
      <img v-else src="../assets/go_back_grey.png" alt="返回" class="icon" @click="handleBack">
      <img v-if= "show2" src="../assets/check_grey.png" alt="确认" class="icon" @click="handleSubmit">
      <img v-else src="../assets/check_grey.png" alt="确认" class="icon" @click="handleSubmit">
    </div>

    <!-- 背景图片区域 -->
    <div class="banner" @click="changeBgImg" :style="{ backgroundImage: `url(${bg_img_url})` }">
      <input
        type="file"
        id="bannerInput"
        style="display: none;"
        accept="image/*"
        @change="handleBgChange"
      >
      <div class="banner-overlay">点击更换背景</div>
    </div>

    <!-- 圆形头像 -->
    <div class="avatar-wrapper" @click="handleAvatarClick">
      <!-- 头像遮罩层 -->
      <div class="avatar-mask"></div>

      <!-- 头像主体 -->
      <img :src="avatar_url" alt="头像" class="avatar">

      <!-- 相机图标和文字 -->
      <div class="avatar-overlay">
        <img
          src="@/assets/camera.png"
          alt="相机"
          class="camera-icon"
        >
        <span class="change-text">更换头像</span>
      </div>

      <!-- 隐藏的文件输入 -->
      <input type="file" id="fileInput" style="display:none;" @change="handleFileChange" accept="image/*"/>
    </div>

    <!-- 信息列表 -->
    <div class="info-list">
      <div class="item" v-for="item in formItems" :key="item.label">
        <span class="label">{{ item.label }}</span>
        <input
          type="text"
          class="input"
          :placeholder="item.placeholder"
          v-model="formData[item.key]"
        >
        <img
          src="../assets/go_forward_grey.png"
          alt="箭头"
          class="arrow-icon"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import router from "@/router/index.js";
import {reactive, ref} from "vue";
import {upload_avatar, upload_bg} from "@/api/aliyun.js";
import {useRoute} from "vue-router";
import {update_user_info, user_info} from "@/api/db.js";
let show1 = true;
let show2 = true;
const avatar_url = ref('')
const route = useRoute()
const user_id = route.params.id
const bg_img_url = ref('')
const formData = reactive({  // vue响应式
  username: '',
  phone: '',
  gender: '',
  birthday: '',
  location: ''
})
const formItems = [
  { label: '用户名', key: 'username', placeholder: '请输入用户名' },
  { label: '电话号', key: 'phone', placeholder: '请输入电话号' },
  { label: '性别', key: 'gender', placeholder: '请输入性别' },
  { label: '出生日期', key: 'birthday', placeholder: '请输入出生日期' },
  { label: '所在地', key: 'location', placeholder: '请输入所在地' },
]
user_info(user_id).then((res) => {
  console.log(res)
  bg_img_url.value = res.data.bg_img_url
  avatar_url.value = res.data.avatar_url
  formData['username'] = res.data.user_name
  formData['phone'] = res.data.phone_number
  formData['gender'] = res.data.gender
  formData['birthday'] = res.data.born_day
  formData['location'] = res.data.position
  console.log('提交数据:', formData)
})

function changeBgImg(){
  document.getElementById('bannerInput').click();
}
function handleBgChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    // 本地预览
    bg_img_url.value = e.target.result;
    // 上传到服务器
    upload_bg(user_id, bg_img_url.value, 'pictures/');
  };
  reader.readAsDataURL(file);
}
function handleBack() {
  show1 = false;
  router.back()
}
function handleSubmit() {
  show2 = false;
  // 将更新后的数据 更新到数据库中
  formData['user_id'] = user_id;
  update_user_info(formData)
  router.back()
}
function handleAvatarClick() {
  // 触发隐藏的文件输入框点击事件
  document.getElementById('fileInput').click();
}
function handleFileChange(event) {
  // showToast("处理文件改变")
  const file = event.target.files[0];
  if (!file) return; // 如果没有选择文件则返回

  // 创建一个FileReader对象来读取文件内容
  const reader = new FileReader();
  reader.onload = (e) => {
    console.log("E:",e);
    // 更新头像URL为本地预览
    avatar_url.value = e.target.result;
    // 在这里可以调用API将图片上传到服务器
    // uploadAvatar(file,oss_path);
    upload_avatar(user_id,avatar_url.value,'avatar/')
  };
  reader.readAsDataURL(file); // 以DataURL格式读取文件
}
</script>

<style scoped>
.container {
  position: relative;
  min-height: 100vh;
  background: #fff;
}

/* 顶部导航栏样式 */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  position: relative;
  z-index: 2;
}

.icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: filter 0.3s;
}

.icon:hover {
  filter: invert(39%) sepia(57%) saturate(2000%) hue-rotate(194deg) brightness(89%) contrast(92%);
}

/* 背景图片区域 */
.banner {
  width: 100%;
  height: 22vh;
  background: url('https://fuyi-pingtai.oss-cn-beijing.aliyuncs.com/avatar/bg.jpg') no-repeat center center;
  background-size: cover;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.banner:hover .banner-overlay {
  opacity: 1;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 16px;
  opacity: 0;
  transition: opacity 0.3s;
}
/* 头像样式 */
.avatar-wrapper {
  position: absolute;
  left: 50%;
  top: calc(22vh - 15px); /* 根据背景高度调整 */
  transform: translateX(-50%);
  z-index: 2;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.avatar-wrapper {
  position: absolute;
  left: 50%;
  top: calc(22vh - 15px);
  transform: translateX(-50%);
  z-index: 2;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
}

.avatar {
  width: 100px;
  height: 100px;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: block;
  transition: opacity 0.3s;
}

.avatar-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 50%;
}

.avatar-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.camera-icon {
  width: 20px;
  height: 20px;
  filter: invert(1);
  margin-bottom: 4px;
}

.change-text {
  color: white;
  font-size: 12px;
  white-space: nowrap;
}

.avatar-wrapper .avatar-mask,
.avatar-wrapper .avatar-overlay {
  opacity: 1;
}

.avatar-wrapper .avatar {
  opacity: 0.8;
}


/* 信息列表样式 */
.info-list {
  margin-top: 70px;
  padding: 0 16px;
}

.item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.label {
  width: 80px;
  font-size: 14px;
  color: #333;
}

.input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 0 12px;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  opacity: 0.6;
}


</style>
