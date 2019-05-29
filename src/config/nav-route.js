/* 设置注意：当:router="true"时，点击切换页面，会先判断:route="{path: subItem.link || ""}"有没有值，再判断它的:index */

import home from "../modules/home/pages/index";

import baseForm from "../modules/demo-form/pages/base";
import simpleForm from "../modules/demo-form/pages/simple";
import standardForm from "../modules/demo-form/pages/standard";
import uiForm from "../modules/demo-form/pages/ui";
import colForm from "../modules/demo-form/pages/col";
import pholderForm from "../modules/demo-form/pages/pholder";
import groupForm from "../modules/demo-form/pages/group";
import directionForm from "../modules/demo-form/pages/direction";
import ruleForm from "../modules/demo-form/pages/rule";

import unitDescForm from "../modules/demo-form/pages/unit-desc";
import helpForm from "../modules/demo-form/pages/help";
import propertiesForm from "../modules/demo-form/pages/properties";
import propertiesTabsForm from "../modules/demo-form/pages/properties-tabs";
import logicForm from "../modules/demo-form/pages/logic";
import rowArrForm from "../modules/demo-form/pages/row-array";
import legendArrForm from "../modules/demo-form/pages/legend-array";
import tabArrForm from "../modules/demo-form/pages/table-array";
import tabsArrForm from "../modules/demo-form/pages/tabs-array";
import valueForm from "../modules/demo-form/pages/value";
import formatForm from "../modules/demo-form/pages/format";
import refForm from "../modules/demo-form/pages/ref";
import actionForm from "../modules/demo-form/pages/action";
import eventForm from "../modules/demo-form/pages/event";
import exampleForm from "../modules/demo-form/pages/example";
import tryForm from "../modules/demo-form/pages/try";

import notFound from "../modules/notfound/pages/index";

let navKeys2 = ["icon", "name"];
let navKeys3 = ["icon", "name", "link", "path"];
let pathKeys = ["path", "component", "alias"];

// let loginItem = {
//   icon: "" /* 不需要，因为不在左边菜单上 */,
//   name: "登录" /* 不需要，因为不在左边菜单上 */,
//   link: "/login" /* 不需要，因为不在左边菜单上 */,
//   path: "/login" /* 用于路由 */,
//   component: login /* 对应的模块 */
// };

/* home跟navList都会添加到左边菜单 */
let homeItem = {
  icon: "el-icon-menu",
  name: "首页",
  link:
    "/home" /* 用于点击链接; 若没有这个，说明是一个大模块，下面还有其它子页面;若存在就只有他自己，比如：home */,
  path: "/home" /* 用于路由, 要跟link保持一致 */,
  alias: "/",
  component: home /* 对应的模块 */
};

let notFoundItem = {
  icon: "" /* 不需要，因为不在左边菜单上 */,
  name: "···", //【·】
  link: "*" /* 不需要，因为不在左边菜单上 */,
  path: "*",
  component: notFound //404 页
};

let emptyItem = {
  icon: "" /* 不需要，因为不在左边菜单上 */,
  name: "···", //【主要用于面包碎：当中间动态路径找不到的时候】
  link: "" /* 不需要，因为不在左边菜单上 */,
  path: ""
};

