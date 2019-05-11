import Vue from "vue";

import VueRouter from "vue-router";

import navRoute from "../config/nav-route";

Vue.use(VueRouter);
// 路由配置从方法调用，变成了对象传递
const routes = navRoute.getPages();

const router = new VueRouter({
  routes
});

export default router;
