const path = require('path');
const { merge } = require('webpack-merge');
const MinCssExtraPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.base.js');
const Constants = require('./constants');
const paths = require('./paths');
const env = require('./env');

module.exports = merge(base, {
  mode: 'production',
  // devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          MinCssExtraPlugin.loader,
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
          // {
          //   loader: 'style-loader'
          // },
          // 注释style-loader是因为style-loader的作用是将css通过js创建的style标签插入dom,我们现在需要生成外部css文件时，这个loader就没用了
          // MinCssExtraPlugin.loader能接到css-loader的操作结果，并且直接将这个结果放在外部文件而不交给
          // webapck
          MinCssExtraPlugin.loader,
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
  plugins: [
    new MinCssExtraPlugin({
      filename: `${Constants.staticPath}[name].${Date.now()}.css`,
    }),
  ],
  output: {
    // 每次构建时，将上一次的dist目录清除防止文件产生缓存或其它问题
    clean: true,
  },
});
