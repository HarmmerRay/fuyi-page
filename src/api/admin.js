//统一管理项目前部的接口

import {http} from "@/util/http.js";

export const safe_settings = (key, password) => {
  return http({
    url: '/api/admin/safe_settings',
    method: 'POST',
    data:{
      key,
      password
    }
  })
}

