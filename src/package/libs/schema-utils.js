/**
 * schema-utils.js
 *
 * Copyright (c) 2019 chengaohe All rights reserved.
 *
 * 用来标准化原始的表单schema
 *
 */
// import sysExtRules from "./rules";
import parse from "./parse";
import global from "./global";
import constant from "./constant";
import utils from "./utils";
import schemaRules from "./schema-rules";
import formUtils from "./form-utils";
import esHelp from "../components/help.vue";

import { enterSubmit, onlySubmit } from "./submit";

let schemaUtils = {
  /**
   * 用于检查rawSchema是否符合要求
   * @param {*} rawSchema
   */
  check(rawSchema) {
    try {
      this.completeSchema(rawSchema);
    } catch (e) {
      return e;
    }
    return true;
  },
  /**
   * 把原始的schema转化为标准的schema
   * 解析原则：
   * 对于一个对象{}来说
   * type === 'space'时，说明是占位空间，即使有component或properties, 也认为是占位空间，且解析时会把两个属性去掉
   * else if ：判断是否有properties且合法，即使有component也会去掉此属性
   * else: 是component，即使没有component也会用系统的默认值
   * 结论 >> 最后的输出是：
   * type === 'space'、component、properties只有一个会输出；也是就if (item.layout.name === 'space')、if (item.component)、if (item.properties)中，只有一个为真
   */
  completeSchema: function(schema) {
    // const constant.ARRAY_TABLE = "array-table";

    var autoMatch;
    if (utils.isObj(schema)) {
      var tmpSchema = utils.deepCopy(schema);
      var rootObj = tmpSchema;
      if (!utils.isObj(tmpSchema.properties)) {
        rootObj = {};
        rootObj.title = false;
        rootObj.layout = false;
        rootObj.properties = tmpSchema;

        // 根节点有效的属性
        autoMatch = false;
      } else {
        // 根节点有效的属性
        autoMatch = rootObj.autoMatch === true ? true : false;
      }

      // 基础设置，最外层的一些东西固定
      rootObj.array = false; // 顶级是不支持数组的
      rootObj.hidden = false; // 最外层也不支持隐藏
      rootObj.isTmp = false; // 最外层也不支持临时值
      rootObj.col = constant.UI_MAX_COL; // 最外层保持最大
      rootObj.label = { text: false, __rawText: false }; // 顶级是不支持label

      rootObj = this.__parseProp(
        rootObj,
        1,
        "根",
        this.__getGlobalInheritObj(), // 取自global
        ""
      );

      //根节点有效的属性
      rootObj.autoMatch = autoMatch;
      this.__checkForTile(rootObj);
      return rootObj;
    } else {
      throw "根schema是一个Object类型";
    }
  },

  /**
   * 解析项
   */
  __parseProp: function(propItem, curLevel, parentKey, inheritObj, myPathKey) {
    if (utils.isStr(propItem)) {
      propItem = { label: propItem };
    } else if (!utils.isObj(propItem)) {
      throw "第" +
        curLevel +
        "层的属性值(" +
        parentKey +
        ")必须是一个字符串或Object类型";
    }
    var newPropItem, propKeys, isArray, isNormalTabs;
    if (this.__isSpaceItem(propItem)) {
      // 占位空间 为什么用恒等，因为会严格判断是否是true/false, 同时也严格要求用户用true/false, 不要用1/0
      propKeys = this.__getPropKeys("none");
      newPropItem = this.__filterKeys(
        propItem,
        propKeys,
        inheritObj,
        myPathKey
      );
    } else if (this.__isPropItem(propItem)) {
      if (!this.__existEntityItem(propItem)) {
        throw "属性" + parentKey + "没有具体的子节点(properties全为空)";
      }

      // 是否数组(优先级最高)
      isArray = this.__isArray(propItem.array);
      propKeys = this.__getPropKeys("properties");
      newPropItem = this.__filterKeys(
        propItem,
        propKeys,
        inheritObj,
        myPathKey
      );

      var nextInheritObj = newPropItem.nextInherit;
      newPropItem.nextInherit = null;
      delete newPropItem.nextInherit;
      if (isArray) {
        if (utils.isUndef(newPropItem.array.rowSpace)) {
          // 当没有设置时，则取上一级的rowSpace
          newPropItem.array.rowSpace = newPropItem.rowSpace;
        }
      }
      // 判断ui, 因为是数组的话，有些属性可能有会（ui.rowHeight可能很用到）
      var newUi = newPropItem.ui ? newPropItem.ui : { showBody: true };
      newUi.rowSpace = nextInheritObj.rowSpace;
      newUi.rowHeight = nextInheritObj.rowHeight;
      newPropItem.ui = newUi;

      isNormalTabs =
        newPropItem.layout && newPropItem.layout.name === constant.LAYOUT_TABS;
      if (
        isArray &&
        newPropItem.array.name == constant.ARRAY_TABLE &&
        isNormalTabs
      ) {
        // 数组是以table形式布局，子节点无法进行tabs布局
        newPropItem.layout = false;
        isNormalTabs = false; // 强制置为非tabs
        console.warn(
          "第" +
            curLevel +
            "层(" +
            parentKey +
            ")为table数组且子节点为tabs, 子节点为tabs将失效"
        );
      }

      //有下一级
      if (propItem.component) {
        //提示警告
        parentKey = parentKey ? parentKey : "根";
        parentKey += "节点";
        console.warn(
          "第" +
            curLevel +
            "层(" +
            parentKey +
            ")中同时存在properties和component, component将失效"
        );
      }

      if (newPropItem.title) {
        newPropItem.title.__level = curLevel; //用于字号
      }

      newPropItem.__pathKey = myPathKey;
      newPropItem.__idxChain = "";
      newPropItem.__index = -1;
      if (isNormalTabs) {
        newPropItem.__tabsIndex = false;
      }

      //递归，取出下一级的数据
      var newProperties = {};
      for (var key in propItem.properties) {
        if (!this.__isRightKey(key)) {
          console.warn("属性" + key + "存在危险字符，会导致程序出错");
        }
        var nextRawPropItem = propItem.properties[key];
        if (this.__isIngnoreItem(nextRawPropItem)) {
          console.log("属性" + key + "为null/undefined/false时，将不设置");
        } else {
          var isSpaceItem = this.__isSpaceItem(nextRawPropItem);
          if (
            isSpaceItem &&
            newPropItem.array &&
            newPropItem.array.name == constant.ARRAY_TABLE
          ) {
            // 当父节点是table数组时，占位空间过滤掉
            console.warn(
              "属性" +
                key +
                "不符合" +
                constant.ARRAY_TABLE +
                "布局的要求(properties存在占位空间), 将失效"
            );
            continue;
          } else if (isSpaceItem && isNormalTabs) {
            console.warn(
              "属性" +
                key +
                "不符合" +
                constant.LAYOUT_TABS +
                "布局的要求(properties存在占位空间), 将失效"
            );
            continue;
          } else {
            // 符合要求了，进行下一步解析
          }

          var nextPropItem = this.__parseProp(
            nextRawPropItem,
            curLevel + 1,
            key,
            nextInheritObj,
            myPathKey ? myPathKey + "." + key : key
          );

          if (isNormalTabs) {
            // 是普通tabs
            nextPropItem.__hasError = false;
          }

          if (
            isNormalTabs ||
            (newPropItem.array &&
              newPropItem.array.name == constant.ARRAY_TABLE)
          ) {
            if (nextPropItem.label.text === false) {
              console.warn(
                "当属性(" +
                  parentKey +
                  ")为" +
                  constant.LAYOUT_TABS +
                  "或" +
                  constant.ARRAY_TABLE +
                  "时，下一级的label必须存在, 否则用各自的key代表头部"
              );
            }
          }

          if (
            isNormalTabs ||
            (newPropItem.array && newPropItem.array.name == constant.ARRAY_TABS)
          ) {
            newPropItem.__tabsIndex = false;
            newPropItem.__hasError = false; // 用来做复制
          }

          newProperties[key] = nextPropItem;
        }
      }
      if (Object.keys(newProperties).length <= 0) {
        throw "properties不能为空，或其属性全部为空(null/undefined/false)";
      }
      newPropItem.properties = newProperties;

      // 当是列表数组时，重新计算列宽，使其点100%
      if (newPropItem.array && newPropItem.array.name == constant.ARRAY_TABLE) {
        //整理一下ref, 同一级别的只留最后一下
        this.__updateTableCol(newPropItem);
      }

      //整理一下ref, 同一级别的只留最后一下
      this.__uniqueRef(newPropItem);

      if (
        isNormalTabs ||
        (newPropItem.array && newPropItem.array.name == constant.ARRAY_TABLE)
      ) {
        //当是tabs or constant.ARRAY_TABLE时，若是分组失效
        // continue; //是占位空间，去掉
      } else {
        //直接改变newPropItem的值，设置分组情况
        this.__reinitGroup(newPropItem);
      }

      if (newPropItem.array) {
        //数组类型，可增删
        //有值且合规范
        if (!newPropItem.array.value) {
          newPropItem.array.value = [];
        } else if (!utils.isArr(newPropItem.array.value)) {
          throw "array的值必须是数组或不写";
        }

        newPropItem.__propSchemaList = [];
        // console.log("newPropItem.array.value", newPropItem.array.value);
        formUtils.setValue(newPropItem, newPropItem.array.value);
        // console.log("end ...");
        delete newPropItem.array.value; //任务完成
      }
    } else {
      // 是组件了
      propKeys = this.__getPropKeys("component");
      newPropItem = this.__filterKeys(
        propItem,
        propKeys,
        inheritObj,
        myPathKey
      );

      if (this.__isTabsItem(propItem)) {
        newPropItem.layout = false;
        console.warn(
          "当属性(" +
            parentKey +
            ")为叶子节点时，" +
            constant.LAYOUT_TABS +
            "将不起作用"
        );
      } else {
        newPropItem.layout = false;
      }

      // 处理一下值
      // if (!newPropItem.hasOwnProperty("value")) {
      //   if (newPropItem.component.name === global.defaultCom) {
      //     // 设置默认值组件的默认值
      //     newPropItem.value = global.defaultVal;
      //   } else {
      //     newPropItem.value = undefined;
      //   }
      // } else {
      //   // 值存在，不用理会
      // }

      if (newPropItem.format) {
        newPropItem.value = formUtils.getFormatValue(
          newPropItem.format,
          newPropItem.value,
          true
        );
      }

      var eventOn = this.__fetchFormEvent(newPropItem);
      newPropItem.component.__emitEvents = eventOn.__emitEvents;
      newPropItem.component.__nativeEvents = eventOn.__nativeEvents;
      newPropItem.__pathKey = myPathKey;
      newPropItem.__idxChain = "";
      newPropItem.__index = -1;

      // 是否数组(优先级最高)
      isArray = this.__isArray(propItem.array);
      if (isArray) {
        //数组类型，可增删
        //有值且合规范
        if (!newPropItem.array.value) {
          newPropItem.array.value = [];
        } else if (!utils.isArr(newPropItem.array.value)) {
          throw "array.value的值必须是数组或不写";
        }

        if (utils.isUndef(newPropItem.array.rowSpace)) {
          // 当没有设置时，则取上一级的rowSpace
          newPropItem.array.rowSpace = newPropItem.rowSpace;
        }

        if (newPropItem.array.name == constant.ARRAY_TABS) {
          newPropItem.__tabsIndex = false;
        }

        newPropItem.__propSchemaList = [];

        formUtils.setValue(newPropItem, newPropItem.array.value);
        delete newPropItem.array.value; //任务完成
      }
    }

    newPropItem.__rawHidden = parse.newEsFuncion(newPropItem.hidden);
    newPropItem.__creatable = false; // 这个一定要设置要false, 说明初始化时是创建组件，一旦设置成true, 就改不回false

    return newPropItem;
  },

  /**
   * 对table数组布局，重新计算长度，使项相加为UI_MAX_COL(24列)
   * @param {*} newSchema
   */
  __updateTableCol(newSchema) {
    if (newSchema.properties) {
      var curProp = newSchema.properties;
      var nextPropItem, key, newCol;
      var total = 0;
      for (key in curProp) {
        nextPropItem = curProp[key];
        total += nextPropItem.col;
      }

      var newTotal = 0;
      if (total !== constant.UI_MAX_COL) {
        for (key in curProp) {
          nextPropItem = curProp[key];
          newCol = Math.round((nextPropItem.col * constant.UI_MAX_COL) / total);
          nextPropItem.col = newCol;
          newTotal += newCol;
        }
      }

      if (newTotal < constant.UI_MAX_COL) {
        // 不够100%， 补给后面的
        curProp[key].col = curProp[key].col + (constant.UI_MAX_COL - newTotal);
      }
    }
  },

  /**
   * 去掉同一级别的属性中，有相同的ref，保留最后一个
   * @param {*} newSchema 已经整理好的schema
   */
  __uniqueRef(newSchema) {
    if (newSchema.properties) {
      var curProp = newSchema.properties;
      var lastPropItem = {};
      for (var key in curProp) {
        // console.log("key: ", key);
        var nextPropItem = curProp[key];
        if (nextPropItem.component && nextPropItem.component.ref) {
          var nextRef = nextPropItem.component.ref;
          if (
            lastPropItem[nextRef] &&
            nextPropItem.component.ref === lastPropItem[nextRef].component.ref
          ) {
            // 存在上一个，删除上一个的ref
            var curCom = lastPropItem[nextRef].component;
            // console.log(curCom.ref);
            delete curCom.ref;
          }
          lastPropItem[nextRef] = nextPropItem; // 我变为上一个，以便下一个使用
        }
      }
      lastPropItem = null;
    }
  },

  /**
   * 解析触发事件
   * @param {*} trigger
   * 1. 事件字件串或者以空格隔开的事件所组成的字符串，如"click" or "click change"
   * 2. 事件组成的数组
   * @returns 返回数据组，没有时返回一个null
   */
  __parseTrigger: function(trigger) {
    var tmpTriggers;
    if (utils.isArr(trigger) || utils.isStr(trigger)) {
      if (utils.isStr(trigger)) {
        trigger = trigger.trim();
        tmpTriggers = trigger.split(/\s+/);
      } else {
        tmpTriggers = [];
        trigger.forEach(item => {
          if (utils.isStr(item)) {
            item = item.trim();
            tmpTriggers = tmpTriggers.concat(item.split(/\s+/));
          }
        });
      }

      tmpTriggers = tmpTriggers.map(item => {
        if (!item) {
          // 为空，直接写默认事件
          return constant.CLICK_EVENT;
        } else if (item.indexOf(".") === 0) {
          // 只有修改，前面加默认事件
          return constant.CLICK_EVENT + item;
        } else {
          // 合法
          return item;
        }
      });
    } else {
      tmpTriggers = null;
    }
    return tmpTriggers && tmpTriggers.length > 0 ? tmpTriggers : null;
  },

  /**
   * 判断属性是否合法
   * @param {*} key
   */
  __isRightKey(key) {
    var illChars = ["[", "]", ".", "{", "}", "(", ")"];
    for (var i = 0; i < illChars.length; i++) {
      if (key.indexOf(illChars[i]) >= 0) {
        throw "属性不能出现以下的危险字符：" + illChars.join(" ");
      }
    }
    return true;
  },

  /**
   * 整理出"表单"组件需要监听的外部事件
   */
  __fetchFormEvent: function(propItem) {
    var emitEvents = [],
      nativeEvents = [],
      triggerList,
      nativeName;

    if (propItem.rules) {
      var rules = propItem.rules;

      var checkList = rules.checks;
      if (checkList) {
        checkList.forEach(checkItem => {
          // 有检查
          triggerList = checkItem.trigger;
          triggerList.forEach(triggerItem => {
            nativeName = this.__getNativeName(triggerItem);
            if (nativeName) {
              // .native监听
              nativeEvents.push(nativeName);
            } else {
              emitEvents.push(triggerItem);
            }
          });
        });
      }
    }

    if (
      propItem.isTrim ||
      (utils.isUndef(propItem.isTrim) &&
        global.trimDoms.includes(propItem.component.name))
    ) {
      propItem.isTrim = true;

      var componentName = propItem.component.name.toLowerCase
        ? propItem.component.name.toLowerCase()
        : propItem.component.name;
      var curTrimEvent = constant.FORM_INPUTS.includes(componentName)
        ? constant.INPUT_CHANGE
        : global.trimEvent;
      // 要去掉左右两边的空格，添此触发事件
      nativeName = this.__getNativeName(curTrimEvent);
      if (nativeName) {
        // .native监听
        nativeEvents.push(nativeName);
      } else {
        emitEvents.push(curTrimEvent);
      }
    }

    // 自定义事件
    if (propItem.component && propItem.component.actions) {
      // var actions = propItem.component.actions;
      // actions.forEach(actionItem => {
      //   triggerList = actionItem.trigger;
      //   triggerList.forEach(triggerItem => {
      //     nativeName = this.__getNativeName(triggerItem);
      //     if (nativeName) {
      //       // .native监听
      //       nativeEvents.push(nativeName);
      //     } else {
      //       emitEvents.push(triggerItem);
      //     }
      //   });
      // });

      var actionInfo = this.__fetchActionEvent(propItem.component.actions);
      if (actionInfo.__emitEvents) {
        emitEvents = emitEvents.concat(actionInfo.__emitEvents);
      }

      if (actionInfo.__nativeEvents) {
        nativeEvents = nativeEvents.concat(actionInfo.__nativeEvents);
      }
    }

    return {
      __emitEvents: emitEvents.length ? utils.unique(emitEvents) : null,
      __nativeEvents: nativeEvents.length ? utils.unique(nativeEvents) : null
    };
  },

  /**
   * 整理出"表单"组件需要监听的外部事件
   */
  __fetchActionEvent: function(actions) {
    var emitEvents = [];
    var nativeEvents = [];
    var triggerList, nativeName;
    // 自定义事件
    if (actions) {
      actions.forEach(actionItem => {
        triggerList = actionItem.trigger;
        triggerList.forEach(triggerItem => {
          nativeName = this.__getNativeName(triggerItem);
          if (nativeName) {
            // .native监听
            nativeEvents.push(nativeName);
          } else {
            emitEvents.push(triggerItem);
          }
        });
      });
    }

    return {
      __emitEvents: emitEvents.length ? utils.unique(emitEvents) : null,
      __nativeEvents: nativeEvents.length ? utils.unique(nativeEvents) : null
    };
  },

  /**
   * 提取是否为.native事件
   * @param {*} eventName
   */
  __getNativeName(eventName) {
    var dotNative = "." + constant.ADJ_NATIVE;
    var lastIndex = eventName.lastIndexOf(dotNative);
    if (lastIndex != -1 && eventName.substr(lastIndex) === dotNative) {
      // .native监听
      var nativeName = eventName.substr(0, lastIndex);
      if (nativeName) {
        return nativeName;
      } else {
        return false; //因为eventName是经过处理的,不会出现点在前面，所以不会进入这里
      }
    } else {
      return false;
    }
  },

  /**
   * 根据不同的类型，取出不同的属性
   * @param {*} type
   */
  __getPropKeys: function(type) {
    var propKeys = [];
    switch (type) {
      case "component":
        propKeys = [
          "label",
          "rowHeight",
          "rowSpace",
          "labelWidth",
          "offsetLeft",
          "offsetRight",
          "hidden",
          "format",
          "hdValue",
          "colon",
          "group",
          // "value",
          "isTrim",
          "help",
          "desc",
          "unit",
          "direction",
          "col",
          "rules",
          "component",
          "array",
          "layout",
          "isTmp"
        ];
        break;
      case "properties":
        propKeys = [
          "ui",
          "title",
          "label",
          "rowHeight",
          // "boxRowHeight",
          "rowSpace",
          // "boxRowSpace",
          "labelWidth",
          // "boxLabelWidth",
          "nextInherit", // 这个比较特殊，不会对应哪个字段
          "offsetLeft",
          "offsetRight",
          "hidden",
          "hdValue",
          "colon",
          "help",
          "desc",
          // "unit",
          "direction",
          "col",
          "array",
          "layout",
          "isTmp"
        ];
        break;
      default:
        //占位空间
        propKeys = ["col", "group", "hidden", "layout"];
        break;
    }
    return propKeys;
  },

  /**
   * 取出schema的属性的判断信息，用来判断是否合法或设置默认值
   */
  __getNormalInfo: function(key) {
    var keyInfos = [
      // {
      //   key: "value",
      //   enums: [],
      //   defaultValue: undefined
      // },
      {
        key: "hidden",
        enums: [true, false],
        isOr: true, // filters里面的关系，默认为false
        filters: ["isEs", "isFunc"], // 取schema-rules规则过滤
        defaultValue: false
      },
      {
        key: "hdValue",
        enums: [],
        defaultValue: undefined
      },
      {
        key: "colon",
        enums: [true, false],
        defaultValue: global.colon
      },
      {
        key: "group",
        enums: [],
        filters: ["isStr"],
        defaultValue: false
      },
      {
        key: "col",
        enums: [],
        filters: [
          {
            name: "isInt",
            params: [1, constant.UI_MAX_COL]
          }
        ],
        defaultValue: constant.UI_MAX_COL
      },
      {
        key: "direction",
        enums: ["h", "v"],
        defaultValue: global.direction
      },
      {
        key: "isTrim",
        enums: [true, false],
        defaultValue: undefined // undefined代表是否删除空格取自于全局设置
      },
      {
        key: "rowHeight",
        enums: [],
        filters: [
          {
            name: "isInt",
            params: [0]
          }
        ],
        defaultValue: global.boxRowHeight
      },
      {
        key: "rowSpace",
        enums: [],
        filters: [
          {
            name: "isInt",
            params: [0]
          }
        ],
        defaultValue: global.boxRowSpace
      },
      {
        key: "labelWidth",
        enums: [],
        filters: [
          {
            name: "isInt",
            params: [0]
          }
        ],
        defaultValue: global.boxLabelWidth
      },
      {
        key: "offsetLeft",
        enums: [],
        filters: [
          {
            name: "isInt",
            params: [0]
          }
        ],
        defaultValue: 0
      },
      {
        key: "offsetRight",
        enums: [],
        filters: [
          {
            name: "isInt",
            params: [0]
          }
        ],
        defaultValue: 0
      },
      {
        key: "isTmp",
        enums: [true, false],
        defaultValue: false
      }
    ];
    for (var i = 0; i < keyInfos.length; i++) {
      if (keyInfos[i].key === key) {
        return keyInfos[i];
      }
    }
    return false;
  },

  /**
   * 统一解析普通属性
   * @param {*} propItem propItem or propItem.ui
   * @param {*} keyInfo
   * @param {*} inheritObj
   */
  __parseNormalKey: function(propItem, keyInfo, inheritObj) {
    var value = propItem[keyInfo.key];
    var tmpDefaultValue = utils.isUndef(inheritObj[keyInfo.key])
      ? keyInfo.defaultValue
      : inheritObj[keyInfo.key];
    if (utils.isUndef(value)) {
      return tmpDefaultValue;
    } else if (
      keyInfo.enums &&
      keyInfo.enums.length > 0 &&
      keyInfo.enums.includes(value)
    ) {
      return value;
    } else {
      // 看过滤信息
      var isOr = keyInfo.isOr ? true : false;
      if (keyInfo.filters && keyInfo.filters.length > 0) {
        var isRight = true;
        var funcName, funcParams, filterFunc;
        for (
          var filterIndex = 0;
          filterIndex < keyInfo.filters.length;
          filterIndex++
        ) {
          var filterItem = keyInfo.filters[filterIndex];
          if (utils.isStr(filterItem)) {
            funcName = filterItem;
            funcParams = [];
          } else {
            funcName = filterItem.name;
            funcParams = utils.isArr(filterItem.params)
              ? filterItem.params
              : [];
          }

          filterFunc = schemaRules[funcName];
          if (filterFunc) {
            var newParams = [value, ...funcParams];
            // console.log(newParams);
            var funcResult = filterFunc.apply(null, newParams);
            if (isOr) {
              // or 关系
              if (funcResult === true) {
                isRight = true;
                break;
              } else {
                isRight = false;
              }
            } else {
              // and 关系
              if (funcResult !== true) {
                isRight = false;
                break;
              } else {
                isRight = true;
              }
            }
          } else {
            console.warn(funcName + "不存在，请检查");
          }
        }

        if (isRight) {
          // 走了一圈，此值正确
          return value;
        } else {
          return tmpDefaultValue;
        }
      } else {
        // 没有条件，那么就是正确的
        return value;
      }
    }
  },

  /**
   * 解析右栏组件
   */
  __parseMainComponent: function(propItem, myPathKey) {
    var component = propItem.component;
    var newComponent,
      defaultAlign = false;
    if (utils.isObj(component) && Object.keys(component).length > 0) {
      newComponent = {};
      newComponent.name = component.name ? component.name : global.defaultCom;
      newComponent.actions = this.__parseActions(component.actions, myPathKey);
      var ref = utils.isStr(component.ref) ? component.ref.trim() : null;
      if (ref) {
        newComponent.ref = ref;
      }

      var propInfo = this.__parseComProps(component.props, ["style", "class"]);
      if (propInfo.new) {
        newComponent.props = propInfo.new;
      }

      if (propInfo.raw) {
        newComponent.__rawProps = propInfo.raw;
      }

      if (propInfo.staticNames) {
        newComponent.__staticPropNames = propInfo.staticNames;
      }

      // 指令
      var directiveInfo = this.__parseDirectives(
        utils.isUndef(component.directives) ? component.v : component.directives
      );

      if (directiveInfo.new) {
        newComponent.directives = directiveInfo.new;
      }

      if (directiveInfo.raw) {
        newComponent.__rawDirectives = directiveInfo.raw;
      }

      if (utils.isStr(component.text) || utils.isFunc(component.text)) {
        newComponent.text = component.text;
        if (parse.isEsOrFunc(component.text)) {
          newComponent.__rawText = parse.newEsFuncion(component.text);
        }
      }

      if (parse.isEsOrFunc(component.class)) {
        newComponent.class = null;
        newComponent.__rawClass = parse.newEsFuncion(component.class);
      } else {
        newComponent.class = utils.deepCopy(component.class);
      }

      if (parse.isEsOrFunc(component.style)) {
        newComponent.style = null;
        newComponent.__rawStyle = parse.newEsFuncion(component.style);
      } else {
        if (
          utils.isObj(component.style) &&
          Object.keys(component.style).length
        ) {
          newComponent.style = utils.deepCopy(component.style);
        }
      }

      newComponent.align = this.__parseAlign(component.align, defaultAlign);
      newComponent.flex = this.__parseFlex(component.flex, component.size);

      // value
      if (propItem.hasOwnProperty("value")) {
        newComponent.value = propItem.value;
      } else if (component.hasOwnProperty("value")) {
        newComponent.value = component.value;
      } else {
        // 自动补充value: 因为是表单组件
        newComponent.value =
          component.name === global.defaultCom ? global.defaultVal : undefined;
      }
    } else if (utils.isStr(component)) {
      // 要自动补充value
      newComponent = {
        name: component,
        actions: [],
        align: defaultAlign,
        flex: false,
        value: propItem.hasOwnProperty("value")
          ? propItem.value
          : global.defaultCom === component
          ? global.defaultVal
          : undefined
      };
    } else {
      // 要自动补充value
      newComponent = {
        name: global.defaultCom,
        actions: [],
        align: defaultAlign,
        flex: false,
        value: global.defaultVal
      };
    }

    // 判断名称是否合法
    if (
      utils.isStr(newComponent.name) &&
      !utils.validateComponentName(newComponent.name)
    ) {
      throw "组件名(" + newComponent.name + ")存在html非法字符";
    }

    newComponent.props = newComponent.props ? newComponent.props : {};

    return newComponent;
  },

  /**
   * 解析组件属性
   */
  __parseComProps(props, excludeKeys) {
    var newProps = {},
      rawProps = {};
    var staticNames = [];

    if (!utils.isObj(props)) {
      props = {};
    }

    var hasEsFunc = false;

    // var PREFIXS = constant.PREFIX_STATIC_FUNC;

    var realKey, newRealKey;
    var staticKey, isStatic;
    var value, newValue;
    for (var key in props) {
      realKey = key; // 会保留空格的
      staticKey = parse.getStaticKey(realKey); // 取静态key,不是返回false
      // console.log(staticKey);
      isStatic = staticKey !== false ? true : false;
      if (isStatic) {
        realKey = staticKey;
      }

      if (!realKey.trim()) {
        // 全空，不必理会
        break;
      }

      newRealKey = utils.vueCamelCase(realKey);
      if (excludeKeys.includes(newRealKey)) {
        // 存在不能包括的属性，不必理会
        break;
      }

      value = props[key];
      if (!isStatic && parse.isEsOrFunc(props[key])) {
        // 不是静态且需要转化
        hasEsFunc = true;
        newValue = parse.newEsFuncion(value);
        newProps[newRealKey] = newValue;
        rawProps[newRealKey] = newValue;
      } else if (!isStatic || !utils.isFunc(value)) {
        // 不是静态或是（静态，其值不是函数），保持原样
        newProps[newRealKey] = value;
        rawProps[newRealKey] = value;
      } else {
        // 是静态属性、值是函数
        newProps[newRealKey] = value;
        rawProps[newRealKey] = value; // 保持前缀，因为解析需要用到；为什么要这样
        staticNames.push(newRealKey); // 记录下来
      }
    }

    if (hasEsFunc) {
      for (var tmpkey in newProps) {
        newProps[tmpkey] = null;
      }
    } else {
      rawProps = {};
    }

    rawProps = Object.keys(rawProps).length > 0 ? rawProps : false;
    return {
      new: newProps,
      raw: rawProps,
      staticNames: staticNames.length ? staticNames : false
    };
  },

  /**
   * 进出的值的格式转换
   * @param {*} format
   */
  __parseFormat(format) {
    var newFormat;
    if (utils.isArr(format)) {
      // 是枚举
      newFormat = [];
      format.forEach(item => {
        if (!utils.isUndef(item.outer) && !utils.isUndef(item.inner)) {
          newFormat.push(item);
        } else {
          console.warn("format属性：outer和inner必须成对定义");
        }
      });
      return newFormat.length > 0 ? newFormat : false;
    } else if (utils.isObj(format)) {
      newFormat = {};
      if (utils.isFunc(format.outer)) {
        newFormat.outer = format.outer;
      } else {
        newFormat.outer = false;
      }
      if (utils.isFunc(format.inner)) {
        newFormat.inner = format.inner;
      } else {
        newFormat.inner = false;
      }
      return newFormat.outer || newFormat.inner ? newFormat : false;
    } else {
      // 格式不合法
      return false;
    }
  },

  /**
   * 解析/标准化项组件的事件
   * @param {*} actions
   * @param {*} myPathKey
   */
  __parseActions(actions, myPathKey) {
    // 解析是否为特殊写法
    var newActions = [];
    if (
      (utils.isObj(actions) && Object.keys(actions).length > 0) ||
      (utils.isArr(actions) && actions.length > 0) ||
      utils.isFunc(actions) ||
      utils.isStr(actions)
    ) {
      var tmpActions;
      if (utils.isFunc(actions)) {
        tmpActions = [{ trigger: constant.CLICK_EVENT, handler: actions }];
      } else if (utils.isObj(actions)) {
        tmpActions = [actions];
      } else if (utils.isStr(actions)) {
        tmpActions = [actions];
      } else {
        // 就是数组了
        tmpActions = actions;
      }
      tmpActions.forEach(tmpAction => {
        var newTrigger, newAction;
        if (utils.isStr(tmpAction)) {
          tmpAction = tmpAction.trim();
          if (tmpAction == constant.ENTER_SUBMIT) {
            // keyup.native提交事件
            newActions.push({
              trigger: [constant.KEYUP_NATIVE],
              handler: enterSubmit
            });
          } else {
            var actionInfos = tmpAction.split(/\s*=\s*/);
            if (
              actionInfos &&
              actionInfos.length == 2 &&
              actionInfos[1] == constant.ONLY_SUBMIT
            ) {
              // newActions.push({trigger: actionInfos[0], handler: onlySubmit});
              newAction = {};
              newTrigger = this.__parseTrigger(actionInfos[0]);
              newAction.trigger =
                newTrigger && newTrigger.length > 0
                  ? newTrigger
                  : [constant.CLICK_EVENT];
              newAction.handler = onlySubmit;
              newActions.push(newAction);
            } else {
              console.warn(
                "key(" + myPathKey + ")存在不合法的事件，将过滤去掉，不会执行."
              );
            }
          }
        } else if (utils.isFunc(tmpAction.handler)) {
          newAction = {};
          newTrigger = this.__parseTrigger(tmpAction.trigger);
          newAction.trigger =
            newTrigger && newTrigger.length > 0
              ? newTrigger
              : [constant.CLICK_EVENT];
          newAction.handler = tmpAction.handler;
          newActions.push(newAction);
        } else {
          // 非法写，不是函数，去掉它
          console.warn(
            "key(" + myPathKey + ")存在不合法的事件，将过滤去掉，不会执行"
          );
        }
      });
    } else {
      // console.warn("key(" + myPathKey + ")component事件类型不合法.");
    }

    return newActions.length > 0 ? newActions : null;
  },

  /**
   * 解析项Label
   */
  __parseLabel: function(value, myPathKey) {
    var newValue,
      defaultAlign = false;
    newValue = this.__parsePropComponent(value, myPathKey, true);

    // 因为label有点特殊，所以不能为false
    if (newValue) {
      newValue.flex = this.__parseFlex(value.flex, value.size);
      newValue.align = this.__parseAlign(value.align, defaultAlign);
    } else {
      newValue = {
        text: false,
        __rawText: false,
        flex: false,
        align: defaultAlign
      };
    }

    return newValue;
  },

  /**
   * 解析项label和项组件的在弹性布局中的占位情况
   */
  __parseFlex(flex, size) {
    var flexs = ["self", "full"];
    if (flexs.includes(flex)) {
      return flex;
    }

    // 兼容一下之前的东西
    var sizes = ["fixed", "auto"];
    var sizeIndex = sizes.indexOf(size);
    if (sizeIndex >= 0) {
      console.warn(
        'label.size and component.size ["fixed", "auto"]已经舍弃了，请使用flex ["self", "full"]'
      );
      return flexs[sizeIndex];
    }

    return false;
  },

  /**
   * 解析项label和项组件的对齐方式
   */
  __parseAlign(align, defaultVal = "left") {
    var aligns = ["left", "center", "right"];
    if (aligns.includes(align)) {
      return align;
    }
    return defaultVal;
  },

  /**
   * 解析title
   */
  __parseTitle: function(value, myPathKey) {
    var newValue = this.__parsePropComponent(value, myPathKey);
    return newValue;
  },

  /**
   * 解析boxUi, 只支持properites
   */
  __parseBoxUi: function(ui) {
    var newUi, type;
    var types = ["bg", "block", "bg-block"];
    if (utils.isObj(ui) && Object.keys(ui).length > 0) {
      newUi = {};
      if (utils.isBool(ui.showBody)) {
        newUi.__hasToggle = true; // 有切换按钮
        newUi.showBody = ui.showBody;
      } else {
        newUi.__hasToggle = false; // 无切换按钮
        newUi.showBody = true;
      }
      type = utils.isStr(ui.type) ? ui.type.trim() : "";
      newUi.type = types.includes(type) ? type : "";
      newUi.hasBorder = utils.isBool(ui.hasBorder) ? ui.hasBorder : false;
      newUi.padding = this.__parsePadding(ui.padding);
    } else if (utils.isStr(ui)) {
      type = ui ? ui : "";
      type = utils.isStr(type) ? type.trim() : "";

      if (types.includes(type)) {
        newUi = {
          // __hasToggle: false,
          showBody: true,
          type: type
          // hasBorder: false,
          // padding: false
        };
      } else {
        newUi = {
          // __hasToggle: false,
          showBody: true,
          type: ""
          // hasBorder: false,
          // padding: false
        };
      }
    } else {
      newUi = {
        // __hasToggle: false,
        showBody: true,
        type: ""
        // hasBorder: false,
        // padding: false
      };
    }

    return newUi;
  },

  /**
   * 块（properties）中提取可继承的属性，为下一组做准备
   * @param {*} propItem
   * @param {*} inheritObj 从上一级继承的数据
   */
  __parseInherit(propItem, inheritObj) {
    var ui = utils.isObj(propItem.ui) ? propItem.ui : {};

    var keys = [
      "offsetLeft",
      "offsetRight",
      "direction",
      "colon",
      ["rowSpace", "boxRowSpace"],
      ["labelWidth", "boxLabelWidth"],
      ["rowHeight", "boxRowHeight"]
    ];

    var tmpUi = {};

    var newInherit = {};

    keys.forEach(key => {
      var newKey, oldKey;
      if (utils.isStr(key)) {
        newKey = key;
        oldKey = false;
      } else {
        newKey = key[0];
        oldKey = key[1];
      }
      var normalKeyInfo = this.__getNormalInfo(newKey);
      if (normalKeyInfo) {
        var curValue = ui[newKey];
        tmpUi[newKey] = curValue;
        if (utils.isUndef(curValue) && oldKey) {
          if (!utils.isUndef(propItem[oldKey])) {
            tmpUi[newKey] = propItem[oldKey];
            console.warn("属性" + oldKey + "已舍弃，请使用ui." + newKey);
          }
        }
        // console.log("-- tmpUi: ", tmpUi);
        newInherit[newKey] = this.__parseNormalKey(
          tmpUi,
          normalKeyInfo,
          inheritObj
        );
      } else {
        throw "BoxUi: 程序的key(" + key + ")不对应，请修改";
      }
    });

    return newInherit;
  },

  /**
   * 解析样式值：类似于padding margin(现仅支持px, 可以不写单位): 如20 或 “20px 20 30px”
   * @param {*} value
   * @param {*} canNegative 是否可以是负数；因为大多数时我们都不需要负数，所以默认为false
   * @returns false 或 一个长度为4的类组
   */
  __parsePadding(value, canNegative) {
    var resultVals,
      tmpVals,
      max = 4;
    if (utils.isNum(value)) {
      if (canNegative || value >= 0) {
        resultVals = [value, value, value, value];
      } else {
        resultVals = [0, 0, 0, 0];
      }

      return resultVals.join("px ") + "px";
    } else if (utils.isStr(value)) {
      value = value.trim();
      if (value) {
        tmpVals = value.split(/\s+/);
        if (tmpVals.length <= max) {
          // 暂时合法，下面统一判断
        } else {
          tmpVals = false;
        }
      } else {
        tmpVals = false;
      }
    } else if (utils.isArr(value) && value.length <= max) {
      // 暂时合法，下面统一判断
      tmpVals = value;
    } else {
      return false;
    }

    // string or array
    if (tmpVals) {
      // 看数组的内容是否正确
      resultVals = [];
      var reg1 = /^(-?\d+(\.\d+)?)(px)?$/; // 点号有数字
      var reg2 = /^(-?\.\d+)(px)?$/; // 点号无数字

      var numVal;

      for (var i = 0; i < tmpVals.length; i++) {
        var tmpVal = tmpVals[i];
        if (utils.isNum(tmpVal)) {
          numVal = tmpVal;
          if (canNegative || numVal >= 0) {
            resultVals.push(numVal);
          } else {
            resultVals.push(0);
          }
        } else {
          var match = tmpVal.match(reg1) || tmpVal.match(reg2);
          if (match) {
            numVal = Number(match[1]);
            if (canNegative || numVal >= 0) {
              resultVals.push(numVal);
            } else {
              resultVals.push(0);
            }
          } else {
            break; // 不合法，退出循环
          }
        }
      }
      if (resultVals.length === tmpVals.length) {
        // 解析是正确的，看个数
        if (resultVals.length === 1) {
          resultVals.push(resultVals[0], resultVals[0], resultVals[0]);
        } else if (resultVals.length === 2) {
          resultVals.push(resultVals[0], resultVals[1]);
        } else if (resultVals.length === 3) {
          resultVals.push(resultVals[1]);
        } else {
          // 长度为4个
        }
      } else {
        resultVals = false;
      }
    } else {
      resultVals = false;
    }

    return resultVals ? resultVals.join("px ") + "px" : false;
  },

  /**
   * 解析帮助
   */
  __parsePropHelp: function(help, myPathKey) {
    // console.log("help: ", help);
    var gHelp = false;
    if (utils.isObj(help) && Object.keys(help).length > 0) {
      gHelp = {};
      Object.assign(gHelp, help);
      if (!gHelp.name) {
        gHelp.name = esHelp;
      }
      gHelp = this.__parsePropComponent(gHelp, myPathKey);
    } else if (utils.isStr(help)) {
      gHelp = { name: esHelp, props: { content: help } };
      gHelp = this.__parsePropComponent(gHelp, myPathKey);
    } else {
      gHelp = false;
    }
    // console.log("gHelp: ", gHelp);
    return gHelp;
  },

  /**
   * 解析一般组件
   */
  __parsePropComponent: function(value, myPathKey, canEmpty = false) {
    var newCom;
    if (utils.isObj(value) && Object.keys(value).length > 0) {
      newCom = {};
      var name =
        utils.isStr(value.name) && value.name.trim()
          ? value.name.trim()
          : value.name;
      if (name) {
        newCom.name = name;
        newCom.actions = this.__parseActions(value.actions, myPathKey);

        // 属性
        var propInfo = this.__parseComProps(value.props, [
          "value",
          "style",
          "class"
        ]);
        // console.log(propInfo);
        if (propInfo.new) {
          newCom.props = propInfo.new;
        }

        if (propInfo.raw) {
          newCom.__rawProps = propInfo.raw;
        }

        if (propInfo.staticNames) {
          newCom.__staticPropNames = propInfo.staticNames;
        }

        // 指令
        var directiveInfo = this.__parseDirectives(
          utils.isUndef(value.directives) ? value.v : value.directives
        );

        if (directiveInfo.new) {
          newCom.directives = directiveInfo.new;
        }

        if (directiveInfo.raw) {
          newCom.__rawDirectives = directiveInfo.raw;
        }

        // 只有在name有值时有效
        if (parse.isEsOrFunc(value.class)) {
          newCom.class = null;
          newCom.__rawClass = parse.newEsFuncion(value.class);
        } else {
          newCom.class = utils.deepCopy(value.class);
        }

        if (parse.isEsOrFunc(value.style)) {
          newCom.style = null;
          newCom.__rawStyle = parse.newEsFuncion(value.style);
        } else {
          if (utils.isObj(value.style) && Object.keys(value.style).length) {
            newCom.style = utils.deepCopy(value.style);
          }
        }

        // value
        if (value.hasOwnProperty("value")) {
          newCom.value = value.value;
        } else {
          // 无value, 证明不用双向绑定：这个不同于项组件的value, 人家会自动补充，这里没有
        }
      }

      var text;
      if (utils.isStr(value.text)) {
        text = value.text.trim();
        text = text || canEmpty ? text : false;
        // newCom.text = text;
      } else if (utils.isFunc(value.text)) {
        text = value.text;
      } else {
        if (!name) {
          // 不符合要求，说明为空
          // 说明为空
          return false;
        }
        text = false;
      }
      newCom.text = text;

      newCom.__rawText = parse.newEsFuncion(text);

      // return newCom;
    } else if (utils.isStr(value)) {
      value = value.trim();
      if (value || canEmpty) {
        newCom = { text: value, __rawText: parse.newEsFuncion(value) };
      } else {
        return false;
      }
      // return newCom;
    } else if (utils.isFunc(value)) {
      newCom = { text: value, __rawText: value };
    } else {
      return false;
    }

    // 判断名称是否合法
    if (
      newCom &&
      utils.isStr(newCom.name) &&
      !utils.validateComponentName(newCom.name)
    ) {
      throw "组件名(" + newCom.name + ")存在html非法字符";
    }

    newCom.props = newCom.props ? newCom.props : {};

    var eventOn = this.__fetchActionEvent(newCom.actions);
    newCom.__emitEvents = eventOn.__emitEvents;
    newCom.__nativeEvents = eventOn.__nativeEvents;

    return newCom;
  },

  /**
   * 解析规则
   */
  __parsePropRules: function(rules) {
    var newRules;
    if (utils.isObj(rules)) {
      if (rules.check) {
        console.warn("rules.check已经舍弃了，请使用rules.checks");
      }

      newRules = {};

      var rawCheckList;
      if (rules.checks) {
        rawCheckList = rules.checks;
      } else if (rules.check) {
        console.warn("rules.check已经舍弃了，请使用rules.checks");
        rawCheckList = rules.check;
      }
      var tmpCheckList = [];
      if (!rawCheckList) {
        rawCheckList = [];
      } else if (!utils.isArr(rawCheckList)) {
        rawCheckList = [rawCheckList];
      }
      rawCheckList.forEach(item => {
        var newItem = this.__perfectCheckItem(item);
        if (newItem) {
          // 正确
          tmpCheckList.push(newItem);
        }
      });
      if (tmpCheckList.length > 0) {
        newRules.checks = tmpCheckList;
      }
      if (parse.isEsOrFunc(rules.required)) {
        newRules.required = false; // 让以后解析
        newRules.__rawRequired = parse.newEsFuncion(rules.required);
      } else if (utils.isBool(rules.required)) {
        newRules.required = rules.required;
        newRules.__rawRequired = rules.required;
      } else {
        newRules.required = false;
        newRules.__rawRequired = false;
      }
    } else if (utils.isBool(rules)) {
      newRules = {
        required: rules,
        __rawRequired: rules
      };
    } else if (parse.isEsOrFunc(rules)) {
      newRules = {
        required: false,
        __rawRequired: parse.newEsFuncion(rules)
      };
    } else {
      return false;
    }

    if (
      newRules.__rawRequired ||
      (newRules.checks && newRules.checks.length > 0)
    ) {
      var emptyMsg, errMsg;

      if (newRules.__rawRequired) {
        // 有为空检查
        if (utils.isStr(rules.emptyMsg)) {
          emptyMsg = rules.emptyMsg.trim();
        }
        newRules.emptyMsg = emptyMsg ? emptyMsg : "不能为空";
      }

      if (newRules.checks && newRules.checks.length > 0) {
        // 有非空检查
        if (utils.isStr(rules.errMsg)) {
          errMsg = rules.errMsg.trim();
        }
        newRules.errMsg = errMsg ? errMsg : "格式不对";
      }

      return newRules;
    } else {
      return false;
    }
  },

  /**
   * 解析指令
   */
  __parseDirectives: function(directives) {
    var newDirectives = [],
      rawDirectives = [];
    if (!utils.isArr(directives)) {
      directives = [directives];
    }

    var hasEsFunc = false;

    // 转化为数组了
    directives.forEach(directiveItem => {
      var directive;
      if (utils.isStr(directiveItem)) {
        directive = { name: directiveItem };
      } else if (!utils.isObj(directiveItem)) {
        // 不合法，去掉
        return false;
      } else {
        directive = directiveItem;
      }

      // 全部转成对象了
      var name, value, expression, arg, modifiers;
      name = directive.name;
      var prefix = "v-";
      if (utils.isStr(name)) {
        name = name.trim();
        if (name.indexOf(prefix) === 0) {
          name = name.substr(prefix.length);
        }
      } else {
        name = false;
      }

      // 指令名合法
      if (name) {
        expression = utils.isStr(directive.expression)
          ? directive.expression.trim()
          : undefined;
        expression = expression ? expression : undefined;

        arg = utils.isStr(directive.arg) ? directive.arg.trim() : undefined;
        arg = arg ? arg : undefined;

        modifiers = utils.isObj(directive.modifiers)
          ? utils.deepCopy(directive.modifiers)
          : {};

        if (parse.isEsOrFunc(directive.value)) {
          hasEsFunc = true;
          value = parse.newEsFuncion(directive.value);
        } else {
          value = utils.deepCopy(directive.value);
        }

        var rawDirective = {
          name: name,
          value: value,
          expression: expression,
          arg: arg,
          modifiers: modifiers
        };
        rawDirectives.push(rawDirective);
      }
    });

    if (hasEsFunc) {
      rawDirectives.forEach(rawDirective => {
        var newDirective = {};
        Object.assign(newDirective, rawDirective);
        newDirective.value = null;
        newDirectives.push(newDirective);
      });
    } else {
      newDirectives = rawDirectives;
      rawDirectives = false;
    }

    newDirectives = newDirectives.length > 0 ? newDirectives : false;
    return { new: newDirectives, raw: rawDirectives };
  },

  /**
   * array是否为数组
   * @param {*} array
   */
  __isArray(array) {
    if (array) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * 是否为块(properties)
   * @param {*} rawItem
   */
  __isPropItem(rawItem) {
    return !this.__isSpaceItem(rawItem) && utils.isObj(rawItem.properties);
  },

  /**
   * 块(properties)里面是否存在非空项
   * @param {*} rawPropItem
   */
  __existEntityItem(rawPropItem) {
    if (this.__isPropItem(rawPropItem)) {
      for (var key in rawPropItem.properties) {
        var nextRawProp = rawPropItem.properties[key];
        if (this.__isIngnoreItem(nextRawProp)) {
          continue;
        }

        if (!this.__isSpaceItem(nextRawProp)) {
          return true; // 有一个即可以了
        }
      }
    }
    return false;
  },

  /**
   * 项设置为null 或 undefined则忽略（在新增或编辑时特别有用）
   * @param {*} rawPropItem
   */
  __isIngnoreItem(rawPropItem) {
    if (
      utils.isNull(rawPropItem) ||
      utils.isUndef(rawPropItem) ||
      rawPropItem === false
    ) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * 是否为space item
   * @param {*} subitem
   */
  __isSpaceItem(rawItem) {
    if (
      utils.isObj(rawItem) &&
      (rawItem.layout === constant.LAYOUT_SPACE ||
        (rawItem.layout && rawItem.layout.name === constant.LAYOUT_SPACE))
    ) {
      return true;
    }
    return false;
  },

  /**
   * 是否为tabs item
   * @param {*} subitem
   */
  __isTabsItem(rawItem) {
    if (
      rawItem.layout === constant.LAYOUT_TABS ||
      (rawItem.layout && rawItem.layout.name === constant.LAYOUT_TABS)
    ) {
      return true;
    }
    return false;
  },

  /**
   * 布局设置标准化
   */
  __parsePropLayout: function(layout) {
    var newLayout = { name: false };
    var layoutTypes = [constant.LAYOUT_SPACE, constant.LAYOUT_TABS];
    if (utils.isStr(layout)) {
      if (layoutTypes.includes(layout)) {
        newLayout.name = layout;
        layout = {};
      }
    } else if (utils.isObj(layout)) {
      if (layoutTypes.includes(layout.name)) {
        newLayout.name = layout.name;
      }
    } else {
      // nothing
    }

    if (newLayout.name === false) {
      // 没有布局
      return false;
    } else if (newLayout.name === constant.LAYOUT_TABS) {
      // 是子节点布局是tabs时所需要的一些参数
      // var types = ["bg", "card", "line"];
      newLayout.type = layout.type;
      newLayout.hasBorder = utils.isBool(layout.hasBorder)
        ? layout.hasBorder
        : true;
      newLayout.padding = this.__parsePadding(layout.padding);
    }

    return newLayout;
  },

  /**
   * 数组设置标准化
   */
  __parsePropArray: function(array, rawItem, myPathKey) {
    if (this.__isArray(array)) {
      var newArray = {};
      var hasSort = false; //是否有排序按钮，默认为false
      var hasDelete = true; //是否有删除按钮，默认为true
      var hasAdd = true; //是否有添加按钮(下边的添加按钮)，默认为true
      var hasCopy = false; // //是否有拷贝添加按钮，默认为false
      var max = 0; //不写或小于等于0代表不限制
      var min = 0; //不写或小于等于0代表0
      var fixed = 0; //不写或小于等于0代表0
      var hasOrder = true; //是否有序号，默认为true
      var headRequired = false; //此值当name为constant.ARRAY_TABLE有效，当设置为true时，“星号”在table头部显示，而不是在内容区随组件显示，默认为true;注意：当为true时，required的值不能受properties里面的属性影响
      var hasDelWarn = true; // 删除是否有警告
      var subLabel = false;
      var rules = false;
      var actions = false;
      var value = [];
      var rowSpace = undefined;
      var type = null;
      var hasBorder = true;
      var insertValue = undefined;
      if (utils.isStr(array)) {
        newArray.name = array;
      } else if (!utils.isObj(array)) {
        newArray.name = constant.ARRAY_ROW;
      } else {
        newArray.name = utils.isStr(array.name)
          ? array.name
          : constant.ARRAY_ROW;
        hasSort = array.hasSort ? true : false;
        hasDelete =
          utils.isUndef(array.hasDelete) || array.hasDelete ? true : false;
        hasAdd = utils.isUndef(array.hasAdd) || array.hasAdd ? true : false;
        hasCopy = array.hasCopy ? true : false;
        min = utils.isNum(array.min) && array.min > 0 ? array.min : 0;
        max = utils.isNum(array.max) && array.max > 0 ? array.max : 0;
        fixed = utils.isNum(array.fixed) && array.fixed > 0 ? array.fixed : 0;
        hasOrder =
          utils.isUndef(array.hasOrder) || array.hasOrder ? true : false;
        headRequired =
          array.name == constant.ARRAY_TABLE && array.headRequired
            ? true
            : false;
        // subLabel = utils.isStr(array.subLabel) ? array.subLabel : false;

        subLabel = this.__parsePropComponent(array.subLabel, myPathKey);
        if (!subLabel) {
          subLabel = {
            text: false,
            __rawText: false
            // size: false,
            // align: defaultAlign
          };
        }

        hasDelWarn =
          utils.isUndef(array.hasDelWarn) || array.hasDelWarn ? true : false;

        value = utils.isArr(array.value) ? array.value : [];
        rules = this.__parsePropRules(array.rules);
        actions = this.__parseActions(array.actions, myPathKey);
        rowSpace = utils.isNum(array.rowSpace) ? array.rowSpace : undefined;
        type = utils.isStr(array.type) ? array.type : false;
        hasBorder = utils.isBool(array.hasBorder) ? array.hasBorder : true;
        insertValue = utils.isUndef(array.insertValue)
          ? undefined
          : array.insertValue;
      }

      if (
        !this.__isPropItem(rawItem) &&
        newArray.name == constant.ARRAY_TABLE
      ) {
        newArray.name = constant.ARRAY_ROW;
        console.warn(
          myPathKey +
            "叶子节点(组件)不支持为" +
            constant.ARRAY_TABLE +
            "数组, " +
            constant.ARRAY_TABLE +
            "将失效, 强制转化为" +
            constant.ARRAY_ROW
        );
      } else if (
        this.__isPropItem(rawItem) &&
        newArray.name == constant.ARRAY_CARD
      ) {
        newArray.name = constant.ARRAY_ROW;
        console.warn(
          myPathKey +
            "为非叶子节点(非组件)，不支持为" +
            constant.ARRAY_CARD +
            "数组, " +
            constant.ARRAY_CARD +
            "将失效, 强制转化为" +
            constant.ARRAY_ROW
        );
      }

      if (
        newArray.name == constant.ARRAY_ROW ||
        newArray.name == constant.ARRAY_TABLE ||
        newArray.name == constant.ARRAY_TABS ||
        newArray.name == constant.ARRAY_CARD ||
        newArray.name == constant.ARRAY_LEGEND
      ) {
        newArray.hasSort = hasSort;
        newArray.hasDelete = hasDelete;
        newArray.hasDelWarn = hasDelWarn;
        newArray.hasAdd = hasAdd;
        newArray.hasCopy = hasCopy;
        newArray.min = min;
        newArray.max = max >= min ? max : 0;
        newArray.fixed = fixed;
        newArray.hasOrder = hasOrder;
        newArray.headRequired = headRequired;
        newArray.value = value;
        newArray.rules = rules;
        newArray.actions = actions;
        newArray.rowSpace = rowSpace;

        if (newArray.name == constant.ARRAY_TABS) {
          newArray.subLabel = subLabel;
          newArray.type = type;
          newArray.hasBorder = hasBorder;
        } else if (newArray.name == constant.ARRAY_LEGEND) {
          newArray.subLabel = subLabel;
        }

        if (!utils.isUndef(insertValue)) {
          newArray.insertValue = insertValue;
        }

        if (newArray.min > 0) {
          var minMsg = utils.isStr(array.minMsg) ? array.minMsg.trim() : "";
          if (!minMsg) {
            minMsg = "长度不能小于" + newArray.min;
          }
          newArray.minMsg = minMsg;
        }

        if (newArray.max > 0) {
          var maxMsg = utils.isStr(array.maxMsg) ? array.maxMsg.trim() : "";
          if (!maxMsg) {
            maxMsg = "长度不能大于" + newArray.max;
          }
          newArray.maxMsg = maxMsg;
        }
      } else {
        throw "this.__parsePropArray: array.name不合法";
      }

      return newArray;
    } else {
      return false;
    }
  },

  /**
   * 验证函数标准化
   */
  __perfectCheckItem: function(item) {
    if (utils.isFunc(item)) {
      return { handler: item, trigger: [constant.INPUT_EVENT] };
    } else if (parse.isEsScript(item)) {
      return {
        handler: parse.newEsFuncion(item),
        trigger: [constant.INPUT_EVENT]
      };
    } else if (
      utils.isObj(item) &&
      (parse.isEsOrFunc(item.handler) || parse.isEsOrFunc(item.name))
    ) {
      var handler;
      if (utils.isFunc(item.handler)) {
        handler = item.handler;
      } else if (utils.isFunc(item.name)) {
        console.warn("rules.checks.name已经舍弃了，请使用rules.checks.handler");
        handler = item.name;
      } else if (parse.isEsScript(item.handler)) {
        throw "rules.check.handler已经舍弃了且规则不再支持es写法，请使用函数赋值rules.checks.handler";
      } else {
        throw "rules.check.name已经舍弃了且规则不再支持es写法，请使用函数赋值rules.checks.handler";
      }

      var newTrigger = this.__parseTrigger(item.trigger);
      newTrigger =
        newTrigger && newTrigger.length
          ? utils.unique(newTrigger)
          : [constant.INPUT_EVENT];

      var newItem = {
        handler: handler,
        trigger: newTrigger
      };

      return newItem;
    } else {
      console.warn(
        "rules.checks设置不正确: 正确的格式如：[{trigger, handler}], 错误的item为",
        item
      );
      return false;
    }
  },

  /**
   * 标准化属性配置
   * @param {*} propItem
   * @param {*} propKeys
   * @param {*} inheritObj
   * @param {*} myPathKey
   */
  __filterKeys: function(propItem, propKeys, inheritObj, myPathKey) {
    var newPropItem = {};
    propKeys.forEach(key => {
      if (key == "label") {
        newPropItem[key] = this.__parseLabel(propItem[key], myPathKey);
        return true;
      }

      // if (key == "value") {
      //   // 这个比较特殊: 有值就记录下来
      //   if (propItem.hasOwnProperty("value")) {
      //     newPropItem.value = propItem.value;
      //   } else if (
      //     utils.isObj(propItem.component) &&
      //     propItem.component.hasOwnProperty("value")
      //   ) {
      //     newPropItem.value = propItem.component.value;
      //   } else {
      //     // 没有值，无需记录，留给后面判断：因为有默认值的问题
      //   }
      //   return true;
      // }

      if (key == "title") {
        newPropItem[key] = this.__parseTitle(propItem[key], myPathKey);
        return true;
      }

      if (key == "ui") {
        newPropItem[key] = this.__parseBoxUi(propItem.ui);
        return true;
      }

      if (key == "nextInherit") {
        newPropItem[key] = this.__parseInherit(propItem, inheritObj);
        return true;
      }

      if (key == "format") {
        newPropItem[key] = this.__parseFormat(propItem[key]);
        return true;
      }

      if (key == "rules") {
        newPropItem[key] = this.__parsePropRules(propItem[key]);
        newPropItem.__invalidMsg = false;
        return true;
      }
      if (key == "help") {
        newPropItem[key] = this.__parsePropHelp(propItem[key], myPathKey);
        return true;
      }
      if (key == "desc") {
        newPropItem[key] = this.__parsePropComponent(propItem[key], myPathKey);
        return true;
      }

      if (key == "unit") {
        newPropItem[key] = this.__parsePropComponent(propItem[key], myPathKey);
        return true;
      }

      if (key == "array") {
        var arrayAttr = this.__parsePropArray(
          propItem[key],
          propItem,
          myPathKey
        );
        newPropItem[key] = arrayAttr;
        if (arrayAttr) {
          newPropItem.__invalidMsg = false;
        }
        return true;
      }

      if (key == "layout") {
        newPropItem[key] = this.__parsePropLayout(propItem[key]);
        return true;
      }

      if (key == "component") {
        var mainComponent = this.__parseMainComponent(propItem, myPathKey);
        newPropItem[key] = mainComponent;
        return true;
      }

      var normalKeyInfo = this.__getNormalInfo(key);
      if (normalKeyInfo) {
        newPropItem[key] = this.__parseNormalKey(
          propItem,
          normalKeyInfo,
          inheritObj
        );
      } else {
        throw "程序的key(" + key + ")不对应，请修改";
      }
    });
    if (!utils.isUndef(newPropItem.rowSpace)) {
      newPropItem.__rawRowSpace = newPropItem.rowSpace; // __rawRowSpace用于第一行计算或恢复，因为第一行可能会变为0
    }
    return newPropItem;
  },

  /**
   * 取出全局设置的属性：以便继承
   */
  __getGlobalInheritObj: function() {
    var keys = [
      "offsetLeft",
      "offsetRight",
      "direction",
      "colon",
      "rowSpace",
      "labelWidth",
      "rowHeight"
    ];
    var obj = {};
    keys.forEach(key => {
      obj[key] = global[key];
    });
    // console.log("obj: ", obj);
    return obj;
  },

  __reinitGroup: function(propItem) {
    var lastGroup = false;
    var groups;
    var colSum = 0;
    var gFirstItem; //每一组的第一项
    for (var key in propItem.properties) {
      var item = propItem.properties[key];
      var curGroup = item["group"];
      if (curGroup) {
        if (lastGroup) {
          //已经存在了
          if (lastGroup === curGroup) {
            //是前面的那一组
            groups.push(key);
            colSum += item.col;
            gFirstItem.__groupCol =
              colSum > constant.UI_MAX_COL ? constant.UI_MAX_COL : colSum;
          } else {
            //不是前面的那一组，重新开组
            lastGroup = curGroup;
            gFirstItem = item;
            groups = [key];
            item.__groups = groups;
            item.__hiddenGroup = false;
            // item.col = constant.UI_MAX_COL;
            colSum = item.col;
            gFirstItem.__groupCol =
              colSum > constant.UI_MAX_COL ? constant.UI_MAX_COL : colSum;
          }
        } else {
          //前面没有组，重新开组
          lastGroup = curGroup;
          gFirstItem = item;
          groups = [key];
          item.__groups = groups;
          item.__hiddenGroup = false;
          // item.col = constant.UI_MAX_COL;
          colSum = item.col;
          gFirstItem.__groupCol =
            colSum > constant.UI_MAX_COL ? constant.UI_MAX_COL : colSum;
        }
        item.__inGroups = true; //记录此项在分组里面
      } else {
        lastGroup = false;
        groups = null;
        colSum = 0;
        gFirstItem = null;
      }
    }
  },

  /**
   * 检查数据平铺时schema是否合法。也就是第一层的properies展开的key和第一层的key是否有重复印
   * @param {*} schema // 已经整理过的schema
   */
  __checkForTile(schema) {
    if (schema.autoMatch) {
      var keyTotals = {};
      var firstPropSchema = schema.properties;
      for (var key in firstPropSchema) {
        // 第一层的key
        if (keyTotals[key]) {
          keyTotals[key] = keyTotals[key] + 1;
        } else {
          keyTotals[key] = 1;
        }

        var nextSchema = firstPropSchema[key];
        if (nextSchema.properties && !nextSchema.array) {
          var nextPropItem = nextSchema.properties;
          for (var nextKey in nextPropItem) {
            // 第二层的key
            if (keyTotals[nextKey]) {
              keyTotals[nextKey] = keyTotals[nextKey] + 1;
            } else {
              keyTotals[nextKey] = 1;
            }
          }
        }
      }

      var errKeys = [];
      for (var schemaKey in keyTotals) {
        if (keyTotals[schemaKey] > 1) {
          errKeys.push(schemaKey + "(共" + keyTotals[schemaKey] + "次)");
        }
      }
      if (errKeys.length > 0) {
        throw "属性" + errKeys.join("、") + "出错重复，无法做到自动匹配";
        // return false;
      }
      return true;
    } else {
      return true;
    }
  }
};

export default schemaUtils;
