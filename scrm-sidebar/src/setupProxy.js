const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: 'http://121.37.15.30:9900',
      target: 'http://127.0.0.1:9900',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    })
  )
}