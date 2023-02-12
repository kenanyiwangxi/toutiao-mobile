// 文章相关请求模块
import request from '@/utils/request'

// 获取文章新闻推荐
export const getArtListAPI = (id, time) => {
  return request({
    method: 'GET',
    url: '/v1_0/articles',
    params: {
      channel_id: id, // 频道的id
      timestamp: time // 时间戳,请求新的推荐数据传当前的时间戳,请求历史推荐数据传指定的时间戳,timestamp相当于页码,请求最新数据使用当时最新时间戳,下一页数据使用上一次返回的数据中的时间戳
    }
  })
}

// 不感兴趣文章
export const dislikeArticleAPI = id => {
  // id 是文章的id
  return request({
    method: 'POST',
    url: '/v1_0/article/dislikes',
    data: { target: id }
  })
}

// 举报文章
export const reportArticleAPI = data => {
  // id 是文章的id
  return request({
    method: 'POST',
    url: '/v1_0/article/reports',
    data
  })
}
