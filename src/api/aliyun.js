import { http } from '@/util/http'

export const upload_avatar = (user_id,file_base64,oss_path) => {
  return http({
    url: '/api/upload_avatar',
    method: 'POST',
    data: {
      user_id,
      file_base64,
      oss_path
    },
  })
}

export const upload_audio = (tixing_id,audioFile) => {
  const formData = new FormData()
  formData.append('audio',audioFile,audioFile.name)
  formData.append('tixing_id',tixing_id)
  return http.post('/api/upload_audio', formData,{
    headers: {'Content-Type': 'multipart/form-data'},
    OnUploadProgress: progress => {
      const percent = Math.round((progress.loaded * 100) / progress.total);
      console.log(`上传进度:${ percent }%`)
    }
  })
}

export const asr_tixing_create = (user_id,audioFile) => {
  const formData = new FormData()
  formData.append('audio',audioFile,audioFile.name)
  formData.append('user_id',user_id)
  return http.post('/api/asr_tixing_create', formData,{
    headers: {'Content-Type': 'multipart/form-data'},
    OnUploadProgress: progress => {
      const percent = Math.round((progress.loaded * 100) / progress.total);
      console.log(`上传进度:${ percent }%`)
    }
  })
}
