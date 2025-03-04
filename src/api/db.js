import { http } from '@/util/http'

export const user_info = (user_id) => {
  return http({
    url: '/api/user_info',
    method: 'GET',
    params: {
      user_id
    },
  })
}

export const tixing_items_info = (user_id) => {
  return http({
    url: '/api/tixing_items_info',
    method: 'GET',
    params: {
      user_id
    },
  })
}

export const update_tixing_state = (tixing_id,state) =>{
  return http({
    url: '/api/update_tixing_state',
    method: 'POST',
    data: {
      tixing_id,
      state
    }
  })
}

// 雪球是：一个资讯一次请求，请求时带上当前是第几条，index
export const nearby_news_info = (user_position,index) =>{
  return http({   // 一次返回10条
    url: '/api/nearby_news_info',
    method: 'POST',
    data: {
      user_position,
      index
    }
  })
}
