import Vue from "vue";
import Router from "vue-router";

import navRoute from "@/config/nav-route";

// 路由配置从方法调用，变成了对象传递
const routes = navRoute.getPages();

Vue.use(Router);

export default new Router({
  routes
});
