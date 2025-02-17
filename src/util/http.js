import axios from 'axios'
export const http = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 600000,
  headers: { 'X-Custom-Header': 'foobar' },
})

export const axi = axios.create({
  baseURL: '/ap',
  timeout: 600000,
  headers: { 'X-Custom-Header': 'foobar' },
})

export const ajx = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  timeout: 50000,
  headers: { 'X-Custom-Header': 'foobar' },
})

// import time from "@/util/md5"
import { useCounterStore } from '@/stores/counter'

import encrypt from '@/util/md5'

http.interceptors.request.use(
  (config) => {
    const state = useCounterStore()
    const admin_id = state.admin_id
    // console.log(state.admin_id);
    if (config.url === '/api/account_add_douyin') {
      config.headers['Adminid'] = ''
      console.log('请求拦截器', config)
    } else {
      config.headers['Adminid'] = admin_id
    }
    config.headers['Authorization'] = encrypt() // 让每个请求携带自定义token 请根据实际情况自行修改

    return config
  },
  (error) => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  },
)

// 添加响应拦截器
http.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  },
)

// export default http;
axi.interceptors.request.use(
  (config) => {
    const state = useCounterStore()
    const admin_id = state.admin_id
    // console.log(state.admin_id);
    if (config.url === '/api/account_add_douyin') {
      config.headers['Adminid'] = ''
      console.log('请求拦截器', config)
    } else {
      config.headers['Adminid'] = admin_id
    }
    config.headers['Authorization'] = encrypt() // 让每个请求携带自定义token 请根据实际情况自行修改

    return config
  },
  (error) => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  },
)

// 添加响应拦截器
axi.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么

    return response
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  },
)
