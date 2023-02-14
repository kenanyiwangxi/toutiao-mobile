// 文章评论相关请求模块
import request from '@/utils/request'

// 获取评论列表
export const getCommentsAPI = params => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    params
  })
}

// 对评论或评论回复点赞
export const addLikeCommentAPI = target => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: { target }
  })
}
// 取消对评论或评论回复点赞
export const deleteLikeCommentAPI = target => {
  return request({
    method: 'Delete',
    url: `/v1_0/comment/likings/${target}`
  })
}

// 对文章或者评论进行评论
export const postCommentAPI = data => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}
