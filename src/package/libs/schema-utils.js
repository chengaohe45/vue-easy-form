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

// 解析组件的方法
import {
  parseMainComponent,
  parsePropComponent,
  parseClassStyle,
  parseActions,
  parseTrigger,
  fetchActionEvent,
  getNativeName,
  parseAlign,
  parseFlex
} from "./component-utils";

let m_currentFormId = undefined; // 应用于completeSchema,记录当前的解析是在哪个表单中

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
   * 解析计划表schema的入口：把原始的schema转化为标准的schema
   * 解析原则：
   * 对于一个对象{}来说
   * type === 'space'时，说明是占位空间，即使有component或properties, 也认为是占位空间，且解析时会把两个属性去掉
   * else if ：判断是否有properties且合法，即使有component也会去掉此属性
   * else: 是component，即使没有component也会用系统的默认值
   * 结论 >> 最后的输出是：
   * type === 'space'、component、properties只有一个会输出；也是就if (item.layout.name === 'space')、if (item.component)、if (item.properties)中，只有一个为真
   * @param {*} schema  原始的计划表
   * @param {*} esFormId 哪个esFormId（应用于有jsx或是函数的组件）
   */
  completeSchema: function(schema, esFormId) {
    // const constant.ARRAY_TABLE = "array-table";
    m_currentFormId = esFormId;

    var autoMatch;
    if (utils.isObj(schema)) {
      var tmpSchema = utils.deepCopy(schema);
      var rootObj = tmpSchema;
      var rootActions;
      if (!utils.isObj(tmpSchema.properties)) {
        rootObj = {};
        rootObj.title = false;
        rootObj.layout = false;
        rootObj.properties = tmpSchema;

        // 根节点有效的属性
        autoMatch = false;
        rootActions = null;
      } else {
        // 根节点有效的属性
        autoMatch = rootObj.autoMatch === true ? true : false;
        rootActions = parseActions(rootObj.actions, "根");
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
      rootObj.actions = rootActions;
      this.__checkForTile(rootObj);
      m_currentFormId = undefined; // 任务完成
      return rootObj;
    } else {
      m_currentFormId = undefined;
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
      newPropItem.__info = {
        pathKey: myPathKey,
        idxChain: "",
        index: -1
      };
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

      // 记录节点的修改，用于事件
      newPropItem.__info = {
        pathKey: myPathKey,
        idxChain: "",
        index: -1
      };
      if (isNormalTabs) {
        newPropItem.__tabsIndex = false;
      }

      //递归，取出下一级的数据
      var newProperties = {};
      var hasChildRef = false;
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
            if (!nextPropItem.label) {
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
          if (nextPropItem.__hasRef) {
            hasChildRef = true;
          }
        }
      }
      if (Object.keys(newProperties).length <= 0) {
        throw "properties不能为空，或其属性全部为空(null/undefined/false)";
      }
      newPropItem.properties = newProperties;
      if (hasChildRef) {
        newPropItem.__hasRef = hasChildRef;
      }

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
      // 判断newPropItem下一级组件是否存在自定义长度
      var nextNewproperties = newPropItem.properties;
      if (this.__existCustomWidth(nextNewproperties)) {
        newPropItem.__hasCustomWidth = true;
        for (var nextKey in nextNewproperties) {
          if ("rowSpace" in nextNewproperties[nextKey]) {
            nextNewproperties[nextKey].rowSpace = newPropItem.ui.rowSpace;
            nextNewproperties[nextKey].__rawRowSpace = newPropItem.ui.rowSpace;
          }
        }
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

      if (newPropItem.format) {
        newPropItem.component.value = formUtils.getFormatValue(
          newPropItem.format,
          newPropItem.component.value,
          true
        );
      }

      var eventOn = this.__fetchFormEvent(newPropItem);
      newPropItem.component.__emitEvents = eventOn.__emitEvents;
      newPropItem.component.__nativeEvents = eventOn.__nativeEvents;
      newPropItem.__info = {
        pathKey: myPathKey,
        idxChain: "",
        index: -1
      };

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
          newPropItem.__hasError = false; // 用来做复制
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
      // 判断是否合法
      var isValidCol = true;
      for (key in curProp) {
        nextPropItem = curProp[key];
        if (!utils.isNum(nextPropItem.col)) {
          isValidCol = false; // 存在不合法的长度
          console.warn(
            "table数组所有项的长度col只能设置为整数，不能是对象，否则每一项将均分长度；现项(key为" +
              key +
              ")设置长度为对象"
          );
          break;
        }
      }
      if (!isValidCol) {
        for (key in curProp) {
          nextPropItem = curProp[key];
          nextPropItem.col = constant.UI_MAX_COL; // 均分
        }
      }

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

      // 计算转化为头部style
      for (key in curProp) {
        nextPropItem = curProp[key];
        var headStyle = {
          width: this.__intToPercent(nextPropItem.col),
          padding: newSchema.ui.rowSpace / 2 + "px"
        };
        nextPropItem.__headStyle = headStyle;
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

  __existCustomWidth(newProperties) {
    for (var key in newProperties) {
      var nextPropItem = newProperties[key];
      if (utils.isObj(nextPropItem.col)) {
        return true;
      }
    }
    return false;
  },

  /**
   * 判断属性是否合法
   * @param {*} key
   */
  __isRightKey(key) {
    var illReg = /^[+-]?\d+$/;
    if (key.trim() === "") {
      throw "表单项的属性名不能为空值";
    } else if (illReg.test(key)) {
      throw "表单项的属性名不能是数字(如-1, 1, +1)";
    }
    var illChars = ["[", "]", ".", "{", "}", "(", ")"];
    for (var i = 0; i < illChars.length; i++) {
      if (key.indexOf(illChars[i]) >= 0) {
        throw "表单项的属性名不能出现以下的危险字符：" + illChars.join(" ");
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
            nativeName = getNativeName(triggerItem);
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
      nativeName = getNativeName(curTrimEvent);
      if (nativeName) {
        // .native监听
        nativeEvents.push(nativeName);
      } else {
        emitEvents.push(curTrimEvent);
      }
    }

    // 自定义事件
    if (propItem.component && propItem.component.actions) {
      var actionInfo = fetchActionEvent(propItem.component.actions);
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
      // {
      //   key: "col",
      //   enums: [],
      //   filters: [
      //     {
      //       name: "isInt",
      //       params: [1, constant.UI_MAX_COL]
      //     }
      //   ],
      //   defaultValue: constant.UI_MAX_COL
      // },
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

  __parseCol(value) {
    if (value && utils.isStr(value)) {
      value = {
        width: value
      };
    }
    if (utils.isNum(value)) {
      value = parseInt(value);
      if (value < 1 && value > constant.UI_MAX_COL) {
        value = constant.UI_MAX_COL;
      }
      return value;
    } else if (utils.isObj(value)) {
      var keys = Object.keys(value);
      var newInfo = {
        width: "100%"
      };
      keys.forEach(function(key) {
        var widthValue = value[key];
        if (
          widthValue === constant.WIDTH_AUTO ||
          utils.isPercent(widthValue) ||
          utils.isPx(widthValue)
        ) {
          widthValue = widthValue.toLowerCase();
          // 只支持三种长度（最小、最大、长度）
          var keyWidth = "width";
          var minWidth = "min-width";
          var maxWidth = "max-width";
          if (key === keyWidth) {
            newInfo[keyWidth] = widthValue;
          } else if (key === minWidth || key === "minWidth") {
            newInfo[minWidth] = widthValue;
          } else if (key === maxWidth || key === "maxWidth") {
            newInfo[maxWidth] = widthValue;
          }
        }
      });
      return newInfo;
    } else {
      return constant.UI_MAX_COL;
    }
  },

  /**
   * 解析项Label
   */
  __parseLabel: function(value, myPathKey) {
    var newLabel,
      defaultAlign = false;
    newLabel = parsePropComponent(value, m_currentFormId, myPathKey, true);

    // 因为label有点特殊，所以不能为false
    if (newLabel) {
      newLabel.flex = parseFlex(value.flex, value.size);
      newLabel.align = parseAlign(value.align, defaultAlign);
      newLabel.help = this.__parsePropHelp(value.help, myPathKey);
    } else {
      // newLabel = {
      //   text: false,
      //   __rawText: false,
      //   flex: false,
      //   align: defaultAlign
      // };
    }

    return newLabel;
  },

  /**
   * 解析title
   */
  __parseTitle: function(value, myPathKey) {
    var newValue = parsePropComponent(value, m_currentFormId, myPathKey);
    if (newValue) {
      newValue.help = this.__parsePropHelp(value.help, myPathKey);
    }
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
        // 只有__hasToggle为true时toggleTexts才有用
        newUi.toggleTexts = this.__parseMulTexts(ui.toggleTexts, [
          "打开",
          "隐藏"
        ]);
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
   * 过滤多个文本
   * @param {*} texts 数组
   * @param {*} defaultTexts 默认值。数组
   */
  __parseMulTexts(texts, defaultTexts) {
    if (utils.isArr(defaultTexts) && defaultTexts.length > 0) {
      var newTexts = [];
      if (utils.isArr(texts) && texts.length == defaultTexts.length) {
        texts.forEach(function(text) {
          text = utils.isStr(text) ? text.trim() : "";
          if (text) {
            newTexts.push(text);
          }
        });
      }

      // 值不合法，采用默认值
      if (newTexts.length < defaultTexts.length) {
        newTexts = defaultTexts; // 没有就取默认值
      }
      return newTexts;
    } else {
      throw new Error("__parseMulTexts参数不对：默认文本一定要是数组");
    }
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
      gHelp = parsePropComponent(gHelp, m_currentFormId, myPathKey);
    } else if (utils.isStr(help)) {
      gHelp = { name: esHelp, props: { content: help } };
      gHelp = parsePropComponent(gHelp, m_currentFormId, myPathKey);
    } else {
      gHelp = false;
    }
    // console.log("gHelp: ", gHelp);
    return gHelp;
  },

  /**
   * 解析规则
   */
  __parsePropRules: function(rules) {
    var tmpRawRequired = false,
      // tmpRawCanOnlyWarn = false,
      tmpCheckWarn = false,
      tmpCheckList = [];
    if (utils.isObj(rules)) {
      if (rules.check) {
        console.warn("rules.check已经舍弃了，请使用rules.checks");
      }

      var rawCheckList;
      if (rules.checks) {
        rawCheckList = rules.checks;
      } else if (rules.check) {
        console.warn("rules.check已经舍弃了，请使用rules.checks");
        rawCheckList = rules.check;
      }

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

      // 取出required
      if (parse.isEsOrFunc(rules.required)) {
        tmpRawRequired = parse.newEsFuncion(rules.required);
      } else if (utils.isBool(rules.required)) {
        tmpRawRequired = rules.required;
      } else {
        tmpRawRequired = false;
      }

      // 取出canOnlyWarn
      // if (parse.isEsOrFunc(rules.canOnlyWarn)) {
      //   tmpRawCanOnlyWarn = parse.newEsFuncion(rules.canOnlyWarn);
      // } else if (utils.isBool(rules.canOnlyWarn)) {
      //   tmpRawCanOnlyWarn = rules.canOnlyWarn;
      // } else {
      //   tmpRawCanOnlyWarn = false;
      // }
      if (utils.isBool(rules.checkWarn) || utils.isFunc(rules.checkWarn)) {
        tmpCheckWarn = rules.checkWarn;
      }
    } else if (utils.isBool(rules)) {
      tmpRawRequired = rules;
      rules = {};
    } else if (parse.isEsOrFunc(rules)) {
      tmpRawRequired = parse.newEsFuncion(rules);
      rules = {};
    } else {
      return false;
    }

    // 当不是必须的和没有检查，等价于rules为false
    if (tmpRawRequired || tmpCheckList.length > 0) {
      var newRules = {};

      var emptyMsg, errMsg;

      // 为true或为函数
      if (tmpRawRequired) {
        // 有为空检查
        if (utils.isStr(rules.emptyMsg)) {
          emptyMsg = rules.emptyMsg.trim();
        }
        newRules.emptyMsg = emptyMsg ? emptyMsg : "不能为空";
        if (utils.isFunc(rules.emptyMethod)) {
          newRules.emptyMethod = rules.emptyMethod;
        }

        newRules.showRequired = utils.isBool(rules.showRequired)
          ? rules.showRequired
          : true;
      }
      // 是动态，记录下来
      if (utils.isFunc(tmpRawRequired)) {
        newRules.required = false; // 会动态解析
        newRules.__rawRequired = tmpRawRequired;
      } else {
        newRules.required = tmpRawRequired;
      }

      // 是动态，记录下来
      // if (utils.isFunc(tmpRawCanOnlyWarn)) {
      //   newRules.canOnlyWarn = false; // 会动态解析
      //   newRules.__rawCanOnlyWarn = tmpRawCanOnlyWarn;
      // } else {
      //   newRules.canOnlyWarn = tmpRawCanOnlyWarn;
      // }
      newRules.checkWarn = tmpCheckWarn;

      if (tmpCheckList.length > 0) {
        newRules.checks = tmpCheckList;
        // 有非空检查
        if (utils.isStr(rules.errMsg)) {
          errMsg = rules.errMsg.trim();
        }
        newRules.errMsg = errMsg ? errMsg : "格式不对";
      }

      // 提取class和style
      Object.assign(newRules, parseClassStyle(rules));

      return newRules;
    } else {
      return false;
    }
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
      var delMsg;
      var delAllMsg;
      var delWarnBtns;
      var before = false;
      var btnType = false;

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

        subLabel = parsePropComponent(
          array.subLabel,
          m_currentFormId,
          myPathKey
        );
        if (!subLabel) {
          // 不可以为false, 因为必须要显示
          subLabel = {
            hidden: false,
            text: false
          };
        }

        hasDelWarn =
          utils.isUndef(array.hasDelWarn) || array.hasDelWarn ? true : false;

        if (array.hasOwnProperty("delMsg")) {
          delMsg = array.delMsg;
        } else {
          delMsg = "确定删除吗？";
        }
        delMsg = parsePropComponent(
          delMsg,
          m_currentFormId,
          myPathKey + "（数组）"
        );
        if (!delMsg) {
          delMsg = {
            hidden: false,
            text: false
          };
        }

        if (array.hasOwnProperty("delAllMsg")) {
          delAllMsg = array.delAllMsg;
        } else {
          delAllMsg = "确定删除所有吗？";
        }
        delAllMsg = parsePropComponent(
          delAllMsg,
          m_currentFormId,
          myPathKey + "（数组）"
        );
        if (!delAllMsg) {
          delAllMsg = {
            hidden: false,
            text: false
          };
        }

        delWarnBtns = this.__parseMulTexts(array.delWarnBtns, ["确定", "取消"]);

        before = utils.isFunc(array.before) ? array.before : false;
        value = utils.isArr(array.value) ? array.value : [];
        rules = this.__parsePropRules(array.rules);
        actions = parseActions(array.actions, myPathKey);
        rowSpace = utils.isNum(array.rowSpace) ? array.rowSpace : undefined;
        type = utils.isStr(array.type) ? array.type : false;
        var btnTypes = ["icon"];
        btnType = btnTypes.includes(array.btnType) ? array.btnType : false;
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
        newArray.delMsg = delMsg;
        newArray.delAllMsg = delAllMsg;
        newArray.delWarnBtns = delWarnBtns;
        newArray.hasAdd = hasAdd;
        newArray.hasCopy = hasCopy;
        newArray.btnType = btnType;
        newArray.min = min;
        newArray.max = max >= min ? max : 0;
        newArray.fixed = fixed;
        newArray.hasOrder = hasOrder;
        newArray.headRequired = headRequired;
        newArray.value = value;
        newArray.rules = rules;
        newArray.before = before;
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

      var newTrigger = parseTrigger(item.trigger);
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

      if (key == "col") {
        newPropItem[key] = this.__parseCol(propItem[key], myPathKey);
        return true;
      }

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
        newPropItem[key] = parsePropComponent(
          propItem[key],
          m_currentFormId,
          myPathKey
        );
        return true;
      }

      if (key == "unit") {
        newPropItem[key] = parsePropComponent(
          propItem[key],
          m_currentFormId,
          myPathKey
        );
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
        var mainComponent = parseMainComponent(
          propItem,
          m_currentFormId,
          myPathKey
        );
        newPropItem[key] = mainComponent;
        if (mainComponent.ref) {
          newPropItem.__hasRef = true;
        }
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
      newPropItem.__style = null;
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
    // var colSum = 0;
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
            // colSum += item.col;
            gFirstItem.__groupCol = this.__sumCol(
              gFirstItem.__groupCol,
              item.col
            );
            // colSum > constant.UI_MAX_COL ? constant.UI_MAX_COL : colSum;
          } else {
            //不是前面的那一组，重新开组
            lastGroup = curGroup;
            gFirstItem = item;
            groups = [key];
            item.__groups = groups;
            item.__hiddenGroup = false;
            // item.col = constant.UI_MAX_COL;
            // colSum = item.col;
            gFirstItem.__groupCol = item.col;
            // colSum > constant.UI_MAX_COL ? constant.UI_MAX_COL : colSum;
          }
        } else {
          //前面没有组，重新开组
          lastGroup = curGroup;
          gFirstItem = item;
          groups = [key];
          item.__groups = groups;
          item.__hiddenGroup = false;
          // item.col = constant.UI_MAX_COL;
          // colSum = item.col;
          gFirstItem.__groupCol = item.col;
          // colSum > constant.UI_MAX_COL ? constant.UI_MAX_COL : colSum;
        }
        item.__inGroups = true; //记录此项在分组里面
      } else {
        lastGroup = false;
        groups = null;
        // colSum = 0;
        gFirstItem = null;
      }
    }
  },

  /**
   * 合并两个长度
   * @param {*} col1
   * @param {*} col2
   */
  __sumCol(col1, col2) {
    // 都是整数
    if (utils.isNum(col1) && utils.isNum(col2)) {
      var colSum = col1 + col2;
      colSum = colSum > constant.UI_MAX_COL ? constant.UI_MAX_COL : colSum;
      return colSum;
    } else {
      // 存在非整数，转化为对象相加
      var colObj1 = col1;
      var colObj2 = col2;
      if (!utils.isObj(colObj1)) {
        colObj1 = {
          width: this.__intToPercent(colObj1)
        };
      }
      if (!utils.isObj(colObj2)) {
        colObj2 = {
          width: this.__intToPercent(colObj2)
        };
      }
      var keyWidth = "width";
      var minWidth = "min-width";
      var maxWidth = "max-width";
      var keys = [keyWidth, minWidth, maxWidth];
      var newColObj = {};
      keys.forEach(key => {
        var valSum = this.__countValue(colObj1[key], colObj2[key]);
        if (!valSum) {
          if (keyWidth === key) {
            newColObj[key] = this.__intToPercent(constant.UI_MAX_COL);
          } else if (minWidth === key) {
            newColObj[key] = colObj1[key];
          } else {
            // maxWidth不要了
          }
        } else {
          newColObj[key] = valSum;
        }
      });
    }
  },

  __intToPercent(col) {
    if (utils.isNum(col)) {
      return Math.floor((col * 1000000) / constant.UI_MAX_COL) / 10000 + "%"; // 保留4位
    } else {
      return col;
    }
  },

  /**
   * 计算两个值之和，不能相加就返回false
   * @param {*} val1
   * @param {*} val2
   */
  __countValue(val1, val2) {
    var unit, sum;
    if (val1 === constant.WIDTH_AUTO && val2 === constant.WIDTH_AUTO) {
      return constant.WIDTH_AUTO;
    } else if (utils.isPercent(val1) && utils.isPercent(val2)) {
      unit = "%";
      sum =
        parseFloat(val1.substr(0, val1.length - unit.length)) +
        parseFloat(val2.substr(0, val2.length - unit.length));
      return (sum > 100 ? 100 : sum) + unit;
    } else if (utils.isPx(val1) && utils.isPx(val2)) {
      unit = "px";
      sum =
        parseFloat(val1.substr(0, val1.length - unit.length)) +
        parseFloat(val2.substr(0, val2.length - unit.length));
      return sum + unit;
    } else {
      return false;
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
