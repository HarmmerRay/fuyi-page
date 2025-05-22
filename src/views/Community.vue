<template>
  <div class="community">
    <div class="search-and-post">
      <van-search v-model="search_query" placeholder="搜索资讯"/>
      <img src="@/assets/publish.png" alt="发布" @click="go_to_post" class="publish-icon"/>
    </div>
    <div class="location-bar" @click="handleLocationClick">
  <span v-if="locationLoading" class="location-text">
    <van-loading type="spinner" size="16px"/> 获取中...
  </span>
      <span v-else-if="currentLocation" class="location-text">
    📍 定位：{{ currentLocation.addressComponent.township }}
  </span>
      <span v-else class="location-text">📍 获取不到位置信息</span>
    </div>
    <van-popup
      v-model:show="showLocationDetail"
      position="bottom"
      round
      :style="{ height: '40%' }"
    >
      <div class="location-detail">
        <h3>当前位置详情</h3>
        <template v-if="currentLocation">
          <div class="detail-item">
            <label>详细地址：</label>
            <span>{{ currentLocation.formatted_address }}</span>
          </div>
          <div class="detail-item">
            <label>精度：</label>
            <span>{{ currentLocation.accuracy }}米</span>
          </div>
        </template>
        <div v-else class="empty-tip">
          <van-icon name="warning" color="#ff976a"/>
          <p>尚未获取到有效位置信息</p>
        </div>
      </div>
    </van-popup>
    <van-tabs v-model="active_tab">
      <van-tab title="附近"></van-tab>
    </van-tabs>
    <div class="news-list">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="on_load">

        <template v-if="loading && !items.length">
          <div class="loading-wrapper">
            <van-loading
              size="24px"
              vertical
              color="#1989fa"
            >
              拼命加载中...
            </van-loading>
          </div>
        </template>

        <template v-else>
          <div v-for="(item, index) in items" :key="index" class="item" @click="go_detail(item)">
            <!-- 头像、用户名、发布日期 -->
            <van-row type="flex" align="center">
              <van-col span="2">
                <van-image
                  round
                  width="23px"
                  height="23px"
                  :src="item.avatar_url"
                />
              </van-col>
              <van-col span="16">
                <p class="username">{{ item.user_name }}</p>
              </van-col>
              <van-col>
                <p class="publish-date">{{ item.publish_date }}</p>
              </van-col>
            </van-row>
            <!-- 文字简介 -->
            <p class="content">{{ item.content.slice(0, 200) }}...</p>

            <!-- 图片 -->
            <van-row gutter="10" v-if="item.images.length > 0" class="image-row">
              <van-col v-for="(image, imgIndex) in item.images.slice(0, 3)" :key="imgIndex" class="image-col"
                       :style="getImageContainerStyle(image)">
                <van-image
                  fit="cover"
                  width="100%"
                  height="100%"
                  :src="image"
                  @load="(e) => handleImageLoad(e, image)"
                />
              </van-col>
            </van-row>

            <!-- 分享按钮、评论数、点赞数、浏览数 -->
            <van-row type="flex">
              <van-col span="6" style="text-align: left;font-size: 14px;color: #999">
                <p>发布于: {{ item.position }}</p>
              </van-col>
              <van-col span="5">
                <p>评论: {{ item.comment_count }}</p>
              </van-col>
              <van-col span="5">
                <p>点赞: {{ item.like_count }}</p>
              </van-col>
              <van-col span="6">
                <p>浏览: {{ item.view_count }}</p>
              </van-col>
              <van-col>
                <div class="overlay" v-if="isOverlayVisible" @click="handleOverlayClick"></div>
                <div class="share-container" :class="{ 'active': isActive }" @click.stop="handleShareClick">
                  <!-- 使用 img 标签实现图标切换 -->
                  <img
                    class="share-icon"
                    :src="isActive ? blueIcon : greyIcon"
                    alt="分享按钮"
                    @click.stop="handleShareClick"
                  />

                  <!-- 分享菜单 -->
                  <div v-if="showShareMenu" class="share-menu">
                    <div class="menu-item" @click.stop="shareToWechat(item)">
                      <img src="@/assets/wechat-icon.png" alt="微信好友">
                      <span>微信好友</span>
                    </div>
                    <div class="menu-item" @click.stop="shareToMoment(item)">
                      <img src="@/assets/moment-icon.png" alt="朋友圈">
                      <span>朋友圈</span>
                    </div>
                  </div>
                </div>
              </van-col>
            </van-row>
          </div>
        </template>
        <!-- 底部加载提示 -->
        <template #loading>
          <div class="bottom-loading">
            <van-loading
              size="18px"
              vertical
              color="#969799"
            >
              正在加载更多...
            </van-loading>
          </div>
        </template>
      </van-list>

    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {showToast} from 'vant';
