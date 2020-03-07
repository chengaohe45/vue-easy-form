# vue-easy-form

<p align="left">
  <a href="https://github.com/vuejs/vue"><img src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg" alt="vue"></a>
  <a href="https://www.npmjs.com/package/vue-easy-form"><img src="https://img.shields.io/npm/v/vue-easy-form.svg" alt="version"></a>
</p>

vue-easy-form：简称esForm，是一个独立、不依赖第三方类库的vue表单组件。通过一份json配置动态输出用户所需要的表单。组件布局丰富、逻辑控制简洁、事件联动灵活、`无缝对接第三方类库`, 极大地提高用户开发效率。

## 项目安装

### Node 版本要求
[Node.js](https://nodejs.org/en/) >= 8.11; 若需要升级；可使用[nvm](https://github.com/nvm-sh/nvm) 或 [nvm-windows](https://github.com/coreybutler/nvm-windows) 进行多个 Node 版本管理。

### 技术要求
`npm install` 会自行安装；无需特别安装
- [vue2.6.10](https://cn.vuejs.org/v2/guide/)
- [element-ui2.4.6](https://element.eleme.cn/#/zh-CN/component/installation)（注：vue-easy-form组件并不依赖于element-ui；只是编写`示例`时结合element-ui编写）

[esForm文档](https://chengaohe45.github.io/vue-easy-form-docs/dist/)  
[esForm源码](https://github.com/chengaohe45/vue-easy-form)

### Install
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

## 目录结构
本项目包含`esForm框架源码`和`实例源码`，其中`esForm框架源码`独立存在于`/src/package`文件夹中。整个项目具体结构如下：

```js
├── dist                       # 构建相关
├── public                     # 编译资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── assets                 # 静态资源
│   ├── components             # 全局公用组件
│   ├── libs                   # 工具类
│   ├── package                # 独立的esform源码，不依赖其它文件夹
│   ├── router                 # 菜单配置和路由实现
│   ├── static                 # 全局样式
│   ├── views                  # 页面视图，demo就存在于此
│   ├── App.vue                # vue入口组件
│   ├── main.js                # 入口文件
├── tests                      # 测试模块
├── .eslintrc.js               # eslint配置项
├── .gitignore                 # git忽略文件
├── vue.config.js              # vue-cli3脚手架配置
├── postcss.config.js          # postcss配置
├── README.md                  # readme文件
└── package.json               # package.json安装依赖
```