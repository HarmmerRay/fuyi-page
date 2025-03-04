<template>
  <div class="share-container" :class="{ 'active': isActive }" @click.stop="toggleShare">
    <!-- 使用 img 标签实现图标切换 -->
    <img
      class="share-icon"
      :src="isActive ? blueIcon : grayIcon"
      alt="分享按钮"
      @click.stop="toggleShare"
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
</template>

<script>
// 解决方案1：使用ESM导入方式（推荐）
import grayIcon from '@/assets/share_grey.png' // 确保路径正确
import blueIcon from '@/assets/share_blue.png'

export default {
  data() {
    return {
      isActive: false,
      showShareMenu: false,
      grayIcon: grayIcon, // 如果使用Vue3可以简写为 grayIcon,
      blueIcon: blueIcon
    }
  },
  methods: {
    toggleShare() {
      this.isActive = !this.isActive
      this.showShareMenu = !this.showShareMenu
    },
    shareToWechat(item) {
      console.log('分享到微信好友', item)
      this.closeMenu()
    },
    shareToMoment(item) {
      console.log('分享到朋友圈', item)
      this.closeMenu()
    },
    closeMenu() {
      this.isActive = false
      this.showShareMenu = false
    }
  }
}
</script>

<style scoped>
.share-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.share-icon {
  width: 20px;  /* 根据实际图片尺寸调整 */
  height: 20px;
  transition: transform 0.2s;
}

.share-icon:hover {
  transform: scale(1.1);
}

.share-menu {
  position: absolute;
  bottom: calc(100% + 8px);  /* 菜单显示在按钮上方 */
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
</style>
