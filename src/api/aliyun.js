import { http } from '@/util/http'

export const upload_avatar = (user_id,file_base64,oss_path) => {
  return http({
    url: '/api/upload',
    method: 'POST',
    data: {
      user_id,
      file_base64,
      oss_path
    },
  })
}
