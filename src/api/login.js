//登录接口
import { http } from '@/util/http'

export const user_login = (phoneNum, code) => {
  return http({
    url: '/login',
    method: 'POST',
    data: {
      phoneNum,
      code,
    },
  })
}

export const get_code = (phone_num) => {
  return http({
    url: '/get_code',
    method: 'get',
    data: {
      phone_num,
    },
  })
}
