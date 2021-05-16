import axios from 'axios'

const request = axios.create({
  // can not set baseUrl
  // baseURL: 'https://tuchong.com/',
  withCredentials: true, // 跨域请求时发送cookies
  timeout: 10000 // request timeout
})

// http response 拦截器
request.interceptors.response.use(response => {
  // 对响应数据做点什么
  console.log(response)
  return response.data
}, error =>
  Promise.reject(error)
)

export default request