<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <router-view></router-view>
</template>

<style lang="less">

.van-nav-bar .van-icon {
  color: black !important;
}
:root .van-tabs__line {
  bottom: 21px;
  background: #ff7652;
  height: 4px;
  width: 14px;
}
:root .van-tabs__line {
  --van-tabs-bottom-bar-width: 10px;
  // margin-top:3px;
}
//自定义字体
//@font-face {
//  font-family: 'MiSans-Semibold';
//  src: url('/fonts/xmMiSans-Semibold.ttf') format('truetype');
//}


:root .van-tabs__nav--line {
  background: #f8f8f8;
  padding-bottom: 8px;
}
:root .van-tab {
  font-size: 18px;
  margin-right: 6px;
  line-height: 25px;
  height: 25px;
}
//:root .van-ellipsis {
//  font-size: 17px;
//  color: #000000;
//}
:root .van-icon {
  border-radius: 2px;
}
.el-dropdown-menu__item:not(.is-disabled):focus {
  color: #ff7652;
  background-color: rgba(255, 118, 82, 0.01);
}
:root .van-icon-photograph:before {
  content: '';
  width: 64px;
  height: 64px;
  background: url('public/shijijia.png') no-repeat;
  background-size: 64px 64px;
  // src: ;
}
//:root .van-uploader__wrapper {
//  flex-direction: row-reverse;
//}
#app {
  font-family: "PingFang SC, PingFang SC ", sans-serif;
}
body{
  overflow-y: scroll;
  scroll-behavior: smooth;
}

html{
  overflow-x: hidden;
  //soverflow-y:scroll;
}

//选品广场排序样式
:root {
  --van-popover-action-width: auto !important;
  --van-popover-action-icon-size:16px !important;
  --van-popover-action-height: 4.3vh!important;
}
:root .van-popover__action-icon {
  color: #EE761E !important;
}


//// 添加媒体查询，当视口宽度大于375px时应用以下样式规则
//@media (min-width: 400px) {
//  html, body {
//    width: 50vw;
//    height: 100vh;
//    margin: 0 auto; /* 居中显示 */
//  }
//}
</style>
