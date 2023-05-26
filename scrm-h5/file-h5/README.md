# wxh5-project
> 微信h5界面框架
# h5项目
## 项目结构介绍
|-- projectName
    |-- .gitignore
    |-- package-lock.json
    |-- package.json
    |-- params.json 如果调试时需要url带参，可以使用此文件
    |-- README.md
    |-- build 打包后的目录
    |-- config webpack配置相关文件
    |   |-- constants.js webpack常量
    |   |-- env.js webpack运行变量
    |   |-- utils.js 工具方法
    |   |-- webpack.base.js
    |   |-- webpack.dev.js
    |   |-- webpack.prod.js
    |-- public 
    |-- src
        |-- index.less 样式文件  
        |-- index.js 入口文件
params.json实例
```
{
  "name": "hh"
}
```
运行后的界面url如下

如果某个参数值为对象，则该参数值会被使用encodeURIComponent转译后再放入url上
```
{
  "search": {
    "name": "hhh",
  }
}

```
运行后的界面url如下
## 启动项目
step1: 初始化项目
```
npm install
```
step2: 配置params.json(不需要可跳过)
> 界面正常情况下是在手机端调用，为了方便调试，我们把参数放入data.json的search中
```
{
  "xx": xxx
}
```
step3: 启动项目
```
npm run start
``` 
## 打包项目
1. 需要vConsole控制台
```
npm run build:dev
```
2. 不需要vConsole控制台
```
npm run build
```

eslint结合webpack
1. 安装eslint, eslint-loader
2. 初始化.eslintrc文件
