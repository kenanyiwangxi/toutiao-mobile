// 搜索相关请求模块
import request from '@/utils/request'

// 获取所有搜索联想建议
export const getSearchSuggestionAPI = q => {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q // 搜索关键词
    }
  })
}

// 获取搜索结果
export const getSearchResultAPI = params => {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params
  })
}
