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
