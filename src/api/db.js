import { http } from '@/util/http'

// --------------------------- 用户信息 ------------------------------
export const user_info = (user_id) => {
  return http({
    url: '/api/user_info',
    method: 'GET',
    params: {
      user_id
    },
  })
}

export const update_user_info = (form_data) => {
  return http({
    url: '/api/update_user_info',
    method: 'POST',
    data: form_data // 直接传送过去json格式的表单数据
  })
}

export const delete_user_info = (user_id) => {
  return http({
    url: '/api/delete_user_info',
    method: 'POST',
    data: {
      user_id
    }
  })
}
// ---------------------- 提醒事项 ------------------------------
export const tixing_items_info = (user_id) => {
  return http({
    url: '/api/tixing_items_info',
    method: 'GET',
    params: {
      user_id
    },
  })
}

export const tixing_item_add = (user_id,tixing_item) => {
  return http({
    url: '/api/tixing_item_add',
    method: 'POST',
    data: {
      user_id,
      tixing_item
    }
  })
}

export const tixing_item_select_id = (tixing_item_id) => {
  return http({
    url: '/api/tixing_item_select_id',
    method: 'GET',
    params: {
      tixing_item_id
    }
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

export const delete_tixing_by_id = (tixing_id) =>{
  return http({
    url: '/api/delete_tixing_by_id',
    method: 'POST',
    data: {
      tixing_id,
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
