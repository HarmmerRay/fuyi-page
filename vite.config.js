import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import pxtovw from "postcss-px-to-viewport";
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/

const loder_pxtovw = pxtovw({
  //这里是设计稿宽度 自己修改
  viewportWidth: 375,
  viewportUnit: "vw",
});

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // vueDevTools(),
  ],
  css: {
    postcss: {
      plugins: [loder_pxtovw],
      //  less: {
      //   // 禁用Less的charset输出，通常推荐设置为false以避免编码问题
      //   charset: false,
      //   // 在此处引入全局样式文件，例如全局Less文件
      //   additionalData: '@import "./src/assets/style/global.less";',
      // }

    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
  optimizeDeps: {
    include: ['js-md5'],
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        // target: 'http://backend:5000',  // docker-compose 网络之间的主机地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    host: true, //开启局域网内访问
  }
})
