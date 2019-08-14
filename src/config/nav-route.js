/* 设置注意：当:router="true"时，点击切换页面，会先判断:route="{path: subItem.link || ""}"有没有值，再判断它的:index */

// import homePage from "../modules/home/pages/index";

import labelForm from "../modules/demo-form/pages/label";
import componentForm from "../modules/demo-form/pages/component";
import simpleForm from "../modules/demo-form/pages/simple";
import standardForm from "../modules/demo-form/pages/standard";
import uiForm from "../modules/demo-form/pages/ui";
import colForm from "../modules/demo-form/pages/col";
import pholderForm from "../modules/demo-form/pages/pholder";
import groupForm from "../modules/demo-form/pages/group";
import directionForm from "../modules/demo-form/pages/direction";
import rulesForm from "../modules/demo-form/pages/rules";

import comUnitForm from "../modules/demo-form/pages/unit";
import comDescForm from "../modules/demo-form/pages/desc";
import comHelpForm from "../modules/demo-form/pages/help";
import comTitleForm from "../modules/demo-form/pages/title";

import propertiesForm from "../modules/demo-form/pages/properties";
import propertiesTabsForm from "../modules/demo-form/pages/properties-tabs";
import esFuncForm from "../modules/demo-form/pages/es-function";
import rowArrForm from "../modules/demo-form/pages/row-array";
import legendArrForm from "../modules/demo-form/pages/legend-array";
import tabArrForm from "../modules/demo-form/pages/table-array";
import tabsArrForm from "../modules/demo-form/pages/tabs-array";
import valueForm from "../modules/demo-form/pages/value";
import formatForm from "../modules/demo-form/pages/format";
import refForm from "../modules/demo-form/pages/ref";
import actionsForm from "../modules/demo-form/pages/actions";
import exampleForm from "../modules/demo-form/pages/example";
import autoMatchForm from "../modules/demo-form/pages/auto-match";

import notFound from "../modules/notfound/pages/index";

// import testForm from "../modules/demo-form/pages/test";

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
    name: "基础属性详解",
    children: [
      // {
      //   icon: "",
      //   name: "测试页面",
      //   link: "/test",
      //   path: "/test",
      //   component: testForm
      // },
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
        name: "项标签",
        link: "/label",
        path: "/label",
        component: labelForm
      },
      {
        icon: "",
        name: "项组件",
        link: "/component",
        path: "/component",
        component: componentForm
      },
      {
        icon: "",
        name: "项组件事件",
        link: "/actions",
        path: "/actions",
        component: actionsForm
      },
      {
        icon: "",
        name: "项组件验证",
        link: "/rules",
        path: "/rules",
        component: rulesForm
      },
      {
        icon: "",
        name: "项组件值转换",
        link: "/format",
        path: "/format",
        component: formatForm
      },
      {
        icon: "",
        name: "单位",
        link: "/unit",
        path: "/unit",
        component: comUnitForm
      },
      {
        icon: "",
        name: "描述",
        link: "/desc",
        path: "/desc",
        component: comDescForm
      },
      {
        icon: "",
        name: "帮助",
        link: "/help",
        path: "/help",
        component: comHelpForm
      },
      {
        icon: "",
        name: "标题",
        link: "/title",
        path: "/title",
        component: comTitleForm
      },
      {
        icon: "",
        name: "es/函数化写法",
        link: "/es-function",
        path: "/es-function",
        component: esFuncForm
      }
    ]
  },
  {
    icon: "el-icon-menu",
    name: "表单布局",
    children: [
      {
        icon: "",
        name: "项排列设置",
        link: "/direction",
        path: "/direction",
        component: directionForm
      },
      {
        icon: "",
        name: "项长度设置",
        link: "/col",
        path: "/col",
        component: colForm
      },
      {
        icon: "",
        name: "界面调整设置",
        link: "/ui",
        path: "/ui",
        component: uiForm
      },
      {
        icon: "",
        name: "分组设置",
        link: "/group",
        path: "/group",
        component: groupForm
      },
      {
        icon: "",
        name: "占位空间",
        link: "/pholder",
        path: "/pholder",
        component: pholderForm
      },
      {
        icon: "",
        name: "子属性(块布局)",
        link: "/properies",
        path: "/properies",
        component: propertiesForm
      },
      {
        icon: "",
        name: "子属性(tabs布局)",
        link: "/prop-tabs",
        path: "/prop-tabs",
        component: propertiesTabsForm
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
      }
    ]
  },
  {
    icon: "el-icon-menu",
    name: "表单事件/方法",
    children: [
      {
        icon: "",
        name: "引用",
        link: "/ref",
        path: "/ref",
        component: refForm
      },

      {
        icon: "",
        name: "value/值",
        link: "/value",
        path: "/value",
        component: valueForm
      },

      {
        icon: "",
        name: "自动匹配",
        link: "/auto-match",
        path: "/auto-match",
        component: autoMatchForm
      },

      {
        icon: "",
        name: "综合例子",
        link: "/example",
        path: "/example",
        component: exampleForm
      }
    ]
  }
  // {
  //   icon: "el-icon-edit",
  //   name: "试一试",
  //   link:
  //     "/try" /* 用于点击链接; 若没有这个，说明是一个大模块，下面还有其它子页面;若存在就只有他自己，比如：home */,
  //   path: "/try" /* 用于路由, 要跟link保持一致 */,
  //   component: tryForm /* 对应的模块 */
  // }
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
