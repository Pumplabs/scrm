const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const env = require('./env')
const Constants = require('./constants')
const paths = require('./paths')

module.exports = {
  entry: {
    index: path.resolve(paths.appPath, 'src/index.js'),
    // index: path.resolve(__dirname, 'src/index.js')
  },
  output: {
    filename: Constants.staticPath + `[name].${Date.now()}.js`,
    path: path.resolve(paths.appPath, 'build'),
    // publicPath是生成的dist中的html文件中自动引入js和css文件时在最前面拼的一部分字符串
    publicPath: '',
  },
  module: {
    rules: [
      {
        //  识别到所有.js结尾的文件
        test: /.js$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(paths.appPath, 'public/index.html'),
      filename: 'index.html',
      chunks: ['index'],
      templateParameters: env,
    }),
  ],
  resolve: {
    // 配置免后缀的文件类型
    extensions: ['.js'],
    alias: {
      'src': paths.srcPath
    }
  }
}