<template>
  <div class="community">
    <div class="search-and-post">
      <van-search v-model="search_query" placeholder="搜索资讯" />
      <img src="@/assets/publish.png" alt="发布" @click="go_to_post" class="publish-icon" />
    </div>
    <div class="location-bar" @click="handleLocationClick">
      <span v-if="locationLoading" class="location-text">
        <van-loading type="spinner" size="16px" /> 获取中...
      </span>
      <span v-else-if="currentLocation" class="location-text">
        📍 定位：{{ currentLocation.addressComponent.township }}
      </span>
      <span v-else class="location-text">📍 获取不到位置信息</span>
    </div>
    <van-popup v-model:show="showLocationDetail" position="bottom" round :style="{ height: '40%' }">
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
          <van-icon name="warning" color="#ff976a" />
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
            <van-loading size="24px" vertical color="#1989fa"> 拼命加载中... </van-loading>
          </div>
        </template>

        <template v-else>
          <div v-for="(item, index) in items" :key="index" class="item" @click="go_detail(item)">
            <!-- 头像、用户名、发布日期 -->
            <van-row type="flex" align="center">
              <van-col span="2">
                <van-image round width="23px" height="23px" :src="item.avatar_url" />
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
              <van-col
                v-for="(image, imgIndex) in item.images.slice(0, 3)"
                :key="imgIndex"
                class="image-col"
                :style="getImageContainerStyle()"
              >
                <van-image fit="cover" width="100%" height="100%" :src="image" />
              </van-col>
            </van-row>

            <!-- 分享按钮、评论数、点赞数、浏览数 -->
            <van-row type="flex">
              <van-col span="6" style="text-align: left; font-size: 14px; color: #999">
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
                <div class="share-container" :class="{ active: isActive }" @click.stop>
                  <!-- 使用 img 标签实现图标切换 -->
                  <img
                    class="share-icon"
                    :src="isActive && currentShareItem === item ? blueIcon : greyIcon"
                    alt="分享按钮"
                    @click.stop="handleShareClick(item)"
                  />

                  <!-- 分享菜单 -->
                  <div
                    class="share-menu"
                    v-if="showShareMenu && currentShareItem === item"
                    @click.stop
                  >
                    <div class="menu-item" @click.stop="shareToWechat(item)">
                      <img src="@/assets/wechat-icon.png" alt="微信好友" />
                      <span>微信好友</span>
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
            <van-loading size="18px" vertical color="#969799"> 正在加载更多... </van-loading>
          </div>
        </template>
      </van-list>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { showToast } from 'vant'
import { get_location, nearby_news_info } from '@/api/db.js'
// -----------------------分享功能----------------------------
import greyIcon from '@/assets/share_grey.png' // 确保路径正确
import blueIcon from '@/assets/share_blue.png'
import router from '@/router/index.js'

// 默认分享图片
const defaultShareImage = 'https://placehold.co/600x400/png' // 使用占位图作为默认分享图片

// 添加微信JS-SDK引入
const loadWechatJSSDK = () => {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载过微信JS-SDK
    if (window.wx) {
      resolve(window.wx)
      return
    }

    // 创建script标签
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js' // 使用最新的微信JS-SDK
    script.onload = () => {
      console.log('微信JS-SDK加载成功')
      resolve(window.wx)
    }
    script.onerror = (error) => {
      console.error('微信JS-SDK加载失败:', error)
      reject(error)
    }
    document.head.appendChild(script)
  })
}

// 微信配置函数
const getWechatConfig = async () => {
  // 这里应该是从后端获取微信JS-SDK配置信息
  // 由于目前没有实际的后端接口，返回模拟数据
  console.log('获取微信配置')
  return {
    appId: 'wx123456789',
    timestamp: Math.floor(Date.now() / 1000).toString(),
    nonceStr: Math.random().toString(36).substr(2),
    signature: 'mock_signature_' + Date.now(),
  }
}

const search_query = ref('')
const active_tab = ref(true)
const loading = ref(true)
const finished = ref(false)
const items = ref([])

// todo 发布资讯页面跳转
const go_to_post = () => {
  router.push('/community_publish')
}
// -----------------------获取定位---------------------------
// 定位相关状态
const currentLocation = ref(null)
const locationLoading = ref(false)
const showLocationDetail = ref(false)

// 工具函数：获取本地存储的有效定位（1天内）
function getValidLocationFromStorage() {
  const str = localStorage.getItem('geoData')
  if (!str) return null
  try {
    const data = JSON.parse(str)
    if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('geoData')
      return null
    }
    return data
  } catch {
    localStorage.removeItem('geoData')
    return null
  }
}
// 工具函数：保存定位到本地
function saveLocationToStorage(location) {
  localStorage.setItem('geoData', JSON.stringify(location))
}

// 获取详细位置信息
async function getDetailLocation(position) {
  try {
    const res = await get_location(position)
    const data = res.data
    if (data.status === '1' && data.regeocode) {
      return data.regeocode
    }
  } catch (error) {
    console.error('获取详细位置失败:', error)
    return null
  }
}

// 获取实时定位
async function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('浏览器不支持定位')
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        }),
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  })
}

