const path = require("path");
const webpack = require("webpack");
let version = require("../../package.json").version;

let nums = version.split(".");
nums = nums.slice(0, nums.length - 1);  // 两个数字，中间版本
let urlVersion = nums.join(".");  // 打开就是编译最新版本

let isLatest = true;
let argvs = process.argv;
if (argvs && argvs.length > 0) {
  let paramIndex = argvs.indexOf("version");
  if (paramIndex > 0) {
    isLatest = false;
  }
}

const MAIN_DIR_PATH = "vue-easy-form-docs";  // 也可“vue-easy-form-docs/xx”;左右不要有"/"
// 这几个主要用于版本控制
var latestBaseUrl = "/" + MAIN_DIR_PATH + "/dist";    // 最新版本的baseUrl
var baseUrl = isLatest ? (latestBaseUrl + "/") : ("/" + MAIN_DIR_PATH + "/" + urlVersion + "/");   // 最右边一定要有“/”否则编译有问题
var prefixVerBaseUrl = "/" + MAIN_DIR_PATH;   // 当选择不是最新版本时，此时组合的前缀
var suffixVersion = ".x";   // 点后面不能是数字

module.exports = {
  title: "vue-easy-form（当前版本:" + urlVersion + suffixVersion + "）",
  description: '后台自动化平台',
  base: baseUrl,
  dest: "../vue-easy-form-docs/" + (isLatest ? "dist/" : (urlVersion + "/")),
  themeConfig: {
    // lastUpdated: '最后更新',
    nav: [
      { text: '指南', link: '/' },
      { text: '查看版本', link: '/version/overview' },
      // {
      //   text: '版本',
      //   items: [
      //     {
      //       text: '版本总览',
      //       link: '/version/overview'
      //     },
      //     {
      //       text: '1.6.*',
      //       link: '/version/1.6.all'
      //     },
      //     {
      //       text: '1.5.*',
      //       link: '/version/1.5.all'
      //     },
      //     {
      //       text: '1.4.*',
      //       link: '/version/1.4.all'
      //     }
      //   ]
      // },
      { text: '捐赠', link: '/donate' },
      { text: 'GitHub', link: 'https://github.com/chengaohe45/vue-easy-form' },
      { text: 'esForm例子', link: 'https://chengaohe45.github.io/vue-easy-form-docs/demo' }
    ],
    sidebar: {
      '/': [
        {
          title: '指南',
          collapsable: false,
          children: [
            '',
            'base/install',
            'base/quickstart',
            'base/settings',
            'base/explain',
            'base/com-format',
            'base/parse',
            'base/console'
          ]
        },
        {
          title: '基础属性详解',
          collapsable: false,
          children: [
            'base/d-col-group',
            'base/ui',
            'base/hidden',
            'base/properties',
            'base/tabs',
            'base/rules',
            'base/array',
            'base/value',
            'base/format',
            'base/auto-match',
            'base/form',
            'base/scopedSlots'
          ]
        },
        {
          title: '可组件化属性详解',
          collapsable: false,
          children: [
            'base/component',
            'base/label',
            'base/title',
            'base/help',
            'base/unit',
            'base/desc'
          ]
        }
      ],
      '/version/': ['overview', '1.4.all']
    }
  },

  configureWebpack: {
    resolve: {
      alias: {
        // "$src": path.resolve( __dirname, "../../src"),
        "@": path.resolve( __dirname, "../../src")
      }
    },

    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          VUE_APP_VERSION: JSON.stringify(version),  // 与库的写法同步
           // 文档中将要用到
          VUE_DOCS_VERSION: JSON.stringify(urlVersion),
          URL_SEPARATOR: JSON.stringify(baseUrl.replace(/\/+$/g, "")),   // 去年右边的“/”才好split
          LATEST_BASE_URL: JSON.stringify(latestBaseUrl),
          PREFIX_VERSION: JSON.stringify(prefixVerBaseUrl),
          SUFFIX_VERSION: JSON.stringify(suffixVersion)
        }
      })
    ]
  }
};
