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

// 注册全局组件
gComponent.register();
Vue.use(elementUI);
Vue.use(esForm, {
  boxRowSpace: 10,
  defaultCom: "el-input",
  hasConsole: process.env.NODE_ENV !== "production"
});

Vue.config.productionTip = false;

window.vm = new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
