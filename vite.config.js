import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import pxtovw from 'postcss-px-to-viewport'
import * as fs from 'node:fs'
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/  原生 ES 模块的新一代前端构建工具

const loder_pxtovw = pxtovw({
  //这里是设计稿宽度 自己修改  px vw 使用vw作为边距大小单位
  viewportWidth: 375,
  viewportUnit: 'vw',
})

export default defineConfig({
  plugins: [
    vue(), // vue框架
    vueJsx(), // js中添加html代码
    // vueDevTools(),
  ],
  css: {
    postcss: {
      plugins: [loder_pxtovw],
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
        changeOrigin: true, // 防止跨域
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    host: true, //开启局域网内访问
    https: {
      // 使用自签名证书   Windows10上 安装OpenSSL生成私钥和证书
      // openssl genpkey -algorithm RSA -out key.pem -pkeyopt rsa_keygen_bits:2048
      // openssl req -new -x509 -key key.pem -out cert.pem -days 365 -sha256
      key: fs.readFileSync(new URL('./key.pem', import.meta.url)),
      cert: fs.readFileSync(new URL('./cert.pem', import.meta.url)),
    },
  },
})
