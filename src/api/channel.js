// 频道相关请求模块
import request from '@/utils/request'

// 获取所有频道列表
export const getAllChannelsAPI = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}

// 添加用户频道  (被阻止)
// export const updateUserChannelsAPI = data => {
//   return request({
//     method: 'PUT',
//     url: '/v1_0/channels',
//     data
//   })
// }

// 删除用户频道
export const deleteUserChannelAPI = channelId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${channelId}`
  })
}
