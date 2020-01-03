/* 设置注意：当:router="true"时，点击切换页面，会先判断:route="{path: subItem.link || ""}"有没有值，再判断它的:index */

// import homePage from "../views/home/index";

// 基础属性
import labelForm from "../views/demo/label";
import componentForm from "../views/demo/component";
import simpleForm from "../views/demo/simple";
import standardForm from "../views/demo/standard";
import comUnitForm from "../views/demo/unit";
import comDescForm from "../views/demo/desc";
import comHelpForm from "../views/demo/help";
import comTitleForm from "../views/demo/title";
import propertiesForm from "../views/demo/properties";
import propertiesTabsForm from "../views/demo/tabs";
import exampleForm from "../views/demo/example";

// 数组
import rowArrForm from "../views/demo/array-row";
import legendArrForm from "../views/demo/array-legend";
import tabArrForm from "../views/demo/array-table";
import tabsArrForm from "../views/demo/array-tabs";
import cardArrForm from "../views/demo/array-card";

import notFound from "../views/notfound/index";

// import testForm from "../views/demo/test";

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
// let homeItem = {
//   icon: "el-icon-setting",
//   name: "首页",
//   link:
//     "/home" /* 用于点击链接; 若没有这个，说明是一个大模块，下面还有其它子页面;若存在就只有他自己，比如：home */,
//   path: "/home" /* 用于路由, 要跟link保持一致 */,
//   alias: "/",
//   component: homePage /* 对应的模块 */
// };

let notFoundItem = {
  icon: "" /* 不需要，因为不在左边菜单上 */,
  name: "···", //【·】
  link: "*" /* 不需要，因为不在左边菜单上 */,
  path: "*",
  component: notFound //404 页
};

// let emptyItem = {
//   icon: "" /* 不需要，因为不在左边菜单上 */,
//   name: "···", //【主要用于面包碎：当中间动态路径找不到的时候】
//   link: "" /* 不需要，因为不在左边菜单上 */,
//   path: ""
// };

