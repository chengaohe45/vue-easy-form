# esForm介绍

> esForm是一个独立、不依赖第三方类库的vue表单组件。通过一份json配置动态输出用户所需要的表单。组件布局丰富、逻辑控制简洁、事件联动灵活、`无缝对接第三方类库`, 极大地提高用户开发效率。

## 为什么选择esForm?
- 只需要一个json配置，几乎无需html, css；
- 布局丰富，包含弹性布局（分为24栏）和tabs布局；
- 无缝对接第三方组件，无需为框架定制化组件（可自由选择`element-ui`、`fish-ui`等类库）；
- 表单功能齐全，包含标题、验证、事件、单位、帮助、描述、`数组`等；
- 逻辑控制灵活方便（支持[动态解析](./base/com-standard.md)）

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