import { http } from '@/util/http'

// --------------------------- 用户信息 ------------------------------
export const user_info = (user_id) => {
  return http({
    url: '/api/user_info',
    method: 'GET',
    params: {
      user_id,
    },
  })
}

export const update_user_info = (form_data) => {
  return http({
    url: '/api/update_user_info',
    method: 'POST',
    data: form_data, // 直接传送过去json格式的表单数据
  })
}

export const delete_user_info = (user_id) => {
  return http({
    url: '/api/delete_user_info',
    method: 'POST',
    data: {
      user_id,
    },
  })
}
// ---------------------- 提醒事项 ------------------------------
export const tixing_items_info = (user_id) => {
  return http({
    url: '/api/tixing_items_info',
    method: 'GET',
    params: {
      user_id,
    },
  })
}

export const tixing_item_add = (user_id, tixing_item) => {
  return http({
    url: '/api/tixing_item_add',
    method: 'POST',
    data: {
      user_id,
      tixing_item,
    },
  })
}

export const tixing_item_select_id = (tixing_item_id) => {
  return http({
    url: '/api/tixing_item_select_id',
    method: 'GET',
    params: {
      tixing_item_id,
    },
  })
}
export const update_tixing_state = (tixing_id, state) => {
  return http({
    url: '/api/update_tixing_state',
    method: 'POST',
    data: {
      tixing_id,
      state,
    },
  })
}

export const delete_tixing_by_id = (tixing_id) => {
  return http({
    url: '/api/delete_tixing_by_id',
    method: 'POST',
    data: {
      tixing_id,
    },
  })
}

// ---------------------- 资讯 ------------------------------
// 雪球是：一个资讯一次请求，请求时带上当前是第几条，index
export const nearby_news_info = (coordinate, index) => {
  return http({
    // 一次返回10条
    url: '/api/nearby_news_info',
    method: 'POST',
    data: {
      coordinate,
      index,
    },
  })
}
export const select_news_by_id = (news_id) => {
  return http({
    url: '/api/get_news_by_id',
    method: 'GET',
    params: {
      news_id,
    },
  })
}

export const get_location = (coordinate) => {
  // console.log('coordinate',coordinate)
  return http({
    // 一次返回10条
    url: '/api/get_location',
    method: 'POST',
    data: {
      coordinate,
    },
  })
}

export const publish_news = (news) => {
  console.log('news', news)
  return http({
    url: '/api/publish_news',
    method: 'POST',
    data: {
      // content  images  position
      news,
    },
  })
}

export const like_news = (news_id) => {
  return http({
    url: '/api/like_news',
    method: 'POST',
    data: {
      news_id,
    },
  })
}

export const unlike_news = (like_id) => {
  return http({
    url: '/api/unlike_news',
    method: 'POST',
    data: {
      like_id,
    },
  })
}

export const add_comment = (news_id, content) => {
  return http({
    url: '/api/add_comment',
    method: 'POST',
    data: {
      news_id,
      content,
    },
  })
}

export const get_comments = (news_id) => {
  return http({
    url: '/api/get_comments',
    method: 'POST',
    data: {
      news_id,
    },
  })
}

// ---------------------- 消息中心 ------------------------------
export const getMessages = (user_id) => {
  return http({
    url: '/api/get_messages',
    method: 'GET',
    data: {
      user_id,
    },
  })
}

export const markAllRead = (user_id) => {
  return http({
    url: '/api/mark_all_read',
    method: 'POST',
    data: {
      user_id,
    },
  })
}

export const deleteAll = (user_id) => {
  return http({
    url: '/api/delete_all',
    method: 'POST',
    data: {
      user_id,
    },
  })
}
// getMessageDetail, markRead, deleteMessage
export const getMessageDetail = (msg_id) => {
  return http({
    url: '/api/get_message',
    method: 'GET',
    params: {
      msg_id,
    },
  })
}

export const markRead = (msg_id) => {
  return http({
    url: '/api/mark_read',
    method: 'POST',
    data: {
      msg_id,
    },
  })
}

export const deleteMessage = (msg_id) => {
  return http({
    url: '/api/delete_message',
    method: 'POST',
    data: {
      msg_id,
    },
  })
}