import {get_location, nearby_news_info} from "@/api/db.js";
// -----------------------分享功能----------------------------
import greyIcon from '@/assets/share_grey.png' // 确保路径正确
import blueIcon from '@/assets/share_blue.png'
import router from "@/router/index.js";

const search_query = ref('')
const active_tab = ref(true)
const loading = ref(true);
const finished = ref(false);
const items = ref([]);


const trackShare = (type) => {
  // 埋点逻辑
  this.$ga.event('Share', type, currentShareItem.value.id)
}

// todo 发布资讯页面跳转
const go_to_post = () => {
    router.push("/community_publish")
}
// -----------------------获取定位---------------------------
// 定位相关状态
const currentLocation = ref(null);
const locationLoading = ref(false);
const showLocationDetail = ref(false);

// 获取详细位置信息
async function getDetailLocation(position) {
  try {
    // console.log('position',position);
    let data = ''
    const res = await get_location(position);
    data = res.data;
    if (data.status === '1' && data.regeocode) {
      // console.log("return data",data.regeocode)
      return data.regeocode;
    }
  } catch (error) {
    console.error('获取详细位置失败:', error);
    return null;
  }
}

// 获取定位经纬度数据
const getCoordinate = async () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      // 成功回调
      const latitude = position.coords.latitude;  // 纬度
      const longitude = position.coords.longitude; // 经度
      const accuracy = position.coords.accuracy;   // 精度（米）
      console.log("定位成功：", {latitude, longitude, accuracy});
    }, (error) => {
      // 失败回调
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.error("用户拒绝授权");
          break;
        case error.POSITION_UNAVAILABLE:
          console.error("无法获取位置");
          break;
        case error.TIMEOUT:
          console.error("请求超时");
          break;
      }
    }, {
      enableHighAccuracy: true,  // 是否高精度模式（GPS）
      timeout: 10000,            // 超时时间（毫秒）
      maximumAge: 30000          // 允许使用缓存位置的最大时间
    });
  } else {
    console.error("浏览器不支持定位功能");
  }
}

// 定义一个获取地理位置信息的异步函数
// 异步函数的父函数也得用async标注上异步；调用异步函数获取数据时，使用await等待其进行完毕。
async function getLocation() {
  return new Promise((resolve, reject) => {
    // 检查浏览器是否支持地理定位
    if (!navigator.geolocation) {
      reject('浏览器不支持定位');
    }

    // 使用getCurrentPosition方法尝试获取当前位置
    navigator.geolocation.getCurrentPosition(
      // 成功回调：当获取位置成功时触发
      position => resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: Date.now()
      }),
      // 错误回调：当获取位置失败时触发
      error => reject(error),
      // 可选配置项，如高精度、超时等
      {enableHighAccuracy: true, timeout: 10000}
    );
  });
}


// 处理定位点击
const handleLocationClick = async () => {
  if (currentLocation.value) {
    showLocationDetail.value = true;
    return;
  }

  if (locationLoading.value) return;

  locationLoading.value = true;
  showToast({message: '正在获取位置...', duration: 1500});

  try {
    init_location()
  } catch (error) {
    console.error('定位失败:', error);
    showToast({
      message: error.PERMISSION_DENIED ? '请授权位置权限' : '获取位置失败',
      position: 'bottom'
    });
  } finally {
    locationLoading.value = false;
  }
};

const init_location = async function () {
  let storedGeo = localStorage.getItem('geoData');
  if (storedGeo) {
    currentLocation.value = await getDetailLocation(storedGeo)
    currentLocation.value.accuracy = JSON.parse(storedGeo)['accuracy'];
    // console.log("currentLocation.value", currentLocation.value);
  } else {
    storedGeo = await getLocation();
    localStorage.setItem('geoData', JSON.stringify(storedGeo));
    currentLocation.value = await getDetailLocation(storedGeo);
  }
  return !!(currentLocation.value && storedGeo);
}
// -----------------------加载数据---------------------------