/* home跟navList都会添加到左边菜单 */
let navList = [
  {
    icon: "el-icon-menu",
    name: "esForm详解",
    children: [
      {
        icon: "",
        name: "入门/配置",
        link: "/form-base",
        path: "/form-base",
        component: baseForm
      },
      {
        icon: "",
        name: "简单写法",
        link: "/form-simple",
        path: "/form-simple",
        component: simpleForm
      },
      {
        icon: "",
        name: "标准写法",
        link: "/form-standard",
        path: "/form-standard",
        component: standardForm
      },
      {
        icon: "",
        name: "项长度设置",
        link: "/form-col",
        path: "/form-col",
        component: colForm
      },
      {
        icon: "",
        name: "类型设置",
        link: "/form-pholder",
        path: "/form-pholder",
        component: pholderForm
      },
      {
        icon: "",
        name: "分组设置",
        link: "/form-group",
        path: "/form-group",
        component: groupForm
      },
      {
        icon: "",
        name: "界面调整设置",
        link: "/form-ui",
        path: "/form-ui",
        component: uiForm
      },
      {
        icon: "",
        name: "项排列设置",
        link: "/form-direction",
        path: "/form-direction",
        component: directionForm
      },
      {
        icon: "",
        name: "单位与描述设置",
        link: "/form-unit-desc",
        path: "/form-unit-desc",
        component: unitDescForm
      },
      {
        icon: "",
        name: "帮助设置",
        link: "/form-help",
        path: "/form-help",
        component: helpForm
      },
      {
        icon: "",
        name: "子属性(块布局)",
        link: "/form-prop",
        path: "/form-prop",
        component: propertiesForm
      },
      {
        icon: "",
        name: "子属性(tabs布局)",
        link: "/form-prop-tabs",
        path: "/form-prop-tabs",
        component: propertiesTabsForm
      },
      {
        icon: "",
        name: "表单验证",
        link: "/form-rule",
        path: "/form-rule",
        component: ruleForm
      },
      {
        icon: "",
        name: "es逻辑控制",
        link: "/form-logic",
        path: "/form-logic",
        component: logicForm
      },
      {
        icon: "",
        name: "行数组",
        link: "/form-row-array",
        path: "/form-row-array",
        component: rowArrForm
      },
      {
        icon: "",
        name: "legend数组",
        link: "/form-legend-array",
        path: "/form-legend-array",
        component: legendArrForm
      },
      {
        icon: "",
        name: "表格数组",
        link: "/form-table-array",
        path: "/form-table-array",
        component: tabArrForm
      },
      {
        icon: "",
        name: "tabs数组",
        link: "/form-tabs-array",
        path: "/form-tabs-array",
        component: tabsArrForm
      },
      {
        icon: "",
        name: "取值/赋值",
        link: "/form-value",
        path: "/form-value",
        component: valueForm
      },
      {
        icon: "",
        name: "值转换",
        link: "/form-format",
        path: "/form-format",
        component: formatForm
      },
      {
        icon: "",
        name: "引用",
        link: "/form-ref",
        path: "/form-ref",
        component: refForm
      },
      {
        icon: "",
        name: "组件行为/事件",
        link: "/form-action",
        path: "/form-action",
        component: actionForm
      },
      {
        icon: "",
        name: "表单事件",
        link: "/form-event",
        path: "/form-event",
        component: eventForm
      },
      {
        icon: "",
        name: "详细例子",
        link: "/form-example",
        path: "/form-example",
        component: exampleForm
      },
      {
        icon: "",
        name: "试一试",
        link: "/form-try",
        path: "/form-try",
        component: tryForm
      }
    ]
  }
  // <!-- Don"t touch me - modules-->
];

//暂时只有一层，这个结构修改，取
let otherList = [
  // {
  // 	icon: "",        /* 不需要，因为不在左边菜单上 */
  // 	name: "notfound",
  // 	link: "*",   /* 不需要，因为不在左边菜单上 */
  // 	path: "*",
  // 	component: notFound, //404 页
  // }
];

/* 取出对应key相应的数据 */
function fetch(source, keys) {
  let newObj = {};
  keys.forEach(key => {
    if (typeof source[key] !== "undefined") {
      newObj[key] = source[key];
    }
  });
  return newObj;
}

/* 扫描数据，取出注册页面所需要的数据 */
function scan(curNavList) {
  let newPageList = [];
  curNavList.forEach(item => {
    if (item.path) {
      newPageList.push(fetch(item, pathKeys)); //只有一级
    }
    if (item.children && item.children.length > 0) {
      newPageList.push(...scan(item.children));
    }
  });
  return newPageList;
}

