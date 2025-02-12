//登录接口
import { http } from '@/util/http'

export const Postuser = (phoneNum, code) => {
  return http({
    url: '/login',
    method: 'POST',
    data: {
      phoneNum,
      code,
    },
  })
}
