<template>
  <div class="profile">
    <div class="bg_img" :style="{ 'background-image': `url(${bg_img_url})` }">
      <div class="user-info">
        <div class="avatar-container">
          <!-- 用户头像展示 -->
          <div class="avatar" @click="openFileInput">
            <img :src="avatar_url" alt="用户头像" />
          </div>

          <!-- 隐藏的文件输入框 -->
          <input type="file" id="fileInput" style="display:none;" @change="handleFileChange" accept="image/*"/>
        </div>
        <div>
          <div class="username" @click="modifyProfile">{{ user_name }}</div>
          <div class="phone">手机：{{ phone_number }}</div>
        </div>
        <div class="more" @click="showDropdown = !showDropdown">
          <img data-v-7f755a55="" src="../assets/three_points_grey.png" style="width: 16px; height: 16px; margin-right: 5px; margin-top: 20px;">
          <div class="dropdown" v-if="showDropdown">
            <div class="dropdown-item" @click="handlePrivacy">隐私政策</div>
            <div class="dropdown-item" @click="handleLogoff">注销账号</div>
          </div>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <div class="action-btn" @click="go_reminders">
        <img style="width: 26px" src="../../public/tixing_items.png" alt="" />
        <div>提醒事项</div>
      </div>
      <div class="action-btn" @click="go_notification">
        <img style="width: 26px" src="../../public/notifications.png" alt="" />
        <div>消息中心</div>
      </div>
      <!--      <div class="action-btn" @click="goReminders">提醒事项</div>-->
    </div>

    <div class="menu-list">
      <div class="menu-item" @click="goHelp">
        <div><img class="img0" src="../../public/help_center.png" alt="" /></div>
        <div class="miaoshu1">帮助中心</div>
        <div class="jiantou"><img class="img2" src="../../public/jiantou.png" alt="" /></div>
      </div>
      <div class="menu-item" @click="goContact">
        <div><img class="img0" src="../../public/connection.png" alt="" /></div>
        <div class="miaoshu1">联系我们</div>
        <div class="jiantou"><img class="img2" src="../../public/jiantou.png" alt="" /></div>
      </div>
      <div class="menu-item" @click="logout">
        <div><img class="img0" src="../../public/logout.png" alt="" /></div>
        <div class="miaoshu1">退出登录</div>
        <div class="jiantou"><img class="img2" src="../../public/jiantou.png" alt="" /></div>
      </div>
    </div>
    <van-popup
      v-model:show="showCenter1"
      :style="{ padding: '10px', fontSize: '15px', width: '90%', height: '90%' }"
    >
      辅忆平台隐私保护协议
      <br />
      欢迎使用辅忆平台（以下简称"本系统"）。本系统由辅忆平台开发并运营。本公司非常重视用户的隐私保护。在您使用本系统的过程中，本公司将按照本隐私保护协议（以下简称"本协议"）收集、使用和共享您的信息。本协议旨在帮助您了解本公司如何处理您的个人信息以及您享有的权利。
      <br />
      在使用本系统前，请您仔细阅读并理解本协议的全部内容。若您不同意本协议的任何条款，请停止使用本系统。一旦您开始使用本系统，即表示您已同意本协议的全部内容。
      <br />
      一、信息的收集
      <br />
      个人信息
      <br />
      当您注册、登录和使用本系统时，本公司可能会收集您的个人信息，包括但不限于您的姓名、联系方式（如电话号码、电子邮件地址）、身份证明信息等。
      <br />
      使用信息
      <br />
      本公司会收集您在使用本系统过程中产生的相关信息，包括但不限于您使用的设备信息（如设备型号、操作系统、唯一设备标识符等）、日志信息（如访问时间、访问IP地址、浏览器类型等）、位置信息等。
      <br />第三方信息
      <br />
      在获得您的同意后，本公司可能从第三方合作伙伴处获取您的信息，以完善本公司的服务和提高用户体验。
      <br />
      二、信息的使用
      <br />
      提供服务
      <br />
      本公司将您的信息用于提供和维护本系统的正常运行，包括但不限于用户身份验证、客户服务、系统安全保障等。
      <br />
      改进服务
      <br />
      本公司可能会使用您的信息进行数据分析，以改进本系统的服务质量、用户体验和功能开发。
      <br />
      个性化推荐
      <br />
      根据您的使用行为和偏好，本公司可能会向您推荐个性化的商品和服务。
      <br />
      沟通联系
      <br />
      本公司可能会通过电子邮件、短信、电话等方式向您发送与本系统服务相关的信息，包括但不限于重要通知、技术支持、营销活动等。
      <br />
      三、信息的共享
      <br />
      与第三方服务提供商的共享
      <br />
      为了向您提供更好的服务，本公司可能会与第三方服务提供商共享您的信息。这些第三方服务提供商包括但不限于云服务提供商、支付服务提供商、物流服务提供商等。<br />
      法律要求
      <br />
      本公司将在法律法规规定的范围内共享您的信息。例如，在司法机关、监管机构等政府部门依法要求时，本公司将依法提供您的信息。
      <br />
      业务转让
      <br />
      如本公司发生合并、收购、资产转让等变更时，您的信息可能会作为此类交易的一部分而被转移。
      本公司将在信息转移前通知您并确保您的信息得到同等程度的保护。
      <br />
      四、信息的保护
      <br />
      技术措施
      <br />
      本公司采取严格的安全措施保护您的信息，防止未经授权的访问、披露、修改或毁坏。这些措施包括但不限于数据加密、访问控制、防火墙等。
      <br />
      管理措施
      <br />
      本公司建立了完善的信息安全管理制度，并定期对员工进行安全教育和培训，以提高他们的信息保护意识和技能。
      <br />
      五、用户权利
      <br />
      访问权
      <br />
      您有权随时访问和查看您的个人信息。您可以通过登录您的账号查看或更新您的个人信息。
      <br />
      更正权
      <br />
      您有权更正您的个人信息。若您发现您的信息有误，可以随时进行更正或通过联系客服进行更正。
      <br />
      删除权
      <br />
      在法律法规允许的范围内，您有权要求删除您的个人信息。若您决定不再使用本系统，可以通过联系客服删除您的账号及相关信息。
      <br />
      撤回同意权
      <br />
      您有权随时撤回对本公司收集、使用和共享您的个人信息的同意。撤回同意后，本公司将停止处理您的个人信息，但撤回同意不影响之前基于您的同意而进行的信息处理。
      <br />
      六、未成年人信息保护
      <br />
      未成年人使用
      <br />
      本系统主要面向成人用户。若您未满18周岁，建议您在父母或监护人的陪同下使用本系统，并确保您的父母或监护人同意您使用本系统并向本公司提供信息。
      <br />
      家长和监护人的责任
      <br />
      如果本公司发现未成年人在未得到父母或监护人同意的情况下提供了个人信息，本公司将删除相关信息。
      <br />
      七、隐私协议的变更
      <br />
      本公司有权随时修改本协议，并在本系统内公布。修改后的协议自公布之日起生效。若您在协议修改后继续使用本系统，则视为您已接受修改后的协议。
      <br />
      八、联系我们
      <br />
      如您对本协议有任何疑问、意见或建议，或在使用本系统时遇到任何问题，请通过以下方式与本公司联系：
      <br />
      <br />
      辅忆平台
      <br />
      2024年5月22日
      <br />
    </van-popup>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {delete_user_info, user_info} from '@/api/db.js'
