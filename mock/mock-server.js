const chokidar = require('chokidar')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const path = require('path')
const Mock = require('mockjs')
const axios = require('axios')

const mockDir = path.join(process.cwd(), 'mock')

function registerRoutes(app) {
  let mockLastIndex
  const mocks = require('./index.js')
  const mocksForServer = mocks.map(route => {
    return responseFake(route.url, route.method, route.response, route.forceMock)
  })
  for (const mock of mocksForServer) {
    app[mock.method](mock.url, mock.response)
    mockLastIndex = app._router.stack.length
  }
  const mockRoutesLength = Object.keys(mocksForServer).length
  return {
    mockRoutesLength: mockRoutesLength,
    mockStartIndex: mockLastIndex - mockRoutesLength
  }
}

function unregisterRoutes() {
  Object.keys(require.cache).forEach(i => {
    if (i.includes(mockDir)) {
      delete require.cache[require.resolve(i)]
    }
  })
}

// for mock server
const responseFake = (url, method, respond, forceMock) => {
  return {
    url: new RegExp(`${process.env.VUE_APP_BASE_API || ''}${url}`),
    method: method || 'get',
    async response(req, res) {
      if (forceMock) {
        res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
        return
      }
      console.log('request invoke:', chalk.blue(`${req.path} ------------`))
      let resault = null
      const { method, body, query, headers, baseUrl, params } = req
      console.log({ method, body, query, headers, baseUrl, params})
      let errData = null
      try{
        const data  = await axios({
          url: 'https://tuchong.com' + req.path,
          headers: {
            'Content-Type': 'application/json'
          },
          method,
          data: body,
          params: query
        })
        console.log(chalk.green('success +++++++++++++++'))
        resault = data.data
      } catch(err) {
        console.log(chalk.red('err --------------------'))
        if (err.response){
          errData = { status: err.responsestatus, ...err.response.data}
        }
        console.log(err)
      }
      // if (errData) {
      //   return res.json(errData)
      // }
      if (resault) res.json(resault)
      else res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
    }
  }
}

module.exports = app => {
  // parse app.body
  // https://expressjs.com/en/4x/api.html#req.body
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  const mockRoutes = registerRoutes(app)
  var mockRoutesLength = mockRoutes.mockRoutesLength
  var mockStartIndex = mockRoutes.mockStartIndex

  // watch files, hot reload mock server
  chokidar.watch(mockDir, {
    ignored: /mock-server/,
    ignoreInitial: true
  }).on('all', (event, path) => {
    if (event === 'change' || event === 'add') {
      try {
        // remove mock routes stack
        app._router.stack.splice(mockStartIndex, mockRoutesLength)

        // clear routes cache
        unregisterRoutes()

        const mockRoutes = registerRoutes(app)
        mockRoutesLength = mockRoutes.mockRoutesLength
        mockStartIndex = mockRoutes.mockStartIndex

        console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`))
      } catch (error) {
        console.log(chalk.redBright(error))
      }
    }
  })
}
