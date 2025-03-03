<template>
  <div class="community">
    <div class="search-and-post">
      <van-search v-model="search_query" placeholder="搜索资讯"/>
      <img src="@/assets/publish.png" alt="发布" @click="go_to_post" class="publish-icon"/>
    </div>
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
                  :src="item.avatar"
                />
              </van-col>
              <van-col span="16">
                <p class="username">{{ item.username }}</p>
              </van-col>
              <van-col>
                <p class="publish-date">{{ item.publish_date }}</p>
              </van-col>
            </van-row>
            <!-- 文字简介 -->
            <p class="content">{{ item.content.slice(0, 200) }}...</p>

            <!-- 图片 -->
            <van-row gutter="10" v-if="item.images.length > 0"  class="image-row">
              <van-col v-for="(image, imgIndex) in item.images.slice(0, 3)" :key="imgIndex"  class="image-col" :style="getImageContainerStyle(image)">
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
              <van-col style="text-align: left;font-size: 14px;color: #999">
                <p>发布于: {{ item.position }}</p>
              </van-col>
              <van-col span="3">
                <div class="share-container" @click.stop="handleShareClick(item)" :class="{ 'active': isActive }">
                  <van-icon class="share-icon"  size="20px"/>
                  <!-- 分享菜单 -->
                  <div v-if="showShareMenu" class="share-menu">
                    <div class="menu-item" @click="shareToWechat(item)">
                      <img src="@/assets/wechat-icon.png" alt="微信好友">
                      <span>微信好友</span>
                    </div>
                    <div class="menu-item" @click="shareToMoment(item)">
                      <img src="@/assets/moment-icon.png" alt="朋友圈">
                      <span>朋友圈</span>
                    </div>
                  </div>
                </div>
              </van-col>

              <van-col span="4">
                <p>评论: {{ item.comment_count }}</p>
              </van-col>
              <van-col span="4">
                <p>点赞: {{ item.like_count }}</p>
              </van-col>
              <van-col span="4">
                <p>浏览: {{ item.view_count }}</p>
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
import {ref} from "vue";

const search_query = ref('')
const active_tab = ref(true)
const loading = ref(true);
const finished = ref(false);
const items = ref([]);

// 分享功能
const showShareMenu = ref(false);
const currentShareItem = ref(null);
const handleShareClick = (item) => {
  currentShareItem.value = item
  showShareMenu.value = !(showShareMenu.value)

  // 初始化微信分享（需要提前注入配置）
  this.initWechatShare(item)
}
async function initWechatShare(item) {
  try {
    // 获取微信签名配置
    const { appId, timestamp, nonceStr, signature } = await getWechatConfig()

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

const trackShare = (type) => {
  // 埋点逻辑
  this.$ga.event('Share',type,currentShareItem.value.id)
}
const go_to_post = () => {


}
const fetchData = function () {
  // 模拟从服务器获取数据
  return [
    {
      id: 1,
      avatar: 'https://fuyi-pingtai.oss-cn-beijing.aliyuncs.com/avatar/17af5fe80fb1844b3fd48941.png',
      username: '蓝球蓝球蓝球蓝球蓝球蓝球',
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
};

const go_detail = function (item) {
    // item_id是备着从数据库查询数据  实际上只是通过浏览器的localStorage中
  localStorage.setItem("item_"+item.id, JSON.stringify(item));
  this.$router.push(`/article_detail/${item.id}`);
}
const on_load = () => {
  setTimeout(() => {
    // 模拟异步加载
    const newData = fetchData();
    if (newData.length === 0) {
      finished.value = true;
    } else {
      items.value = items.value.concat(newData);
    }
    loading.value = false;
  }, 1000);
}
const getImageContainerStyle = (image)=>{
  const ratio = image.height / image.width
  return {
    // 基础宽度（根据列布局自动计算）
    paddingBottom: `${ratio * 100}%`
  }
}

// 动态获取图片尺寸（如果未知尺寸）
const handleImageLoad = (e,image) => {
  const img = e.target
  const naturalWidth = img.naturalWidth
  const naturalHeight = img.naturalHeight
  // 更新数据中的图片尺寸（需要响应式处理）
  this.$set(image, 'width', naturalWidth)
  this.$set(image, 'height', naturalHeight)
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

/* 样式部分 */
.share-container {
  position: relative;
  display: flex;
  align-items: center;
  height: 24px;

  .share-icon {
    transition: transform 0.2s ease;

    &:active {
      transform: scale(0.9);
    }
  }

  .share-menu {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 100;

    .menu-item {
      padding: 12px;
      display: flex;
      align-items: center;
      transition: background 0.2s;

      &:hover {
        background: #f5f5f5;
      }

      img {
        width: 20px;
        height: 20px;
        margin-right: 8px;
      }

      span {
        font-size: 12px;
        color: #333;
      }
    }
  }
}

/* 自定义图标（使用Base64编码示例） */
.custom-icon {
  &-share-gray {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFPSURBVHgB7ZbRDYIwEEVfWkAHcAAHcEAHcAAHcEAHcAAHcAAHdAAHdIAO4AkvJKEkQKDl/0lO3k3S3N7ttSGE8E+UwA6YAQXQABegAho5H4E1MP0GvAA2wBE4y4NqoJZzJX0HrIHJN8D3wEEeWgFToJX2Uvq2wOIb8F7Gt3JfDVTy/0XaDlKvBoN3wF2u1XKvkntqoJL6DZgPAd/kWiX31EAl9RswHwK+ybVK7qmBSuo3YD4EfJNrldxTA5XUb8B8CPgm1yq5pwYqqd+A+RDwTa5Vck8NVFK/AfMh4Jtcq+SeGqikfgPmQ8A3uVbJPTVQSf0GzIeAb3KtkntqoJL6DZgPAd/kWiX31EAl9RswHwK+ybVK7qmBSuo3YD4EfJNrldxTA5X0Hl4BH4XZ3ZvGHlkAAAAASUVORK5CYII=');
  }

  &-share-blue {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGWSURBVHgB7ZbRDcIgEEWfOoADOKADOKADOKADOKADOKADOKADOKADdAAPeCEJJYRAIPxPcnJvQtt3t7eFUsq/MQJ2wBwogQa4ABXQyPkI7IHJN+AFsAEOwFkeVAO1nCvpO2AFjL8Bvgd2cmMFLIBG2kvp2wDLb8B7Gd/Iv2qgkv8v0naQejUYvAPucq2We5XcUwOV1G/AfAj4JtcquacGKqnfgPkQ8E2uVXJPDVRSvwHzIeCbXKvknhqopH4D5kPAN7lWyT01UEn9BsyHgG9yrZJ7aqCS+g2YDwHf5Fol99RAJfUbMB8Cvsm1Su6pgUrqN2A+BHyTa5XcUwOV1G/AfAj4JtcquacGKqnfgPkQ8E2uVXJPDVRSvwHzIeCbXKvknhqopH4D5kPAN7lWyT01UEn9BsyHgG9yrZJ7aqCS3sMrU9HZ3YvGq6kAAAAASUVORK5CYII=');
  }
}
</style>
