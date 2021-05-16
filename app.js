const axios = require('axios')

axios({
  method: 'get',
  url: 'https://tuchong.com/rest/tags/%E9%A3%8E%E5%85%89/posts',
  headers: {
    'Content-Type': 'application/json'
  },
  params: {
    page: 1,
    count: 20,
    order: 'weekly'
  }
}).then(res => {
  console.log('success++_+________-----_++++++++')
  console.log(res)
})