function find(curNavList, curPath) {
  let newPaths = [];
  for (let i = 0; i < curNavList.length; i++) {
    let item = curNavList[i];
    if (item.path == curPath) {
      newPaths.push(fetch(item, navKeys3));
      return newPaths;
    }
    if (item.children && item.children.length > 0) {
      let nextItems = find(item.children, curPath);
      if (nextItems) {
        if (item.path) {
          newPaths.push(fetch(item, navKeys3), ...nextItems);
          return newPaths;
        } else {
          newPaths.push(...nextItems); //navList最外面那一层是没有path的
          return newPaths;
        }
      }
    }
  }

  return false;
}

let navRoute = {
  getHomePath() {
    return homeItem.path;
  },

  /* 取出左边菜单的数据 */
  getNav() {
    let newNavList = [];

    //put in home page
    newNavList.push(fetch(homeItem, navKeys3));

    navList.forEach(item => {
      if (item.path) {
        newNavList.push(fetch(item, navKeys3)); //只有一级
      } else {
        if (item.children && item.children.length > 0) {
          let newItem = fetch(item, navKeys2);
          newItem.children = [];
          item.children.forEach(subItem => {
            newItem.children.push(fetch(subItem, navKeys3));
          });
          newNavList.push(newItem);
        } else {
          console.warn("导航菜单不合法: ", item);
        }
      }
    });
    // console.log("newNavList", newNavList);
    return newNavList;
  },

  /* 取出页面注册 */
  getPages() {
    let newPageList = [];
    newPageList.push(fetch(homeItem, pathKeys));
    //导航菜单，可能存在多级
    newPageList.push(...scan(navList));
    //其它页面
    newPageList.push(...scan(otherList));

    //放在最后
    newPageList.push(fetch(notFoundItem, pathKeys));
    return newPageList;
  },

  /* 取出当前页面的面包碎 */
  getBreadcrumbs(toPage) {
    var routeMatchedInfo = toPage.matched[0];
    let newPaths = [];
    if (routeMatchedInfo) {
      newPaths.push(fetch(homeItem, navKeys3));
      if (routeMatchedInfo.path == notFoundItem.path) {
        newPaths.push(fetch(notFoundItem, navKeys3));
      } else if (routeMatchedInfo.path != homeItem.path) {
        //上面已经加了，排除一下，免得重复
        let tmpPaths = find(navList, routeMatchedInfo.path);
        if (!tmpPaths) {
          tmpPaths = find(otherList, routeMatchedInfo.path);
        }
        if (tmpPaths) {
          tmpPaths[tmpPaths.length - 1].link = toPage.path;
          newPaths.push(...tmpPaths);
        }
      }
      // delete newPaths[newPaths.length - 1].link; //删除最后一个的link，因为最后一个不用做跳转
    } else {
      // 返回空数组
    }
    return newPaths;
  },

  getEmptyBreadcrumb() {
    return fetch(emptyItem, navKeys3);
  },

  isToChild(toPage, fromPage) {
    //用于from和to, 是否前往子页（孙子也为false）:主要作用用于列表页
    var routeMatchedInfo = toPage.matched[0];
    let tmpPaths = find(navList, routeMatchedInfo.path);
    if (tmpPaths && tmpPaths.length > 1) {
      var tmpParentPath = tmpPaths[tmpPaths.length - 2];
      if (tmpParentPath.path == fromPage.matched[0].path) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  isFromChild(toPage, fromPage) {
    //用于from和to, 是否前往子页返回（孙子也为false）:主要作用用于列表页
    // console.log("toPage, fromPage", toPage, fromPage);
    var routeMatchedInfo = fromPage.matched[0];
    if (routeMatchedInfo) {
      let tmpPaths = find(navList, routeMatchedInfo.path);
      if (tmpPaths && tmpPaths.length > 1) {
        var tmpParentPath = tmpPaths[tmpPaths.length - 2];
        if (tmpParentPath.path == toPage.matched[0].path) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      //没有mathch, 可能是页面刷新
      return true;
    }
  }
};
export default { ...navRoute };