let index = 0
const fetchData = async function () {
  // 从本地存储获取地理信息
  const storedGeo = localStorage.getItem('geoData');

  if (!storedGeo) {
    console.error("未找到地理位置信息");
    // 可以在这里触发重新获取定位
    await init_location()
    return fetchData()
  }

  const geoData = JSON.parse(storedGeo);
  // 添加有效性检查（示例：60分钟内的定位）
  // const THIRTY_MINUTES = 60 * 60 * 1000;
  // if (new Date().getTime() - geoData.timestamp > THIRTY_MINUTES) {
  //   console.warn("地理位置信息已过期");
  //   localStorage.removeItem('geoData');
  //   return;
  // }

  // 使用存储的地理信息请求数据
  const response = await nearby_news_info({
    latitude: geoData.latitude,
    longitude: geoData.longitude,
    accuracy: geoData.accuracy
  }, index)
  console.log("fetchData", response.data);
  if (response.data.status === '1') {
    index++; // 分页索引递增
    return response.data.data;
  }else {
    // 模拟从服务器获取数据
    return [
      {
        id: 1,
        avatar_url: 'https://fuyi-pingtai.oss-cn-beijing.aliyuncs.com/avatar/17af5fe80fb1844b3fd48941.png',
        user_name: '蓝球',
        publish_date: '2023-04-02',
        content: '看了下直播回放，雷军这人，在营销上真的没有对手。[哭泣][哭泣]\n' +
          '别人家开发布会，都是请明星撑场子，讲参数、介绍特色，雷总营销讲情怀：从湖北状元到卡里就剩下40亿的凡尔赛人生。\n' +
          '别人被调侃都是采取法律手段，雷总反手买下“ARE YOU OK”版权自黑，直播间和网友玩梗玩到起飞。\n' +
          '其他车企直播全靠老板尬聊，何小鹏吐槽：雷军营销比我强，但我技术要赢！\n' +
          '雷军他不语，深藏功与名，跑去小米工厂当“厂长”，顺便晒出睡觉摸鱼视频，一下拉进了跟打工人的距离。\n' +
          '这次SU7 Ultra发布会，刚开始说是对标保时捷，预售价定个80万元，上市后价格直接跳水，52万就可买回家，让人感觉不买就亏了，下单瞬间怒赚28万元。\n' +
          '接着再给你出个纽北限量版，卖到81万，把这台车的调性拉了回去。\n' +
          '而且他每次开发布会，不仅产品大卖，顺便还会带动周边产品。\n' +
          '比如这次小米 SU7 Ultra 发布会，带火了雷总身上的皮衣，据说平替只要3900，打工人买不起小米，还买不起一件雷总同款皮衣嘛！\n' +
          '虽然昨天首富一日游，但就雷总这销售能力，随着小米SU7 Ultra大卖，估计用不了多久首富宝座指日可待啊！\n' +
          '\n' +
          '作者：幽默的致富敢死队\n' +
          '链接：https://xueqiu.com/1496557248/325528191\n' +
          '来源：雪球\n' +
          '著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。\n' +
          '风险提示：本文所提到的观点仅代表个人的意见，所涉及标的不作推荐，据此买卖，风险自负。',
        images: ['https://fuyi-pingtai.oss-cn-beijing.aliyuncs.com/pictures/1954d3b73a14331d3fef6623.jpg%21800.jpg'],
        position: '北京',
        comment_count: 3,  //666 1k+  1w+
        like_count: 15,  //666 1k+  1w+
        view_count: 75  //666 1k+  1w+  10w+
      }
    ];
  }


};

const go_detail = function (item) {
  // item_id是备着从数据库查询数据  实际上只是通过浏览器的localStorage中
  // console.log(item)
  localStorage.setItem("item_" + item.news_id, JSON.stringify(item));
  router.push({
    name: 'ArticleDetail',
    params: { news_id: item.news_id } // 假设 tixing_id 是你要传递的唯一标识符
  });
}
const on_load = () => {
  setTimeout(async () => {
    // 模拟异步加载
    const newData = await fetchData();
    console.log('newData', newData);
    if (newData.length === 0) {
      finished.value = true;
    } else {
      items.value = items.value.concat(newData);
      index = index + items.value.length;
    }
    loading.value = false;
  }, 1000);
}

const getImageContainerStyle = (image) => {
  const ratio = image.height / image.width
  return {
    // 基础宽度（根据列布局自动计算）
    paddingBottom: `${ratio * 100}%`
  }
}

