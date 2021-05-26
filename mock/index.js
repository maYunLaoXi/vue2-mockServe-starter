module.exports = [
 {
   url: '/rest/tags/%E9%A3%8E%E5%85%89/posts',
   response: {
     success: '@boolean',
     data: 'from mock & api err'
   }
 },
 {
   url: '/rest/tags/%E4%BA%BA%E5%83%8F/posts',
   response: {
     success: '@boolean',
     data: 'from mock & api err'
   }
 },
 {
   url: '/test/mock',
   method: 'post',
   forceMock: true,
   response: function(req) {
     return {
       success: '@boolean',
       'data|1-10': [{
         test: '@string',
         name: '@cname',
         id: '@natural(20,99999999)'
       }]
     }
   }
 }
]