// 初始化定位：强制获取实时位置并保存，展示详细信息
const init_location = async function () {
  locationLoading.value = true
  try {
    const geo = await getLocation()
    saveLocationToStorage(geo)
    currentLocation.value = await getDetailLocation(geo)
    if (currentLocation.value) {
      currentLocation.value.accuracy = geo.accuracy
    }
  } catch (error) {
    currentLocation.value = null
    showToast({
      message: error.PERMISSION_DENIED ? '请授权位置权限' : '获取位置失败',
      position: 'bottom',
    })
  } finally {
    locationLoading.value = false
  }
}

// 处理定位点击：强制重新获取实时位置
const handleLocationClick = async () => {
  await init_location()
  showLocationDetail.value = true
}

// -----------------------加载数据---------------------------
let index = 0
const fetchData = async function () {
  // 获取本地存储的有效定位
  const geoData = getValidLocationFromStorage()
  if (!geoData) {
    await init_location()
    return fetchData()
  }
  // 使用存储的地理信息请求数据
  const response = await nearby_news_info(
    {
      latitude: geoData.latitude,
      longitude: geoData.longitude,
      accuracy: geoData.accuracy,
    },
    index,
  )
  if (response.data.status === '1') {
    index++ // 分页索引递增
    return response.data.data
  } else {
    // 模拟从服务器获取数据
    return []
  }
}

const go_detail = function (item) {
  // item_id是备着从数据库查询数据  实际上只是通过浏览器的localStorage中
  // console.log(item)
  localStorage.setItem('item_' + item.news_id, JSON.stringify(item))
  router.push({
    name: 'ArticleDetail',
    params: { news_id: item.news_id }, // 假设 tixing_id 是你要传递的唯一标识符
  })
}
const on_load = () => {
  setTimeout(async () => {
    // 模拟异步加载
    const newData = await fetchData()
    // console.log('newData', newData)
    if (newData.length === 0) {
      finished.value = true
    } else {
      items.value = items.value.concat(newData)
      index = index + items.value.length
    }
    loading.value = false
  }, 1000)
}

const getImageContainerStyle = () => {
  return {
    // 基础宽度（根据列布局自动计算）
    paddingBottom: '100%', // 默认正方形
  }
}

// -----------------------位置、资讯数据初始化----------------------------

// 添加点击外部关闭菜单的功能
onMounted(async () => {
  // 页面刷新时强制获取实时位置
  await init_location()
  // 初始化数据
  fetchData()
  document.addEventListener('click', closeShareMenu)
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  document.removeEventListener('click', closeShareMenu)
})

// 关闭分享菜单的函数
const closeShareMenu = (event) => {
  // 检查点击的元素是否在分享容器内
  const shareContainers = document.querySelectorAll('.share-container')
  for (const container of shareContainers) {
    if (container.contains(event.target)) {
      // 点击的是分享容器内的元素，不关闭菜单
      return
    }
  }

  // 点击的是分享容器外的元素，关闭菜单
  if (showShareMenu.value) {
    currentShareItem.value = null
    isActive.value = false
    showShareMenu.value = false
    isOverlayVisible.value = false
  }
}
const showShareMenu = ref(false)
const isActive = ref(false)
const isOverlayVisible = ref(false)
const currentShareItem = ref(null)

const handleShareClick = (item) => {
  // 如果点击的是当前已激活的项目，则关闭菜单
  if (currentShareItem.value === item && isActive.value) {
    currentShareItem.value = null
    isActive.value = false
    showShareMenu.value = false
    isOverlayVisible.value = false
    return
  }

  // 设置当前分享项目
  currentShareItem.value = item
  isActive.value = true
  showShareMenu.value = true

  // 不显示全屏遮罩层，只显示菜单
  // isOverlayVisible.value = true

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
    // 先加载微信JS-SDK
    await loadWechatJSSDK()

    // 获取微信签名配置
    const { appId, timestamp, nonceStr, signature } = await getWechatConfig()

    wx.config({
      debug: false, // 生产环境关闭
      appId,
      timestamp,
      nonceStr,
      signature,
      jsApiList: ['updateAppMessageShareData'], // 只保留分享给朋友的接口
    })

    wx.ready(() => {
      // 自定义"分享给朋友"内容
      wx.updateAppMessageShareData({
        title: item.title, // 分享标题，通常是文章标题
        desc: item.content.slice(0, 50), // 分享描述，通常是文章摘要
        link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: item.images[0] || defaultShareImage, // 分享图标，使用文章的第一张图或默认图片
        success: () => {
          // 用户点击了分享后执行的回调函数
          // this.trackShare('wechat') // 如果有埋点需求，可以取消注释
          console.log('分享给朋友成功')
        },
        cancel: () => {
          // 用户取消分享后执行的回调函数
          console.log('取消分享给朋友')
        },
      })
    })
  } catch (error) {
    console.error('微信配置失败:', error)
  }
}

const shareToWechat = async (item) => {
  alert('微信分享接口暂时申请不了权限调用，功能待开发')
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
  background-color: #dcdcdc;
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

  &[style*='padding-bottom']::before {
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

.overlay {
  /* 整个页面覆盖层（变暗）只显示菜单 */
  position: fixed; /* 确保覆盖层固定在视口中 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  z-index: 999; /* 确保覆盖层位于其他内容之上 */
}
</style>