import {get_cookie} from "@/util/auth.js";
import router from "@/router/index.js";
import {upload_avatar} from "@/api/aliyun.js";
import {showToast} from "vant";

const bg_img_url = ref('')
const avatar_url = ref('')
const user_name = ref('')
const phone_number = ref('')
const showDropdown = ref(false)
const user_id = get_cookie('user_id')
function modifyProfile() {
  router.push({
    name: 'ModifyProfile',
    params: { id: user_id } // 假设 user_id 是你要传递的唯一标识符
  });
}
user_info(user_id).then((res) => {
  console.log(res)
  bg_img_url.value = res.data.bg_img_url
  avatar_url.value = res.data.avatar_url
  user_name.value = res.data.user_name
  phone_number.value = mask_phone_number(res.data.phone_number)
})

function openFileInput() {
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
function mask_phone_number(phone_number) {
  // 检查输入是否为11位手机号
  if (phone_number.length !== 11) {
    throw new Error('Invalid phone number. It should be 11 digits long.')
  }
  // 手机号前三位，中间四位替换为星号，后四位
  return phone_number.substring(0, 3) + '****' + phone_number.substring(7)
}
const showCenter1 = ref(false)
function handlePrivacy() {
  showDropdown.value = false
  showCenter1.value = true
  // 处理隐私政策
}

const handleLogoff = () => {
  showDropdown.value = false
  delete_user_info(user_id)
  showToast("账号注销成功")
  router.push('/login')
  // 处理注销账号
}

const go_notification = () => {
  router.push('/message_center')
  // 跳转到消息中心
}

const go_reminders = () => {
  router.push('/tixing_items')
  // 跳转到提醒事项
}

const goHelp = () => {
  router.push('/help_center')
  // 跳转到帮助中心
}

const goContact = () => {
  router.push('/contact_us')
  // 跳转到联系我们
}

const logout = () => {
  // 处理退出登录
  // 清空本地coockie，并跳转至/login登录界面
  localStorage.clear()
  sessionStorage.clear()
  // 清除所有的Cookies
  document.cookie.split(";").forEach(cookie => {
    document.cookie = cookie
      .trim()
      .split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/"; // 设置过期时间为过去的时间点，使Cookie失效 [ty-reference](13)
  });
  window.location.href = '/login'
}


</script>

<style scoped>
.profile {
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: auto;
  background-color: #f6f6f6;
}
.bg_img {
  height: 20vh;
  width: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.user-info {
  position: absolute;
  margin-top: 15vh;
  margin-left: 6vw;
  width: 100vw;
  display: flex;
  align-items: center;
}

.avatar {
  width: 16vw;
  height: 16vw;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 5vw;
  position: relative; /* 添加此行 */
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  margin-top: 40px;
  font-size: 20px;
  font-weight: bold;
  color: #000000;
}

.phone {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 5px;
}

.more {
  color: #000000;
  position: relative;
  margin-left: 25vw;
}

.dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background: #eeeeee;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 1;
}

.dropdown-item {
  padding: 10px 20px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #000000;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 8vh;
  padding: 20px 0;
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #eee;
}

.action-btn {
  text-align: center;
  cursor: pointer;
}
.menu-list {
  color: #333333;
  font-size: 12px;
  padding-top: 10px;
  width: 343px;
  border-radius: 10px;
  background-color: #fff;
  margin: 15px 15px 0 15px;
}

.menu-item {
  padding: 12px 16px;
  display: flex;
  .img1 {
    width: 24px;
    height: 28px;
  }

  .img0 {
    width: 22px;
    height: 21px;
  }

  .img2 {
    width: 8px;
    height: 12px;
    margin: 5px 0 5px 0;
  }
}

.tabs1 {
  padding: 12px 16px;
  display: flex;

  .img1 {
    width: 24px;
    height: 28px;
  }

  .img0 {
    width: 22px;
    height: 21px;
  }

  .img2 {
    width: 8px;
    height: 12px;
    margin: 5px 0 5px 0;
  }
}

.miaoshu1 {
  margin-left: 5px;
  padding-top: 1px;
  font-family:
    PingFang SC,
    PingFang SC,
    sans-serif;
  font-weight: normal;
  font-size: 15px;
  color: #333333;
  line-height: 20px;
  text-align: center;
  font-style: normal;
  text-transform: none;
}

.jiantou {
  margin-left: auto;
}
</style>