// 动态获取图片尺寸（如果未知尺寸）
const handleImageLoad = (e, image) => {
  const img = e.target
  const naturalWidth = img.naturalWidth
  const naturalHeight = img.naturalHeight
  // 更新数据中的图片尺寸（需要响应式处理）
  this.$set(image, 'width', naturalWidth)
  this.$set(image, 'height', naturalHeight)
}

// -----------------------位置、资讯数据初始化----------------------------

onMounted(() => {
  // 初始化定位
  if (init_location()){
    // 初始化数据
    fetchData()
  }

});


const showShareMenu = ref(false);
const isActive = ref(false);
const isOverlayVisible = ref(false);
const currentShareItem = ref(null);

const handleShareClick = (item) => {
  currentShareItem.value = item
  isActive.value = !(isActive.value);
  showShareMenu.value = !(showShareMenu.value)
  isOverlayVisible.value = !(isOverlayVisible.value)
  // 初始化微信分享（需要提前注入配置）
  initWechatShare(item)
}
const handleOverlayClick = () => {
  if (isOverlayVisible.value) {
    showShareMenu.value = false
    isActive.value = false
    isOverlayVisible.value = false
  }
}

async function initWechatShare(item) {
  try {
    // 获取微信签名配置
    const {appId, timestamp, nonceStr, signature} = await getWechatConfig()

    wx.config({
      debug: false, // 生产环境关闭
      appId,
      timestamp,
      nonceStr,
      signature,
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData'
      ]
    })

    wx.ready(() => {
      // 自定义"分享给朋友"内容
      wx.updateAppMessageShareData({
        title: item.title,
        desc: item.content.slice(0, 50),
        link: window.location.href,
        imgUrl: item.images[0] || defaultShareImage,
        success: () => {
          this.trackShare('wechat')
        }
      })

      // 自定义"分享到朋友圈"内容
      wx.updateTimelineShareData({
        title: item.title,
        link: window.location.href,
        imgUrl: item.images[0] || defaultShareImage,
        success: () => {
          this.trackShare('moment')
        }
      })
    })
  } catch (error) {
    console.error('微信配置失败:', error)
  }
}

const shareToWechat = (item) => {
  // 直接调用微信API
  wx.invoke('shareToWechat', {
    type: 'friends',
    success: () => {
      this.$toast.success('分享成功')
      this.trackAnalytics('share', 'wechat', item.id)
    }
  })
}

const shareToMoment = (item) => {
  wx.invoke('shareToWechat', {
    type: 'timeline',
    success: () => {
      this.$toast.success('分享到朋友圈成功')
      this.trackAnalytics('share', 'moment', item.id)
    }
  })
}

</script>

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

.loading-wrapper {
  padding: 50px 0;
  text-align: center;
}

.bottom-loading {
  padding: 15px 0;
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
}

.item {
  padding: 15px;
  margin-bottom: 10px;
  background: #fff;
  transition: background-color 0.3s ease; /*平滑过渡效果*/
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.item:hover {
  background-color: #DCDCDC;
}

.username {
  font-size: 14px;
  color: #333;
}

.publish-date {
  font-size: 12px;
  color: #999;
}

.content {
  font-size: 14px;
  color: #000000;
  margin-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 显示三行 */
  -webkit-box-orient: vertical;
}

/* 关键CSS */
.image-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 12px;
}

.image-col {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 6px;

  /* 通过padding-bottom实现宽高比容器 */

  &::before {
    content: '';
    display: block;
    padding-bottom: 100%; /* 默认正方形 */
  }

  /* 根据实际比例覆盖 */

  &[style*="padding-bottom"]::before {
    content: none;
  }

  .van-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.share-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.share-icon {
  width: 20px; /* 根据实际图片尺寸调整 */
  height: 20px;
  transition: transform 0.2s;
}

.share-icon:hover {
  transform: scale(1.1);
}

.share-menu {
  position: absolute;
  bottom: calc(100% + 8px); /* 菜单显示在按钮上方 */
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  min-width: 120px;
  z-index: 1000;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  transition: background 0.2s;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item img {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

.menu-item span {
  font-size: 14px;
  color: #333;
}

.overlay { /* 整个页面覆盖层（变暗）只显示菜单 */
  position: fixed; /* 确保覆盖层固定在视口中 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  z-index: 999; /* 确保覆盖层位于其他内容之上 */
}


</style>
