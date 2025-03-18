<script setup>
</script>

<template>
  <div class="qr-container">
    <img
      src="../assets/wechat_qr.png"
      alt="WeChat QR Code"
      class="qr-image"
    >
  </div>
</template>

<style scoped>
.qr-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
}

.qr-image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* 添加触摸设备的手势缩放支持 */
@supports (touch-action: manipulation) {
  .qr-image {
    touch-action: manipulation;
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
