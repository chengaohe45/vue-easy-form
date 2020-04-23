import Vue from "vue";
// 引入UI样式,各模块按需引入ui组件
import "element-ui/lib/theme-chalk/index.css";
import elementUI from "element-ui";
import "@/static/css/index.scss";
Vue.use(elementUI);
Vue.config.productionTip = false;