import request from './request'

// 风光
export function getTagsLandscape(params) {
  return request({
    url: '/rest/tags/%E9%A3%8E%E5%85%89/posts',
    params
  })
}
// 人像
export function getTagsPortral(params) {
  return request({
    url: '/rest/tags/%E4%BA%BA%E5%83%8F/posts',
    params
  })
}
