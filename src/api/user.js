// 用户相关请求模块
import request from '@/utils/request'

// 登录
export const loginAPI = data => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })
}

// 发送短信验证码
export const sendMsgAPI = mobile => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}

// 获取登录用户信息
export const getCurrentUserAPI = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 获取用户频道列表
export const getUserChannelsAPI = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
  })
}

// 关注用户
export const addFollowAPI = target => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target // 关注目标，用户id
    }
  })
}

// 取消关注
export const deleteFollowPI = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${target}`
  })
}
