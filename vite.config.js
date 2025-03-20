import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import pxtovw from "postcss-px-to-viewport";
import * as fs from "node:fs";
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
    // https: true
    https: {
      // 使用自签名证书   Windows10上 安装OpenSSL生成私钥和证书
      // openssl genpkey -algorithm RSA -out key.pem -pkeyopt rsa_keygen_bits:2048
      // openssl req -new -x509 -key key.pem -out cert.pem -days 365 -sha256
      key: fs.readFileSync(new URL('./key.pem', import.meta.url)),
      cert: fs.readFileSync(new URL('./cert.pem', import.meta.url)),
    },
  }
})
