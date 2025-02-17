//登录接口
import { http } from '@/util/http'

export const user_login = (phone_number, code) => {
  return http({
    url: '/api/login',
    method: 'POST',
    data: {
      phone_number,
      code,
    },
  })
}

export const get_code = (phone_number) => {
  return http({
    url: '/api/get_code',
    method: 'GET',
    params: {
      phone_number,
    },
  })
}

export const auth_check = () => {
  return http({
    url: '/api/hello',
    method: 'GET',
  })
}
