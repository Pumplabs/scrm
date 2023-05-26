const { merge } = require('webpack-merge');
const fs = require('fs');
const paths = require('./paths');
const base = require('./webpack.base.js');
const utils = require('./utils');
const proxy = require('./proxy');

// console.log('__dirname', __dirname)
function getMockData() {
  let res = {};
  try {
    const json = fs.readFileSync(paths.paramsPath, {
      encoding: 'utf-8',
    });
    res = JSON.parse(json);
  } catch (e) {}
  return res;
}

function getOpenUrl(url) {
  const mockUrlParams = getMockData();
  const res = utils.convertToUrlParams(mockUrlParams);
  return res ? `${url}?${res}` : url;
}

module.exports = merge(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.css$/, // 检测css结尾的文件
        // 这里的loader执行顺序是从右到左，先执行css-loader，将css样式代码转成js代码，然后执行
        // style-loader,将js中的样式动态添加到网页中
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
    ],
  },
  devServer: {
    // 配置静态资源目录
    // 目的是开放这个文件目录作为http的访问目录，当使用http://localost:8081相当于在dist和public文件夹
    // 中寻找对应的文件，先找到哪个就加载哪个
    static: [
      paths.buildPath,
      paths.publicPath,
    ],
    // before (app, server) {
    //   // Keep `evalSourceMapMiddleware` and `errorOverlayMiddleware`
    //   // middlewares before `redirectServedPath` otherwise will not have any effect
    //   // This lets us fetch source contents from webpack for the error overlay
    //   app.use(evalSourceMapMiddleware(server));
    //   // This lets us open files from the runtime error overlay.
    //   app.use(errorOverlayMiddleware());

    //   if (fs.existsSync(proxyPath)) {
    //     // This registers user provided middleware for proxy reasons
    //     require(paths.proxySetup)(app);
    //   }
    // },
    // 本地访问的ip地址，如果
    host: 'localhost',
    port: 8081,
    // open: true,
    open: [getOpenUrl('/index.html')],
    proxy,
  },
});
