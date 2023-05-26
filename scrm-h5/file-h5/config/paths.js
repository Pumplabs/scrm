const path = require('path')
const fs = require('fs')
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appPath: resolveApp('.'),
  srcPath: resolveApp('./src'),
  proxyPath: resolveApp('src/setupProxy.js'),
  paramsPath: resolveApp('./params.json'),
  buildPath: resolveApp('./build'),
  publicPath: resolveApp('./public')
}