// const apiMocker = require("webpack-api-mocker");
// const path = require("path");
// const mocker = path.resolve(__dirname, "./mock/data.js");

// vue.config.js 配置说明 (这个file是peter我加的)
// 这里只列一部分，具体配置惨考文档啊

const prodEnv = "production";

let isRelease = false;
if (process.env.NODE_ENV === prodEnv) {
  let argvs = process.argv;
  if (argvs && argvs.length > 0) {
    let paramIndex = argvs.indexOf("--target");
    let paramValIndex = argvs.indexOf("lib");
    console.log(paramIndex, paramValIndex);
    if (paramIndex + 1 == paramValIndex) {
      isRelease = true;
    }
  }
}

module.exports = {
  // baseUrl  type:{string} default:'/'
  // 将部署应用程序的基本URL
  // 将部署应用程序的基本URL
  // 默认情况下，Vue CLI假设您的应用程序将部署在域的根目录下。
  // https://www.my-app.com/。如果应用程序部署在子路径上，则需要使用此选项指定子路径。例如，如果您的应用程序部署在https://www.foobar.com/my-app/，集baseUrl到'/my-app/'.

  // baseUrl: process.env.NODE_ENV === 'production' ? '/online/' : '/test/',

  // baseUrl: "",
  publicPath: "",

  // outputDir: 在npm run build时 生成文件的目录 type:string, default:'dist'

  // outputDir: 'dist',

  outputDir: isRelease ? "dist" : "../vue-easy-form-docs/demo",

  // pages:{ type:Object,Default:undfind }
  /*
  构建多页面模式的应用程序.每个“页面”都应该有一个相应的JavaScript条目文件。该值应该是一
  个对象，其中键是条目的名称，而该值要么是指定其条目、模板和文件名的对象，要么是指定其条目
  的字符串，
  注意：请保证pages里配置的路径和文件名 在你的文档目录都存在 否则启动服务会报错的
  */
  
  configureWebpack: config => {
    if (isRelease) {
      config.externals = {
        ...config.externals,
        vue: {
          root: "Vue",
          commonjs2: "vue",
          commonjs: "vue",
          amd: "vue"
        },
        "element-ui": {
          root: "ElementUI",
          commonjs2: "ElementUI",
          commonjs: "ElementUI",
          amd: "ElementUI"
        },
        axios: {
          root: "axios",
          commonjs2: "axios",
          commonjs: "axios",
          amd: "axios"
        }
      };
    }
  },
  css: {
    extract: false // 是否内联css
  },
  //   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
  lintOnSave: process.env.NODE_ENV !== prodEnv ? true : false, // eslint-loader 是否在保存的时候检查
  // productionSourceMap：{ type:Bollean,default:true } 生产源映射
  // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
  productionSourceMap: false,
  // devServer:{type:Object} 3个属性host,port,https
  // 它支持webPack-dev-server的所有选项

  devServer: {
    port: 8086, // 端口号
    // // host: 'localhost',   //不要写这个东西，要写就写127.0.0.1
    // // https: false, // https:{type:Boolean}
    open: true //配置自动启动浏览器
    // before: (app) => {
    //   apiMocker(app, mocker, {
    //     proxy: {
    //       // '/api/*': 'http://domain.com.com'  //当没有mock数据，只符合此规则，则转换
    //     },
    //     changeHost: true
    //   });
    // },
    // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
    // proxy: {
    //   '/api': {
    //     target: '/mock/data.js',
    //     ws: true,
    //     changeOrigin: true
    //   },
    //   '/foo': {
    //     target: '<other_url>'
    //   }
    // },  // 配置多个代理
  }
};
