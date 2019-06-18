import sysExtRules from "./rules";
import parse from "./parse";
import global from "./global";
import constant from "./constant";
import utils from "./utils";
import schemaRules from "./schema-rules";
import esHelp from "../components/help.vue";

import { enterSubmit, onlySubmit } from "./submit";

let formUtils = {
  /**
   * 判断值是否为空, 以下几种情况都认为是空值
   */
  isEmpty: function(value) {
    if (
      utils.isUndef(value) ||
      utils.isNull(value) ||
      (utils.isStr(value) && !value) ||
      (utils.isObj(value) && Object.keys(value).length <= 0) ||
      (utils.isArr(value) && value.length <= 0)
    ) {
      return true;
    }
    return false;
  },

  /**
   * 全局设置
   * @param {*} propItem
   * @param {*} value
   */
  setValue: function(propItem, value) {
    formUtils.__setValue(propItem, value);
  },

  /**
   * 全局设置
   * @param {*} propItem
   * @param {*} value
   * @param {*} hasIdxChainChanged //设置过程序是否idxChain做改变，因为父级改变，子级也做做出改变，所以子级就不用再重新设置，等值设置完后，再由父级改变idxChain
   */
  __setValue: function(propItem, value, hasIdxChainChanged = false) {
    if (propItem.array) {
      if (utils.isArr(value)) {
        // console.log(propItem.__pathKey, "in...");
        var hasChanged = false;
        var schemaList = propItem.__propSchemaList;
        if (schemaList.length > value.length) {
          schemaList = schemaList.splice(0, value.length);
          propItem.__propSchemaList = schemaList;
        } else {
          //不够，补上后面的；比如数组是3个，现在直接给了4个；
          for (var i = schemaList.length; i < value.length; i++) {
            formUtils.addArrayItem(propItem);
          }
          hasChanged = true;
        }
        var hasNextIdxChainChanged =
          hasChanged || hasIdxChainChanged ? true : false;
        for (var j = 0; j < value.length; j++) {
          formUtils.__setValue(schemaList[j], value[j], hasNextIdxChainChanged);
        }
        // console.log(120);
        if (hasChanged && !hasIdxChainChanged) {
          // console.log("propItem.__idxChain = ", propItem.__idxChain, propItem.__pathKey);
          formUtils.resetIndexArr(
            propItem,
            propItem.__idxChain,
            propItem.__pathKey
          );
        }
      } else {
        // 值的格式不区配，不必理会
        return true;
      }
      // console.log("in-end...", propItem.__propSchemaList.length);
      return true;
    }

    // 不是数据组了
    if (propItem.component) {
      var tmpValue;
      if (propItem.format) {
        // 不是最终取值，或没有格式转换
        tmpValue = this.__getFormatValue(propItem.format, value, true);
        // console.log(tmpValue, value);
      } else {
        tmpValue = value;
      }
      propItem.value = tmpValue;
    } else if (propItem.properties) {
      for (var key in propItem.properties) {
        !utils.isUndef(value[key]) &&
          formUtils.__setValue(
            propItem.properties[key],
            value[key],
            hasIdxChainChanged
          );
      }
    } else {
      //可能是占位对象
    }
  },

  /**
   * 添加项，注：为什么写这个，统一过滤array, 避免无限循环
   * @param {*} list 数组长列表, 会改变其结构
   * @param {*} item 需要添加的项
   * @param {*} insertInfo 需要添加的默认值；有值时是一个对象：格式如{value}
   */
  addArrayItem(schema, insertInfo) {
    var newItem = {};
    //排除一些可能排版重复的或不需要的
    var excludeKeys = [
      "array",
      "__propSchemaList",
      "desc",
      "help",
      "hidden",
      "__rawHidden",
      "label",
      "title",
      "isTmp"
    ];
    for (var key in schema) {
      if (!excludeKeys.includes(key)) {
        newItem[key] = utils.deepCopy(schema[key]);
      }
    }

    if (!utils.isUndef(schema.array.subLabel)) {
      newItem.subLabel = utils.deepCopy(schema.array.subLabel);
      newItem.__invalidMsg = false;
    }

    // console.log("schema.layout.name == constant.LAYOUT_TABS：", schema.layout.name == constant.LAYOUT_TABS);
    if (schema.layout && schema.layout.name == constant.LAYOUT_TABS) {
      newItem.__tabsIndex = false;
    }

    // newItem.array不可有此值
    if (newItem.array) {
      newItem.array = false;
    }

    if (insertInfo) {
      formUtils.__setValue(newItem, insertInfo.value);
      if (schema.__propSchemaList.length <= insertInfo.position) {
        schema.__propSchemaList.push(newItem);
      } else {
        // 插入中间某个位置
        schema.__propSchemaList.splice(insertInfo.position, 0, newItem);
      }
    } else {
      schema.__propSchemaList.push(newItem);
    }
  },

  /**
   * 全局设置
   * @param {*} propItem
   * @param {*} idxChain  //父级的idxChain
   */
  resetIndexArr: function(
    propItem,
    idxChain,
    pathKey,
    currentIndex = -1,
    fromArray = false // 来自propItem.__propSchemaList循环
  ) {
    // console.log(":", pathKey, ":", pathKey);
    if (propItem.array) {
      // 因为__propSchemaList里面的item不会含array

      if (propItem.__idxChain != idxChain) {
        propItem.__idxChain = idxChain;
      }
      if (propItem.__pathKey != pathKey) {
        propItem.__pathKey = pathKey;
      }

      var schemaList = propItem.__propSchemaList;
      for (var i = 0; i < schemaList.length; i++) {
        var nextIdxChain = idxChain ? idxChain + "," + i : "" + i;
        var nextPathKey = pathKey + "[" + i + "]";
        formUtils.resetIndexArr(
          schemaList[i],
          nextIdxChain,
          nextPathKey,
          i,
          true
        );
      }
      return true;
    }

    // 不是数组
    if (propItem.component) {
      if (propItem.__idxChain != idxChain) {
        propItem.__idxChain = idxChain;
      }
      if (propItem.__pathKey != pathKey) {
        propItem.__pathKey = pathKey;
      }

      if (propItem.__index != currentIndex) {
        propItem.__index = currentIndex;
      }
    } else if (propItem.properties) {
      if (propItem.__idxChain != idxChain) {
        propItem.__idxChain = idxChain;
      }

      if (propItem.__pathKey != pathKey) {
        propItem.__pathKey = pathKey;
      }

      if (propItem.__index != currentIndex) {
        propItem.__index = currentIndex;
      }

      for (var key in propItem.properties) {
        formUtils.resetIndexArr(
          propItem.properties[key],
          idxChain,
          pathKey + "." + key,
          fromArray ? currentIndex : -1, // 因为__propSchemaList的构成是[{properties: {}}]
          false
        );
      }
    } else {
      //可能是占位对象
    }
  },

  /**
   * 获取某一个属性tabs的索引
   * @param {*} schema
   * @param {*} pathKey "age、more1[0].name"
   * @param {*} index
   */
  getTabsIndex: function(schema, pathKey) {
    var targetSchema = this.__getSchemaByKey(schema, pathKey);
    if (targetSchema) {
      if (
        targetSchema.layout &&
        targetSchema.layout.name === constant.LAYOUT_TABS
      ) {
        // 一般tabs
        return targetSchema.__tabsIndex;
      } else if (
        targetSchema.array &&
        targetSchema.array.name === constant.ARRAY_TABS
      ) {
        // 数组tabs
        return targetSchema.__tabsIndex;
      } else {
        // 不是tabs
        return false;
      }
    } else {
      return false; // 路径不对
    }
  },

  /**
   * 切换properies隐藏/打开
   * @param {*} schema
   * @param {*} pathKey "age、more1[0].name"
   */
  togglePropBody: function(schema, pathKey) {
    var targetSchema = this.__getSchemaByKey(schema, pathKey);
    if (targetSchema) {
      if (targetSchema.ui) {
        targetSchema.ui.showBody = !targetSchema.ui.showBody;
      }
    } else {
      // 路径不对，不用理会；不过这个是系统返回，一般不会执行到这里
    }
  },

  /**
   * 指定某一个tabs的索引
   * @param {*} schema
   * @param {*} pathKey "age、more1[0].name"
   * @param {*} index
   */
  setTabsIndex: function(schema, pathKey, index) {
    var targetSchema = this.__getSchemaByKey(schema, pathKey);
    // console.log("targetSchema, pathKey, index: ", targetSchema, pathKey, index);
    if (targetSchema) {
      if (this.__isRightTabsIndex(targetSchema, index)) {
        // 一般tabs
        targetSchema.__tabsIndex = index;

        if (
          targetSchema.array &&
          targetSchema.array.name === constant.ARRAY_TABS
        ) {
          // 数组tabs

          if (utils.isNum(index)) {
            if (targetSchema.__propSchemaList[index].__hasError) {
              targetSchema.__propSchemaList[index].__hasError = false;
            }
          } else {
            // array tabs要是整数
          }
        } else if (
          targetSchema.layout &&
          targetSchema.layout.name === constant.LAYOUT_TABS
        ) {
          if (targetSchema.properties[index].__hasError) {
            targetSchema.properties[index].__hasError = false;
          }
        }
      } else {
        // 不是tabs, 不用理会
      }
    } else {
      // 路径不对，不用理会；不过这个是系统返回，一般不会执行到这里
    }
  },

  __isRightTabsIndex(targetSchema, index) {
    var nextSchema, key;
    if (targetSchema.array && targetSchema.array.name === constant.ARRAY_TABS) {
      // 数组tabs

      if (utils.isNum(index)) {
        var newIndex = Math.floor(index);
        if (
          newIndex === index &&
          newIndex >= 0 &&
          newIndex < targetSchema.__propSchemaList.length
        ) {
          return true;
        }
      } else {
        // array tabs要是整数
      }
    } else if (
      targetSchema.layout &&
      targetSchema.layout.name === constant.LAYOUT_TABS
    ) {
      // 一般tabs
      for (key in targetSchema.properties) {
        nextSchema = targetSchema.properties[key];
        if (key == index && !nextSchema.hidden) {
          return true;
        }
      }
    } else {
      // 不是tabs, 不用理会
    }
    return false;
  },

  getSchemaByKey(schema, keyStr) {
    // 这个函数可能对外单独使用，所以不可以使用this
    return formUtils.__getSchemaByKey(schema, keyStr);
  },

  /**
   *
   * @param {*} schema
   * @param {*} keyStr 必须存在键名：如name 或name[0]; 单独[0]是不允许的，会返回false
   */
  __getSchemaByKey(schema, keyStr) {
    if (utils.isStr(keyStr)) {
      if (!keyStr) {
        return schema;
      }
      var seperator = ".";
      var keys = keyStr.split(seperator);
      var curPropItem = schema;
      var curProperties;
      var nextPropItem;
      var reg = /([\s\S]+?)\[(\d+)\]$/;
      for (var i = 0; i < keys.length; i++) {
        if (!curPropItem) {
          //没有这一级数据，直接退出
          return false;
        }
        curProperties = curPropItem.properties;
        if (curProperties && !curPropItem.array) {
          var key = keys[i];
          var arrayItemKeys = key.match(reg);
          var isLastKey = i == keys.length - 1;
          var realKey = key;
          if (arrayItemKeys) {
            realKey = arrayItemKeys[1];
            var realIndex = parseInt(arrayItemKeys[2]);
            // console.log("realKey: ", realKey);   // 空格也没有事； 如：空格[0]
            curPropItem = curProperties[realKey]; //取出下级继续扫描
            if (!curPropItem) {
              //没有这个属性，退出
              return false;
            }
            if (isLastKey) {
              //最后一个key,表明是设置值
              if (curPropItem.array) {
                //设置array中的某一行（项）
                if (
                  curPropItem.__propSchemaList &&
                  curPropItem.__propSchemaList.length > realIndex
                ) {
                  nextPropItem = curPropItem.__propSchemaList[realIndex];
                  return nextPropItem;
                } else {
                  return false; //超出索引，不符合要求,直接退出
                }
              } else {
                return false; //不符合要求：key是array类型，而当前的curPropItem不是数组
              }
            } else {
              if (curPropItem.array) {
                //进入array中的某一行（项），对某个属性进行设置
                if (
                  curPropItem.__propSchemaList &&
                  curPropItem.__propSchemaList.length > realIndex
                ) {
                  //有效
                  curPropItem = curPropItem.__propSchemaList[realIndex];
                  //继续下一级（上面已经建立了新的curPropItem）
                } else {
                  return false; //超出索引，不符合要求
                }
              } else {
                return false; //不符合要求：key是array类型，而当前的curPropItem不是数组
              }
            }
          } else {
            curPropItem = curProperties[realKey]; //取出下级继续扫描
            if (!curPropItem) {
              //没有这个属性，不符合要求
              return false;
            }
            if (isLastKey) {
              //最后一个key,表明是设置值
              return curPropItem; // 不管是不是数组，直接取出
            } else {
              if (curPropItem.array) {
                // 不是最后一个key, 但curPropItem又是array(因为此形式严格来讲就是一个叶子)
                return false; //不符合要求，退出
              } else {
                //继续下一级（上面已经建立了新的curPropItem）
              }
            }
          }
        } else {
          return false; //没有这一级，不符合要求，退出
        }
      }
    } else {
      return false; //keyStr不符合要求，退出
    }
  },

  /**
   * 指定某一个属性设置
   * @param {*} schema
   * @param {*} keyStr "age、more1[0].name"
   * @param {*} value
   */
  setValueByKey: function(schema, keyStr, value) {
    // console.log("schema, keyStr: ", schema, keyStr, value);
    var targetSchema = this.__getSchemaByKey(schema, keyStr);
    // console.log("current schema: ", targetSchema);
    if (targetSchema) {
      if (targetSchema.component) {
        if (targetSchema.array) {
          //是组件数组
          if (utils.isArr(value) || utils.isNull(value)) {
            //直接设置array的值
            formUtils.setValue(targetSchema, value ? value : []);
          }
        } else {
          var tmpValue;
          if (targetSchema.format) {
            // 不是最终取值，或没有格式转换
            tmpValue = this.__getFormatValue(targetSchema.format, value, true);
            // console.log(tmpValue, value);
          } else {
            tmpValue = value;
          }
          targetSchema.value = tmpValue;
        }
      } else if (targetSchema.properties) {
        if (targetSchema.array) {
          // 是数组赋值
          if (utils.isArr(value) || utils.isNull(value)) {
            //直接设置array的值
            formUtils.setValue(targetSchema, value ? value : []);
          }
        } else {
          // properties赋值
          if (utils.isObj(value)) {
            formUtils.setValue(targetSchema, value);
          }
        }
      }
    } else {
      // 路径不对，不用理会；不过这个是系统返回，一般不会执行到这里
    }
  },

  /**
   * 表单内部的结果
   */
  getValue: function(propItem) {
    return formUtils.__getValue(propItem);
  },

  /**
   * 表单的最终结果
   * @param {*} schema  perfect后的schema
   * @param {*} baseParseSources {global: globalData, rootData: formData, rootSchema: rootSchema}
   * @param {*} globalData 表单的全局数据
   * @param {*} formData 表单的内部值
   */
  getResultValue(schema, baseParseSources) {
    if (utils.isObj(baseParseSources.rootData)) {
      var resultValue = formUtils.__getValue(schema, baseParseSources);
      return this.__tileResultValue(schema, resultValue);
    } else {
      throw "getResultValue： formData 必须是一个对象";
    }
  },

  /**
   * 取值
   * @param {*} propItem
   * @param {*} baseParseSources {global: globalData, rootData: formData(此时这个值不一定有传，没有传时说明是取表单内部传, 有传就取最终结果), rootSchema: rootSchema}
   * @param {*} isParentHidden
   */
  __getValue: function(
    propItem,
    baseParseSources = {},
    isParentHidden = false
  ) {
    var parseSources = Object.assign({}, baseParseSources);
    parseSources.index = propItem.__index;
    parseSources.idxChain = propItem.__idxChain;

    var formData = baseParseSources.rootData;

    // 当false没有值时，证明是表单的内容取值，后不的解析不用执行，提高效率
    var isHidden =
      formData &&
      (isParentHidden || parse.smartEsValue(propItem.hidden, parseSources))
        ? true
        : false;
    // idxChain = idxChain ? idxChain : "";

    var newValue, keyValue, newArr, i, schemaList;

    if (propItem.component) {
      if (formData) {
        // 有表单内部值，则取出是用户表单值
        if (!propItem.isTmp) {
          // 不是临时值
          if (isHidden && !utils.isNull(propItem.hdValue)) {
            // return propItem.hdValue;
            if (!utils.isUndef(propItem.hdValue)) {
              return propItem.hdValue;
            } else {
              // 特殊约定，hdValue为undefined, 说明不用取出此值
              return undefined;
            }
          } else {
            // 需要往下解析
          }
        } else {
          // 临时字段，不用取出
          return undefined;
        }
      } else {
        // form 内部取值
        // return propItem.value;
        // 需要往下解析
      }

      // 内部值，也不隐藏
      if (propItem.array) {
        // 是数组
        newArr = [];
        schemaList = propItem.__propSchemaList;
        for (i = 0; i < schemaList.length; i++) {
          // var nextIdxChain = idxChain ? idxChain + "," + i : "" + i;
          newValue = formUtils.__getValue(
            schemaList[i],
            baseParseSources,
            isHidden
          );
          newArr.push(newValue);
        }
        return newArr;
      } else {
        // 不是数组
        if (formData) {
          if (propItem.format) {
            // 不是最终取值，或没有格式转换
            return this.__getFormatValue(
              propItem.format,
              propItem.value,
              false
            );
          } else {
            return propItem.value;
          }
        } else {
          // form 内部取值
          return propItem.value;
        }
      }
    } else if (propItem.properties) {
      if (formData) {
        // 有表单内部值，则取出是用户表单值
        if (propItem.isTmp) {
          // 临时字段，不用取出
          return undefined;
        } else if (isHidden && !utils.isNull(propItem.hdValue)) {
          if (!utils.isUndef(propItem.hdValue)) {
            return propItem.hdValue;
          } else {
            // 特殊约定，hdValue为undefined, 说明不用取出此值
            return undefined;
          }
        } else {
          // 往下取出正常值
        }
      }

      if (propItem.array) {
        newArr = [];
        schemaList = propItem.__propSchemaList;
        for (i = 0; i < schemaList.length; i++) {
          // var nextIdxChain = idxChain ? idxChain + "," + i : "" + i;
          newValue = formUtils.__getValue(
            schemaList[i],
            baseParseSources,
            isHidden
          );
          newArr.push(newValue);
        }
        return newArr;
      } else {
        newValue = {};
        for (var key in propItem.properties) {
          keyValue = formUtils.__getValue(
            propItem.properties[key],
            baseParseSources,
            isHidden
          );
          if (!utils.isUndef(keyValue)) {
            newValue[key] = keyValue;
          }
        }
        return newValue;
      }
    } else {
      return undefined;
    }
  },

  /**
   * 数值转换
   * @param {*} format
   * @param {*} outerToInner
   */
  __getFormatValue: function(format, curVal, outerToInner = true) {
    if (format) {
      if (outerToInner) {
        // 表单外部的值转换为表单内部的值
        var curEmum, i;
        if (utils.isArr(format)) {
          // 数组，说明是枚举转换
          for (i = 0; i < format.length; i++) {
            curEmum = format[i];
            if (curEmum.outer == curVal) {
              return curEmum.inner;
            }
          }
        } else if (utils.isFunc(format.outer)) {
          // 有外部转换函数
          return format.outer(curVal);
        }
      } else {
        // 表单内部的值转换为表单外部的值

        if (utils.isArr(format)) {
          // 数组，说明是枚举转换
          for (i = 0; i < format.length; i++) {
            curEmum = format[i];
            if (curEmum.inner == curVal) {
              return curEmum.outer;
            }
          }
        } else if (utils.isFunc(format.inner)) {
          // 有内部转换函数
          return format.inner(curVal);
        }
      }
    }
    return curVal;
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
        rootObj.direction = global.direction;
        rootObj.array = false; // 顶级是不支持数组的
        rootObj.layout = false;
        rootObj.properties = tmpSchema;

        // 根节点有效的属性
        autoMatch = false;
      } else {
        // console.log("rootObj.layout.name", rootObj.layout.name === constant.LAYOUT_TABS);
        var newLayout = this.__parsePropLayout(rootObj.layout);
        rootObj.array = false; // 顶级是不支持数组的
        if (newLayout && newLayout.name === constant.LAYOUT_TABS) {
          rootObj.layout = false;
        }
        rootObj.direction = ["h", "v"].includes(rootObj.direction)
          ? rootObj.direction
          : global.direction;

        // 根节点有效的属性
        autoMatch = rootObj.autoMatch === true ? true : false;
      }
      rootObj.label = { text: false, __rawText: false }; // 顶级是不支持label

      //设置表单的一些默认值
      rootObj.rowHeight = rootObj.rowHeight
        ? rootObj.rowHeight
        : global.boxRowHeight;
      rootObj.boxRowHeight = rootObj.boxRowHeight
        ? rootObj.boxRowHeight
        : global.boxRowHeight;

      rootObj.rowSpace = 0;
      rootObj.boxRowSpace = rootObj.boxRowSpace
        ? rootObj.boxRowSpace
        : global.boxRowSpace;

      rootObj.labelWidth = rootObj.labelWidth
        ? rootObj.labelWidth
        : global.boxLabelWidth;
      rootObj.boxLabelWidth = rootObj.boxLabelWidth
        ? rootObj.boxLabelWidth
        : global.boxLabelWidth;

      rootObj = formUtils.__parseProp(
        rootObj,
        1,
        "根",
        formUtils.__newInheritObj(rootObj),
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
      propKeys = formUtils.__getPropKeys("none");
      newPropItem = formUtils.__filterKeys(
        propItem,
        propKeys,
        inheritObj,
        myPathKey
      );
    } else if (this.__isPropItem(propItem)) {
      if (!this.__existEntityItem(propItem)) {
        throw "属性" + parentKey + "没有具体的子节点";
      }

      // 是否数组(优先级最高)
      isArray = this.__isArray(propItem.array);
      propKeys = formUtils.__getPropKeys("properties");
      newPropItem = formUtils.__filterKeys(
        propItem,
        propKeys,
        inheritObj,
        myPathKey
      );
      if (isArray) {
        if (utils.isUndef(newPropItem.array.rowSpace)) {
          // 当没有设置时，则取上一级的rowSpace
          newPropItem.array.rowSpace = newPropItem.rowSpace;
        }
      }

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

          var nextPropItem = formUtils.__parseProp(
            nextRawPropItem,
            curLevel + 1,
            key,
            formUtils.__newInheritObj(newPropItem),
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
              // nextPropItem.label = { text: "", __rawText: "" };
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

      //整理一下ref, 同一级别的只留最后一下
      formUtils.__uniqueRef(newPropItem);

      if (
        isNormalTabs ||
        (newPropItem.array && newPropItem.array.name == constant.ARRAY_TABLE)
      ) {
        //当是tabs or constant.ARRAY_TABLE时，若是分组失效
        // continue; //是占位空间，去掉
      } else {
        //直接改变newPropItem的值，设置分组情况
        formUtils.__reinitGroup(newPropItem);
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
        formUtils.__setValue(newPropItem, newPropItem.array.value);
        // console.log("end ...");
        delete newPropItem.array.value; //任务完成
      }
    } else {
      // 是组件了
      propKeys = formUtils.__getPropKeys("component");
      newPropItem = formUtils.__filterKeys(
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

      if (
        utils.isUndef(newPropItem.value) &&
        newPropItem.component.name === global.defaultCom
      ) {
        // 设置默认值组件的默认值
        newPropItem.value = global.defaultVal;
      }
      if (newPropItem.format) {
        newPropItem.value = this.__getFormatValue(
          newPropItem.format,
          newPropItem.value,
          true
        );
      }

      var eventOn = formUtils.__listEvent(newPropItem);
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

        formUtils.__setValue(newPropItem, newPropItem.array.value);
        delete newPropItem.array.value; //任务完成
      }
    }

    newPropItem.__rawHidden = newPropItem.hidden;

    return newPropItem;
  },

  /**
   *
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

  /* 整理出组件需要监听的外部事件 */
  __listEvent: function(propItem) {
    var emitEvents = [],
      nativeEvents = [],
      triggerList,
      nativeName;

    if (propItem.rules) {
      var rules = propItem.rules;

      var checkList = rules.check;
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
      // 要去掉左右两边的空格，添此触发事件
      nativeName = this.__getNativeName(global.trimEvent);
      if (nativeName) {
        // .native监听
        nativeEvents.push(nativeName);
      } else {
        emitEvents.push(global.trimEvent);
      }
    }

    // 自定义事件
    if (propItem.component && propItem.component.actions) {
      var actions = propItem.component.actions;
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
          "value",
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
          "boxRowHeight",
          "rowSpace",
          "boxRowSpace",
          "labelWidth",
          "boxLabelWidth",
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

  __getNormalInfo: function(key) {
    var keyInfos = [
      {
        key: "value",
        enums: [],
        defaultValue: undefined
      },
      {
        key: "hidden",
        enums: [true, false],
        filters: ["isEs"], // 取schema-rules规则过滤
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
        key: "desc",
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
        key: "unit",
        enums: [],
        filters: ["isStr"],
        defaultValue: false
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
        key: "boxRowHeight",
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
        key: "boxRowSpace",
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
        key: "boxLabelWidth",
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

  __getSpecialInfo: function(key) {
    var keyInfos = [
      // {
      //   key: "title",
      //   defaultValue: false,
      //   nameKey: "text"
      // },
      // {
      //   key: "label",
      //   defaultValue: false,
      //   nameKey: "text"
      // },
      // {
      //   key: "component",
      //   defaultValue: false,
      //   nameKey: "name"
      // },
      // {
      //   key: "array",
      //   defaultValue: false,
      //   nameKey: "name"
      // }
    ];
    for (var i = 0; i < keyInfos.length; i++) {
      if (keyInfos[i].key === key) {
        return keyInfos[i];
      }
    }
    return false;
  },

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
            if (filterFunc.apply(null, newParams) !== true) {
              isRight = false;
              break;
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

  __parseSpecialKey: function(propItem, keyInfo) {
    var value = propItem[keyInfo.key];
    if (utils.isUndef(value)) {
      return keyInfo.defaultValue;
    } else if (utils.isStr(value)) {
      var newObj = {};
      newObj[keyInfo.nameKey] = value;
      return newObj;
    } else if (utils.isObj(value)) {
      return value;
    } else {
      return keyInfo.defaultValue;
    }
  },

  /* 解析右栏组件 */
  __parseMainComponent: function(component, myPathKey) {
    var tmpComponent,
      defaultAlign = false;
    if (utils.isObj(component) && Object.keys(component).length > 0) {
      // console.log("ref: ", component.ref);
      tmpComponent = {};
      tmpComponent.name = component.name ? component.name : global.defaultCom;
      tmpComponent.actions = this.__parseActions(component.actions, myPathKey);
      var ref = utils.isStr(component.ref) ? component.ref.trim() : null;
      if (ref) {
        tmpComponent.ref = ref;
      }

      if (utils.isObj(component.props)) {
        if (this.__hasEsInObj(component.props)) {
          tmpComponent.props = this.__newEmptyObj(component.props); // 后面(analyzeUiProps)有解析的
          tmpComponent.__rawProps = utils.deepCopy(component.props);
        } else {
          tmpComponent.props = utils.deepCopy(component.props); // 可直接使用
        }
      } else {
        tmpComponent.props = {};
      }

      if (utils.isStr(component.text)) {
        tmpComponent.text = component.text;
        if (parse.isEsScript(component.text)) {
          tmpComponent.__rawText = component.text;
        }
      }
      tmpComponent.align = this.__parseAlign(component.align, defaultAlign);
      tmpComponent.size = this.__parseSize(component.size);
    } else if (utils.isStr(component)) {
      tmpComponent = {
        name: component,
        actions: [],
        align: defaultAlign,
        size: false
      };
    } else {
      tmpComponent = {
        name: global.defaultCom,
        actions: [],
        align: defaultAlign,
        size: false
      };
    }

    return tmpComponent;
  },

  __newEmptyObj(obj) {
    var newObj = {};
    for (var key in obj) {
      newObj[key] = null;
    }
    return newObj;
  },

  __hasEsInObj(obj) {
    var isRight = false;
    for (var key in obj) {
      if (parse.isEsScript(obj[key])) {
        isRight = true;
        break;
      }
    }
    return isRight;
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

  /* 解析Label */
  __parseLabel: function(value) {
    var newValue,
      defaultAlign = false;
    newValue = this.__parsePropComponent(value, true);

    // 因为label有点特殊，所以不能为false
    if (newValue) {
      newValue.size = this.__parseSize(value.size);
      newValue.align = this.__parseAlign(value.align, defaultAlign);
    } else {
      newValue = {
        text: false,
        __rawText: false,
        size: false,
        align: defaultAlign
      };
    }

    return newValue;
  },

  __parseSize(size) {
    var sizes = ["fixed", "auto"];
    if (sizes.includes(size)) {
      return size;
    }
    return false;
  },

  __parseAlign(align, defaultVal = "left") {
    var aligns = ["left", "center", "right"];
    if (aligns.includes(align)) {
      return align;
    }
    return defaultVal;
  },

  /* 解析title */
  __parseTitle: function(value) {
    var newValue = this.__parsePropComponent(value);
    return newValue;
  },

  /* 解析boxUi, 只支持properites */
  __parseBoxUi: function(value) {
    var newValue;
    if (utils.isObj(value) && Object.keys(value).length > 0) {
      newValue = {};
      if (utils.isBool(value.showBody)) {
        newValue.__hasToggle = true; // 有切换按钮
        newValue.showBody = value.showBody;
      } else {
        newValue.__hasToggle = false; // 无切换按钮
        newValue.showBody = true;
      }
      newValue.type = utils.isStr(value.type) ? value.type.trim() : "";
    } else if (utils.isStr(value)) {
      newValue = {
        __hasToggle: false,
        showBody: true,
        type: value.trim()
      };
    } else {
      // 为false
      newValue = false;
    }

    return newValue;
  },

  /* 解析帮助 */
  __parsePropHelp: function(help) {
    // console.log("help: ", help);
    var gHelp = false;
    if (utils.isObj(help) && Object.keys(help).length > 0) {
      gHelp = {};
      Object.assign(gHelp, help);
      if (!gHelp.name) {
        gHelp.name = esHelp;
      }
      gHelp = this.__parsePropComponent(gHelp);
    } else if (utils.isStr(help)) {
      gHelp = { name: esHelp, props: { content: help } };
      gHelp = this.__parsePropComponent(gHelp);
    } else {
      gHelp = false;
    }
    // console.log("gHelp: ", gHelp);
    return gHelp;
  },

  /* 解析一般组件 */
  __parsePropComponent: function(value, canEmpty = false) {
    var newCom;
    if (utils.isObj(value) && Object.keys(value).length > 0) {
      newCom = {};
      var name =
        utils.isStr(value.name) && value.name.trim()
          ? value.name.trim()
          : value.name;
      if (name) {
        newCom.name = name;
        if (utils.isObj(value.props)) {
          if (this.__hasEsInObj(value.props)) {
            newCom.props = this.__newEmptyObj(value.props); // 后面(analyzeUiProps)有解析的
            newCom.__rawProps = utils.deepCopy(value.props);
          } else {
            newCom.props = utils.deepCopy(value.props); // 直接使用，不用解析了
          }
        } else {
          newCom.props = {};
        }
      }

      var text =
        utils.isStr(value.text) && value.text.trim()
          ? value.text.trim()
          : canEmpty
          ? ""
          : false;
      newCom.text = text;

      if (!name && !text) {
        // 说明为空
        return false;
      }
      newCom.__rawText = text;
      return newCom;
    } else if (utils.isStr(value)) {
      value = value.trim();
      if (value || canEmpty) {
        newCom = { text: value, __rawText: value };
      } else {
        newCom = false;
      }
      return newCom;
    } else {
      return false;
    }
  },

  /* 解析规则 */
  __parsePropRules: function(rules) {
    if (utils.isObj(rules)) {
      var checkList = rules.check;
      var tmpCheckList;
      if (!checkList) {
        checkList = [];
      } else if (!utils.isArr(checkList)) {
        checkList = [checkList];
      }
      tmpCheckList = checkList.map(item => {
        return formUtils.__perfectCheckItem(item);
      });
      rules.check = tmpCheckList;
      rules.required = rules.required ? rules.required : false;
      rules.__rawRequired = rules.required;
      if (rules.required || (rules.check && rules.check.length > 0)) {
        // 合法的写法
        return rules;
      } else {
        return false;
      }
    } else if (utils.isBool(rules) || utils.isStr(rules)) {
      var rawRequired = rules;
      rules = { required: rawRequired, __rawRequired: rawRequired };
      return rules;
    } else {
      return false;
    }
  },

  __isArray(array) {
    if (array) {
      return true;
    } else {
      return false;
    }
  },

  __isPropItem(rawItem) {
    return (
      !this.__isSpaceItem(rawItem) &&
      utils.isObj(rawItem.properties) &&
      Object.keys(rawItem.properties).length > 0
    );
  },

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
    }

    return newLayout;
  },

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
        min =
          utils.isUndef(array.min) || array.min <= 0 || !utils.isNum(array.min)
            ? 0
            : array.min;
        max =
          utils.isUndef(array.max) || array.max <= 0 || !utils.isNum(array.max)
            ? 0
            : array.max;
        fixed =
          utils.isUndef(array.fixed) ||
          array.fixed <= 0 ||
          !utils.isNum(array.fixed)
            ? 0
            : array.fixed;
        hasOrder =
          utils.isUndef(array.hasOrder) || array.hasOrder ? true : false;
        headRequired =
          array.name == constant.ARRAY_TABLE && array.headRequired
            ? true
            : false;
        // subLabel = utils.isStr(array.subLabel) ? array.subLabel : false;

        subLabel = this.__parsePropComponent(array.subLabel);
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
        newArray.max = max;
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
      } else {
        throw "formUtils.__parsePropArray: array.name不合法";
      }

      return newArray;
    } else {
      return false;
    }
  },

  __perfectCheckItem: function(item) {
    // console.log("item = ", item);
    if (utils.isStr(item) || utils.isFunc(item)) {
      return { name: item, trigger: [constant.INPUT_EVENT] };
    } else if (
      utils.isObj(item) &&
      (utils.isStr(item.name) || utils.isFunc(item.name))
    ) {
      var newTrigger = this.__parseTrigger(item.trigger);
      newTrigger =
        newTrigger && newTrigger.length
          ? utils.unique(newTrigger)
          : [constant.INPUT_EVENT];

      var newParams;
      if (!utils.isUndef(item.params)) {
        //有定义，没有定义就不理会
        if (utils.isArr(item.params)) {
          newParams = item.params;
        } else {
          newParams = [item.params];
        }
      }

      var newItem = {
        name: item.name,
        trigger: newTrigger,
        params: newParams
      };

      return newItem;
    } else {
      throw "formUtils.__perfectCheckItem: rules设置不正确";
      // return null;
    }
  },

  __filterKeys: function(propItem, propKeys, inheritObj, myPathKey) {
    var newPropItem = {};
    propKeys.forEach(key => {
      if (key == "label") {
        newPropItem[key] = formUtils.__parseLabel(propItem[key]);
        return true;
      }

      if (key == "title") {
        newPropItem[key] = formUtils.__parseTitle(propItem[key]);
        return true;
      }

      if (key == "ui") {
        newPropItem[key] = formUtils.__parseBoxUi(propItem[key]);
        return true;
      }

      if (key == "format") {
        newPropItem[key] = formUtils.__parseFormat(propItem[key]);
        return true;
      }

      if (key == "rules") {
        newPropItem[key] = formUtils.__parsePropRules(propItem[key]);
        newPropItem.__invalidMsg = false;
        return true;
      }
      if (key == "help") {
        newPropItem[key] = formUtils.__parsePropHelp(propItem[key]);
        return true;
      }
      if (key == "desc") {
        newPropItem[key] = formUtils.__parsePropComponent(propItem[key]);
        return true;
      }

      if (key == "unit") {
        newPropItem[key] = formUtils.__parsePropComponent(propItem[key]);
        return true;
      }

      if (key == "array") {
        newPropItem[key] = formUtils.__parsePropArray(
          propItem[key],
          propItem,
          myPathKey
        );
        return true;
      }

      if (key == "layout") {
        newPropItem[key] = formUtils.__parsePropLayout(propItem[key]);
        return true;
      }

      if (key == "component") {
        var mainComponent = formUtils.__parseMainComponent(
          propItem[key],
          myPathKey
        );
        // var esBakComponent = formUtils.__fetchComponentEs(mainComponent);
        // if (esBakComponent) {
        //   newPropItem["_component"] = esBakComponent;
        // }
        newPropItem[key] = mainComponent;
        return true;
      }

      var specialKeyInfo = formUtils.__getSpecialInfo(key);
      if (specialKeyInfo) {
        newPropItem[key] = formUtils.__parseSpecialKey(
          propItem,
          specialKeyInfo
        );
      } else {
        var normalKeyInfo = formUtils.__getNormalInfo(key);
        if (normalKeyInfo) {
          newPropItem[key] = formUtils.__parseNormalKey(
            propItem,
            normalKeyInfo,
            inheritObj
          );
        } else {
          throw "程序的key(" + key + ")不对应，请修改";
        }
      }
    });
    if (!utils.isUndef(newPropItem.rowSpace)) {
      newPropItem.__rawRowSpace = newPropItem.rowSpace;
    }
    return newPropItem;
  },

  __newInheritObj: function(propItem) {
    var keys = [
      "direction",
      "colon",
      "boxRowSpace",
      "boxLabelWidth",
      "boxRowHeight"
    ];
    var keyObj = {
      //把右边的数据给下一级的节点
      rowHeight: "boxRowHeight",
      rowSpace: "boxRowSpace",
      labelWidth: "boxLabelWidth"
    };
    var obj = {};
    keys.forEach(key => {
      obj[key] = propItem[key];
    });
    for (var key in keyObj) {
      obj[key] = propItem[keyObj[key]];
    }
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
   *
   * @param {*} rules
   * @param {*} value
   * @param {*} triggers 当triggers没有时，说明rules的规则无论是什么条件触发都要判断一遍
   * @param {*} parseSources {global, rootData, index, idxChain, rootSchema}
   * @param {*} pathKey 哪个组件触发
   * @returns Boolean or string
   * true 是需要检查的，并且正确
   * false 不需要检查
   * string 是需要检查的，但不正确
   */
  checkRules: function(rules, value, triggers, parseSources, pathKey) {
    if (!rules) {
      //没有规则
      return true;
    }

    var isRequired = parse.smartEsValue(rules.required, parseSources);
    // console.log("isRequired: ", isRequired);
    if (isRequired) {
      //空要检查
      if (formUtils.isEmpty(value)) {
        return rules.emptyMsg && utils.isStr(rules.emptyMsg)
          ? rules.emptyMsg
          : "不能为空";
      }
    } else if (!isRequired && formUtils.isEmpty(value)) {
      //空时不检查，场景：当埋写邮件地址时，要么不写要么写正确
      return true;
    }
    //非空情况
    var checkList = rules.check;
    var errMsg = true;
    var checkFun, params;
    if (checkList && checkList.length > 0) {
      var hadChecked = false;
      for (var i = 0; i < checkList.length; i++) {
        var checkItem = checkList[i];
        if (checkItem.name) {
          var checkTriggers = checkItem.trigger; //检查时机，默认为实时
          if (!triggers || utils.isInter(checkTriggers, triggers)) {
            hadChecked = true;
            var result = true;
            if (utils.isStr(checkItem.name)) {
              if (sysExtRules[checkItem.name]) {
                //系统或扩展的验证函数
                checkFun = sysExtRules[checkItem.name];
                params = checkItem.params
                  ? utils.deepCopy(checkItem.params)
                  : [];
                params.unshift(value);
                // console.log("parmas: ", params);
                result = checkFun.apply(null, params);
              } else if (parse.isEsScript(checkItem.name)) {
                result = parse.smartEsValue(checkItem.name, parseSources);
              } else {
                //找不到，不理会，认为无问题
              }
            } else if (utils.isFunc(checkItem.name)) {
              //是一个函数
              checkFun = checkItem.name;
              params = checkItem.params ? utils.deepCopy(checkItem.params) : [];
              params.unshift(pathKey);
              params.unshift(utils.deepCopy(parseSources.rootData));
              params.unshift(value);
              result = checkFun.apply(null, params);
            }
            // console.log("result2 = ", result);
            if (result !== true) {
              if (utils.isStr(result)) {
                //直接返回错误信息
                errMsg = result;
              } else {
                //用统一的错误信息
                errMsg =
                  rules.errMsg && utils.isStr(rules.errMsg)
                    ? rules.errMsg
                    : "格式不对";
              }
              break;
            }
          }
        }
      }

      if (!hadChecked) {
        // 都没有进入验证，说明这个事件是目标事件，返回false
        errMsg = false;
      }
    } else {
      // 没有要验证的东西
      errMsg = true;
    }
    return errMsg;
  },

  clearErrorMsg(propItem) {
    if (!utils.isUndef(propItem.__invalidMsg)) {
      propItem.__invalidMsg = false;
    }
    if (propItem.component) {
      // if (!utils.isUndef(propItem.__invalidMsg)) {
      //   propItem.__invalidMsg = false;
      // }
    } else if (propItem.properties) {
      if (propItem.array) {
        var schemaList = propItem.__propSchemaList;
        // console.log(propItem.__propSchemaList);
        for (var i = 0; i < schemaList.length; i++) {
          formUtils.clearErrorMsg(schemaList[i]);
        }
      } else {
        for (var key in propItem.properties) {
          formUtils.clearErrorMsg(propItem.properties[key]);
        }
      }
    } else {
      // return undefined;
    }
  },

  /**
   * 根据formData, 分析界面的情况。现主要是解析第一行的情况和hidden, required
   * @param {*} schema
   * @param {*} baseParseSources {global: globalData, rootData: formData, rootSchema: rootSchema}
   * @param {*} formData
   * @param {*} rootSchema
   */
  analyzeUiProps(propItem, baseParseSources) {
    var sum = 0;
    var isHidden, isRequired, text, listLen, schemaList, i;

    var parseSources = Object.assign({}, baseParseSources);
    parseSources.index = propItem.__index;
    parseSources.idxChain = propItem.__idxChain;

    if (propItem.component) {
      if (propItem.__rawHidden) {
        // false或为空都不用执行
        isHidden = parse.smartEsValue(propItem.__rawHidden, parseSources);

        if (propItem.hidden != isHidden) {
          propItem.hidden = isHidden;
        }
      }

      if (propItem.label) {
        if (!propItem.label.name && propItem.label.__rawText) {
          // false或为空都不用执行 properies array下propItem.label
          text = parse.smartEsValue(propItem.label.__rawText, parseSources);
          if (propItem.label.text != text) {
            propItem.label.text = text;
          }
        } else {
          // 解析组件内的属性
          this.__esParseComponent(propItem.label, parseSources);
        }
      }

      if (propItem.desc) {
        if (!propItem.desc.name && propItem.desc.__rawText) {
          // false或为空都不用执行 propItem.desc
          text = parse.smartEsValue(propItem.desc.__rawText, parseSources);
          if (propItem.desc.text != text) {
            propItem.desc.text = text;
          }
        } else {
          // 解析组件内的属性
          this.__esParseComponent(propItem.desc, parseSources);
        }
      }

      if (propItem.unit) {
        if (!propItem.unit.name && propItem.unit.__rawText) {
          // false或为空都不用执行 propItem.unit
          text = parse.smartEsValue(propItem.unit.__rawText, parseSources);
          if (propItem.unit.text != text) {
            propItem.unit.text = text;
          }
        } else {
          // 解析组件内的属性
          this.__esParseComponent(propItem.unit, parseSources);
        }
      }

      if (propItem.help) {
        // 解析组件内的属性
        this.__esParseComponent(propItem.help, parseSources);
      }

      if (propItem.array) {
        // 数组
        schemaList = propItem.__propSchemaList;
        for (i = 0; i < schemaList.length; i++) {
          formUtils.analyzeUiProps(schemaList[i], baseParseSources);
        }

        // 是数组array-tabs, 调整索引
        if (propItem.array.name == constant.ARRAY_TABS) {
          listLen = propItem.__propSchemaList.length;
          if (listLen > 0) {
            if (propItem.__tabsIndex === false) {
              // 刚开始，取第一个
              propItem.__tabsIndex = 0;
            } else {
              if (
                propItem.__tabsIndex < 0 ||
                propItem.__tabsIndex >= listLen - 1
              ) {
                propItem.__tabsIndex = listLen - 1; // 取最后一个
              } else {
                // 此范围索引合法
              }
            }
          } else {
            if (propItem.__tabsIndex !== false) {
              propItem.__tabsIndex = false;
            }
          }
        }
      } else {
        /* 一般组件 */
        if (propItem.rules && propItem.rules.__rawRequired) {
          // false或为空都不用执行
          isRequired = parse.smartEsValue(
            propItem.rules.__rawRequired,
            parseSources
          );
          if (propItem.rules.required != isRequired) {
            propItem.rules.required = isRequired;
          }
        }

        // 解析组件内的属性
        this.__esParseComponent(propItem.component, parseSources);
      }
    } else if (propItem.properties) {
      if (propItem.__rawHidden) {
        // false或为空都不用执行
        isHidden = parse.smartEsValue(
          // propItem.__propSchemaList里面是没有hidden的，不过此写法不影响，smartEsValue前后都是undefined
          propItem.__rawHidden,
          parseSources
        );
        if (propItem.hidden != isHidden) {
          propItem.hidden = isHidden;
        }
      }

      if (propItem.title) {
        if (!propItem.title.name && propItem.title.__rawText) {
          // false或为空都不用执行 properies array下propItem.title
          text = parse.smartEsValue(propItem.title.__rawText, parseSources);
          if (propItem.title.text != text) {
            propItem.title.text = text;
          }
        } else {
          // 解析组件内的属性
          this.__esParseComponent(propItem.title, parseSources);
        }
      }

      if (propItem.label) {
        if (!propItem.label.name && propItem.label.__rawText) {
          // false或为空都不用执行 properies array下propItem.label
          text = parse.smartEsValue(propItem.label.__rawText, parseSources);
          if (propItem.label.text != text) {
            propItem.label.text = text;
          }
        } else {
          // 解析组件内的属性
          this.__esParseComponent(propItem.label, parseSources);
        }
      }

      if (propItem.desc) {
        if (!propItem.desc.name && propItem.desc.__rawText) {
          // false或为空都不用执行 propItem.desc
          text = parse.smartEsValue(propItem.desc.__rawText, parseSources);
          if (propItem.desc.text != text) {
            propItem.desc.text = text;
          }
        } else {
          // 解析组件内的属性
          this.__esParseComponent(propItem.desc, parseSources);
        }
      }

      if (propItem.unit) {
        if (!propItem.unit.name && propItem.unit.__rawText) {
          // false或为空都不用执行 propItem.unit
          text = parse.smartEsValue(propItem.unit.__rawText, parseSources);
          if (propItem.unit.text != text) {
            propItem.unit.text = text;
          }
        } else {
          // 解析组件内的属性
          this.__esParseComponent(propItem.unit, parseSources);
        }
      }

      if (propItem.help) {
        // 解析组件内的属性
        this.__esParseComponent(propItem.help, parseSources);
      }

      if (propItem.subLabel) {
        if (!propItem.subLabel.name && propItem.subLabel.__rawText) {
          text = parse.smartEsValue(propItem.subLabel.__rawText, parseSources);
          if (propItem.subLabel.text != text) {
            propItem.subLabel.text = text;
          }
        } else {
          // 解析组件内的属性
          this.__esParseComponent(propItem.subLabel, parseSources);
        }
      }

      if (propItem.array) {
        schemaList = propItem.__propSchemaList;
        for (i = 0; i < schemaList.length; i++) {
          formUtils.analyzeUiProps(schemaList[i], baseParseSources);
        }
        // 是数组tabs, 调整索引
        if (propItem.array.name == constant.ARRAY_TABS) {
          listLen = propItem.__propSchemaList.length;
          if (listLen > 0) {
            if (propItem.__tabsIndex === false) {
              // 刚开始，取第一个
              propItem.__tabsIndex = 0;
            } else {
              if (
                propItem.__tabsIndex < 0 ||
                propItem.__tabsIndex >= listLen - 1
              ) {
                propItem.__tabsIndex = listLen - 1; // 取最后一个
              } else {
                // 此范围索引合法
              }
            }
          } else {
            if (propItem.__tabsIndex !== false) {
              propItem.__tabsIndex = false;
            }
          }
        }
      } else {
        var nextPropItem, key;
        if (propItem.layout && propItem.layout.name == constant.LAYOUT_TABS) {
          // 是普通tabs
          for (key in propItem.properties) {
            nextPropItem = propItem.properties[key];
            // 下一级
            formUtils.analyzeUiProps(nextPropItem, baseParseSources);
          }
          //调整索引
          if (propItem.__tabsIndex === false) {
            for (key in propItem.properties) {
              // 取第一个不是隐藏的key作为索引
              nextPropItem = propItem.properties[key];
              if (!nextPropItem.hidden) {
                propItem.__tabsIndex = key;
                break;
              }
            }
          } else {
            var curIndexPropItem = propItem.properties[propItem.__tabsIndex];
            // console.log("curIndexPropItem: ", curIndexPropItem, propItem.__tabsIndex);
            if (curIndexPropItem.hidden) {
              // 当前的索引对应的tab隐藏了

              var indexs = [];
              for (key in propItem.properties) {
                nextPropItem = propItem.properties[key];
                if (key === propItem.__tabsIndex) {
                  indexs.push(key);
                } else if (!nextPropItem.hidden) {
                  indexs.push(key);
                }
              }
              if (indexs.length > 1) {
                var curIndex = indexs.indexOf(propItem.__tabsIndex);
                if (curIndex < indexs.length - 1) {
                  // 不是最后一个，取下一个
                  propItem.__tabsIndex = indexs[curIndex + 1];
                } else {
                  // 取上一个
                  propItem.__tabsIndex = indexs[curIndex - 1];
                }
              } else {
                propItem.__tabsIndex = false; // 没有索引或全部tabs隐藏
              }
            } else {
              // 值有效，不必理会
            }
          }
        } else {
          sum = 0;
          for (key in propItem.properties) {
            nextPropItem = propItem.properties[key];
            if (nextPropItem.__groups) {
              //是一个组
              isHidden = formUtils.isGroupHidden(
                propItem,
                nextPropItem.__groups,
                baseParseSources
              );
              if (!isHidden) {
                //组不隐藏
                if (sum <= 0) {
                  //这个组就是第一行
                  sum = constant.UI_MAX_COL;
                  if (nextPropItem.rowSpace != 0) {
                    nextPropItem.rowSpace = 0;
                  }
                } else {
                  sum += constant.UI_MAX_COL;
                }
                if (nextPropItem.__hiddenGroup != isHidden) {
                  nextPropItem.__hiddenGroup = isHidden;
                }
              } else {
                //不必理会
              }
            } else if (nextPropItem.__inGroups) {
              //组内成员
              if (nextPropItem.rowSpace != 0) {
                nextPropItem.rowSpace = 0;
              }
            } else {
              //正常成员
              var nextParseSources = Object.assign({}, baseParseSources);
              nextParseSources.index = nextPropItem.__index;
              nextParseSources.idxChain = nextPropItem.__idxChain;

              isHidden = parse.smartEsValue(
                nextPropItem.__rawHidden,
                nextParseSources
              );
              // console.log(nextPropItem.col, isHidden);
              if (!isHidden) {
                sum += nextPropItem.col;
                var newRowSpace;
                if (sum <= constant.UI_MAX_COL) {
                  //还在第一行
                  newRowSpace = 0;
                } else {
                  newRowSpace = nextPropItem.__rawRowSpace;
                }
                if (nextPropItem.rowSpace != newRowSpace) {
                  //还原
                  nextPropItem.rowSpace = newRowSpace;
                }
              } else {
                //不必理会
              }
            }
            // 下一级
            formUtils.analyzeUiProps(nextPropItem, baseParseSources);
          }
        }
      }
    } else {
      // 占位空间等
      if (propItem.__rawHidden) {
        // false或为空都不用执行
        isHidden = parse.smartEsValue(propItem.__rawHidden, parseSources);

        if (propItem.hidden != isHidden) {
          propItem.hidden = isHidden;
        }
      }
    }
  },

  __esParseComponent(component, parseSources) {
    // console.log(1);
    // return true;
    // var test = 1;
    // if (true) {
    //   for (var i = 0; i < 1000; i++) {
    //     test = i;
    //   }
    // }
    // return test;

    var text;

    if (component.__rawProps) {
      var curProps = component.props;
      var rawProps = component.__rawProps;
      for (var key in rawProps) {
        // if (parse.isEsScript(rawProps[key])) {
        text = parse.smartEsValue(rawProps[key], parseSources);
        // } else {
        //   text = rawProps[key];
        // }
        if (curProps[key] !== text) {
          curProps[key] = text;
        }
      }
    }

    // console.log("component.__rawText：", component.__rawText);
    if (component.__rawText) {
      // console.log(123);
      text = parse.smartEsValue(component.__rawText, parseSources);
      if (text !== component.text) {
        component.text = text;
      }
    }
  },

  /**
   *
   * @param {*} propItem
   * @param {*} groups
   * @param {*} baseParseSources {global: globalData, rootData: formData, rootSchema: rootSchema}
   */
  isGroupHidden(propItem, groups, baseParseSources) {
    var result = false;
    for (var i = 0; i < groups.length; i++) {
      var fieldKeyName = groups[i];
      var propSchema = propItem.properties[fieldKeyName];
      if (
        !propSchema.layout ||
        propSchema.layout.name !== constant.LAYOUT_SPACE
      ) {
        var parseSources = Object.assign({}, baseParseSources);
        parseSources.index = propSchema.__index;
        parseSources.idxChain = propSchema.__idxChain;

        result = parse.smartEsValue(propSchema.__rawHidden, parseSources);
      } else {
        //占位空间是不可见的
        result = true;
      }
      if (!result) {
        return result;
      }
    }
    return result;
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
  },

  /**
   * 组装平铺数据
   * @param {*} schema // 已经整理过的schema
   * @param {*} value
   */
  perfectTileValue(schema, value) {
    if (schema.autoMatch && value) {
      if (utils.isStr(value)) {
        // 是key
        return this.__perfectTileKey(schema, value);
      } else if (utils.isObj(value)) {
        // 是key-value
        var newValue = {};
        for (var key in value) {
          var seperator = ".";
          var keyPath = this.__perfectTileKey(schema, key);
          if (keyPath.indexOf(seperator) > 0) {
            var paths = keyPath.split(seperator); // 两个
            var firstKey = paths[0];
            var second = paths[1];
            if (newValue[firstKey]) {
              // newValue[firstKey][second] = value[second];
            } else if (utils.isObj(value[firstKey])) {
              // 重复设值
              newValue[firstKey] = value[firstKey];
            } else {
              newValue[firstKey] = {};
            }
            newValue[firstKey][second] = value[second];
          } else {
            newValue[key] = value[key];
          }
        }
        // console.log("newValue: ", newValue);
        return newValue;
      } else {
        return value; // 不知类型，直接返回
      }
    } else {
      return value; // 值不对或不需要自动匹配，直接返回
    }
  },

  __perfectTileKey(schema, keyPath) {
    var seperator = ".";
    var keyArr = keyPath.split(seperator);
    var firstKey = keyArr[0];
    var firstPropSchema = schema.properties;
    for (var key in firstPropSchema) {
      // 第一层的key
      if (key === firstKey) {
        return keyPath;
      }

      var nextSchema = firstPropSchema[key];
      if (nextSchema.properties && !nextSchema.array) {
        var nextPropItem = nextSchema.properties;
        for (var nextKey in nextPropItem) {
          // 第二层的key
          if (nextKey === firstKey) {
            keyArr.unshift(key); // 前面加上第一层的key
            return keyArr.join(seperator);
          }
        }
      }
    }

    // 没有找到，改造后直接返回
    return keyPath;
  },

  /**
   * 把结果数据平铺化
   * @param {*} schema // 已经整理过的schema
   * @param {*} value
   */
  __tileResultValue(schema, value) {
    if (schema.autoMatch) {
      var newValue = {};
      var firstPropSchema = schema.properties;
      for (var key in value) {
        var nextSchema = firstPropSchema[key];
        if (nextSchema.properties && !nextSchema.array) {
          newValue = Object.assign(newValue, value[key]);
        } else {
          newValue[key] = value[key];
        }
      }
      return newValue;
    } else {
      return value;
    }
  }
};

export default formUtils;
