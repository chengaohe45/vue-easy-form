import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// 引入UI样式,各模块按需引入ui组件
import "element-ui/lib/theme-chalk/index.css";
//引入ui组件
import elementUI from "element-ui";
// 引入基本样式
import "@/static/css/index.scss";

import esForm from "@/package/index.js";

import gComponent from "@/components/register.js";

// codemirror的引入
// import VueCodemirror from "vue-codemirror";
// // require styles
// import "codemirror/lib/codemirror.css";
// // language
// import "codemirror/mode/javascript/javascript.js";
// Vue.use(VueCodemirror);

// 注册全局组件
gComponent.register();
Vue.use(elementUI);
Vue.use(esForm, {
  rowHeight: 40,
  rowSpace: 20,
  labelWidth: 100,
  offsetLeft: 0,
  offsetRight: 0,
  colon: false,
  direction: "h",
  defaultCom: "el-input", // 如：若用element-ui, 改为el-input
  defaultVal: "", // 对defaultCom这个组件的value设置默认值
  trimDoms: ["input", "textarea", "el-input"], // 数组，空数组会全部清空
  hasConsole: process.env.NODE_ENV != "production" // 推荐写成动态，编译时不用修改
});

Vue.config.productionTip = false;

window.vm = new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

window.onerror = function() {
  alert(1);
};