/* home跟navList都会添加到左边菜单 */
let navList = [
  {
    icon: "el-icon-menu",
    name: "属性详解",
    children: [
      {
        icon: "",
        name: "简单写法",
        link: "/",
        path: "/",
        alias: "/simple",
        component: simpleForm
      },
      {
        icon: "",
        name: "标准写法",
        link: "/standard",
        path: "/standard",
        component: standardForm
      },
      {
        icon: "",
        name: "项标签/label",
        link: "/label",
        path: "/label",
        component: labelForm
      },
      {
        icon: "",
        name: "项组件/component",
        link: "/component",
        path: "/component",
        component: componentForm
      },
      {
        icon: "",
        name: "单位/unit",
        link: "/unit",
        path: "/unit",
        component: comUnitForm
      },
      {
        icon: "",
        name: "描述/desc",
        link: "/desc",
        path: "/desc",
        component: comDescForm
      },
      {
        icon: "",
        name: "帮助/help",
        link: "/help",
        path: "/help",
        component: comHelpForm
      },
      {
        icon: "",
        name: "标题/title",
        link: "/title",
        path: "/title",
        component: comTitleForm
      },
      {
        icon: "",
        name: "块布局/properties",
        link: "/properties",
        path: "/properties",
        component: propertiesForm
      },
      {
        icon: "",
        name: "tabs布局/layout",
        link: "/tabs",
        path: "/tabs",
        component: propertiesTabsForm
      },
      {
        icon: "",
        name: "综合例子",
        link: "/example",
        path: "/example",
        component: exampleForm
      }
    ]
  },
  {
    icon: "el-icon-menu",
    name: "数组",
    children: [
      {
        icon: "",
        name: "行数组",
        link: "/row-array",
        path: "/row-array",
        component: rowArrForm
      },
      {
        icon: "",
        name: "legend数组",
        link: "/legend-array",
        path: "/legend-array",
        component: legendArrForm
      },
      {
        icon: "",
        name: "表格数组",
        link: "/table-array",
        path: "/table-array",
        component: tabArrForm
      },
      {
        icon: "",
        name: "tabs数组",
        link: "/tabs-array",
        path: "/tabs-array",
        component: tabsArrForm
      },
      {
        icon: "",
        name: "卡片数组",
        link: "/card-array",
        path: "/card-array",
        component: cardArrForm
      }
    ]
  }
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

// function find(curNavList, curPath) {
//   let newPaths = [];
//   for (let i = 0; i < curNavList.length; i++) {
//     let item = curNavList[i];
//     if (item.path == curPath) {
//       newPaths.push(fetch(item, navKeys3));
//       return newPaths;
//     }
//     if (item.children && item.children.length > 0) {
//       let nextItems = find(item.children, curPath);
//       if (nextItems) {
//         if (item.path) {
//           newPaths.push(fetch(item, navKeys3), ...nextItems);
//           return newPaths;
//         } else {
//           newPaths.push(...nextItems); //navList最外面那一层是没有path的
//           return newPaths;
//         }
//       }
//     }
//   }

//   return false;
// }

let navRoute = {
  // getHomePath() {
  //   return homeItem.path;
  // },

  /* 取出左边菜单的数据 */
  getNav() {
    let newNavList = [];

    //put in home page
    // newNavList.push(fetch(homeItem, navKeys3));

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
    // newPageList.push(fetch(homeItem, pathKeys));
    //导航菜单，可能存在多级
    newPageList.push(...scan(navList));
    //其它页面
    newPageList.push(...scan(otherList));

    //放在最后
    newPageList.push(fetch(notFoundItem, pathKeys));
    return newPageList;
  }

  /* 取出当前页面的面包碎 */
  // getBreadcrumbs(toPage) {
  //   var routeMatchedInfo = toPage.matched[0];
  //   let newPaths = [];
  //   if (routeMatchedInfo) {
  //     newPaths.push(fetch(homeItem, navKeys3));
  //     if (routeMatchedInfo.path == notFoundItem.path) {
  //       newPaths.push(fetch(notFoundItem, navKeys3));
  //     } else if (routeMatchedInfo.path != homeItem.path) {
  //       //上面已经加了，排除一下，免得重复
  //       let tmpPaths = find(navList, routeMatchedInfo.path);
  //       if (!tmpPaths) {
  //         tmpPaths = find(otherList, routeMatchedInfo.path);
  //       }
  //       if (tmpPaths) {
  //         tmpPaths[tmpPaths.length - 1].link = toPage.path;
  //         newPaths.push(...tmpPaths);
  //       }
  //     }
  //     // delete newPaths[newPaths.length - 1].link; //删除最后一个的link，因为最后一个不用做跳转
  //   } else {
  //     // 返回空数组
  //   }
  //   return newPaths;
  // },

  // getEmptyBreadcrumb() {
  //   return fetch(emptyItem, navKeys3);
  // },

  // isToChild(toPage, fromPage) {
  //   //用于from和to, 是否前往子页（孙子也为false）:主要作用用于列表页
  //   var routeMatchedInfo = toPage.matched[0];
  //   let tmpPaths = find(navList, routeMatchedInfo.path);
  //   if (tmpPaths && tmpPaths.length > 1) {
  //     var tmpParentPath = tmpPaths[tmpPaths.length - 2];
  //     if (tmpParentPath.path == fromPage.matched[0].path) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return false;
  //   }
  // },

  // isFromChild(toPage, fromPage) {
  //   //用于from和to, 是否前往子页返回（孙子也为false）:主要作用用于列表页
  //   // console.log("toPage, fromPage", toPage, fromPage);
  //   var routeMatchedInfo = fromPage.matched[0];
  //   if (routeMatchedInfo) {
  //     let tmpPaths = find(navList, routeMatchedInfo.path);
  //     if (tmpPaths && tmpPaths.length > 1) {
  //       var tmpParentPath = tmpPaths[tmpPaths.length - 2];
  //       if (tmpParentPath.path == toPage.matched[0].path) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     //没有mathch, 可能是页面刷新
  //     return true;
  //   }
  // }
};
export default { ...navRoute };
