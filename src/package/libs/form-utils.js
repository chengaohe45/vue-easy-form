/**
 * form-utils.js
 *
 * Copyright (c) 2019 chengaohe All rights reserved.
 *
 * 标准化表单schema后：用户操作(如输入，设值等)引起的schema修改
 *
 */
import parse from "./parse";
import constant from "./constant";
import utils from "./utils";

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
    this.__setValue(propItem, value);
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
            this.addArrayItem(propItem);
          }
          hasChanged = true;
        }
        var hasNextIdxChainChanged =
          hasChanged || hasIdxChainChanged ? true : false;
        for (var j = 0; j < value.length; j++) {
          this.__setValue(schemaList[j], value[j], hasNextIdxChainChanged);
        }
        // console.log(120);
        if (hasChanged && !hasIdxChainChanged) {
          this.resetIndexArr(propItem, propItem.__idxChain, propItem.__pathKey);
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
        tmpValue = this.getFormatValue(propItem.format, value, true);
        // console.log(tmpValue, value);
      } else {
        tmpValue = value;
      }
      propItem.value = tmpValue;
    } else if (propItem.properties) {
      for (var key in propItem.properties) {
        !utils.isUndef(value[key]) &&
          this.__setValue(
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
      this.__setValue(newItem, insertInfo.value);
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
        this.resetIndexArr(schemaList[i], nextIdxChain, nextPathKey, i, true);
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
        this.resetIndexArr(
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

  /**
   * 是否正确的tabs索引
   * @param {*} targetSchema
   * @param {*} index
   */
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

  /**
   * 取出指定的schema
   * @param {*} schema
   * @param {*} pathKey
   */
  getSchemaByKey(schema, pathKey) {
    // 这个函数可能对外单独使用，所以不可以使用this
    return this.__getSchemaByKey(schema, pathKey);
  },

  /**
   *
   * @param {*} schema
   * @param {*} pathKey 必须存在键名：如name 或name[0]; 单独[0]是不允许的，会返回false
   */
  __getSchemaByKey(schema, pathKey) {
    if (utils.isStr(pathKey)) {
      if (!pathKey) {
        return schema;
      }
      var seperator = ".";
      var keys = pathKey.split(seperator);
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
      return false; //pathKey不符合要求，退出
    }
  },

  /**
   * 指定某一个属性设置
   * @param {*} schema
   * @param {*} pathKey "age、more1[0].name"
   * @param {*} value
   */
  setValueByKey: function(schema, pathKey, value) {
    // console.log("schema, pathKey: ", schema, pathKey, value);
    var targetSchema = this.__getSchemaByKey(schema, pathKey);
    // console.log("current schema: ", targetSchema);
    if (targetSchema) {
      if (targetSchema.component) {
        if (targetSchema.array) {
          //是组件数组
          if (utils.isArr(value) || utils.isNull(value)) {
            //直接设置array的值
            this.setValue(targetSchema, value ? value : []);
          }
        } else {
          var tmpValue;
          if (targetSchema.format) {
            // 不是最终取值，或没有格式转换
            tmpValue = this.getFormatValue(targetSchema.format, value, true);
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
            this.setValue(targetSchema, value ? value : []);
          }
        } else {
          // properties赋值
          if (utils.isObj(value)) {
            this.setValue(targetSchema, value);
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
    return this.__getValue(propItem);
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
      var resultValue = this.__getValue(schema, baseParseSources);
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
    parseSources.pathKey = propItem.__pathKey;

    var formData = baseParseSources.rootData;

    // 当false没有值时，证明是表单的内容取值，后不的解析不用执行，提高效率
    // formData有值，说明propItem.hidden都是已经出来的了，不做es转换，省资源
    var isHidden =
      formData && (isParentHidden || propItem.hidden) ? true : false;

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
          newValue = this.__getValue(schemaList[i], baseParseSources, isHidden);
          newArr.push(newValue);
        }
        return newArr;
      } else {
        // 不是数组
        if (formData) {
          if (propItem.format) {
            // 不是最终取值，或没有格式转换
            return this.getFormatValue(propItem.format, propItem.value, false);
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
          newValue = this.__getValue(schemaList[i], baseParseSources, isHidden);
          newArr.push(newValue);
        }
        return newArr;
      } else {
        newValue = {};
        for (var key in propItem.properties) {
          keyValue = this.__getValue(
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
  getFormatValue: function(format, curVal, outerToInner = true) {
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
          this.clearErrorMsg(schemaList[i]);
        }
      } else {
        for (var key in propItem.properties) {
          this.clearErrorMsg(propItem.properties[key]);
        }
      }
    } else {
      // return undefined;
    }
  },

  /**
   * 根据formData, 分析界面的情况。现主要是解析第一行的情况和hidden, required
   * @param {*} schema
   * @param {*} baseParseSources {global: globalData, rootData: formData, rootSchema: rootSchema, isHidden: }
   * @param {*} formData
   * @param {*} rootSchema
   */
  analyzeUiProps(propItem, baseParseSources) {
    var sum = 0;
    var isHidden, isRequired, text, listLen, schemaList, i;

    var parseSources = Object.assign({}, baseParseSources);
    parseSources.index = propItem.__index;
    parseSources.idxChain = propItem.__idxChain;
    parseSources.pathKey = propItem.__pathKey;

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
          this.analyzeUiProps(schemaList[i], baseParseSources);
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
          this.analyzeUiProps(schemaList[i], baseParseSources);
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
            this.analyzeUiProps(nextPropItem, baseParseSources);
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
          var newRowSpace;
          for (key in propItem.properties) {
            nextPropItem = propItem.properties[key];
            if (nextPropItem.__groups) {
              //是一个组
              isHidden = this.__isGroupHidden(
                propItem,
                nextPropItem.__groups,
                baseParseSources
              );
              if (!isHidden) {
                //组不隐藏

                sum += nextPropItem.__groupCol;
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
              nextParseSources.pathKey = nextPropItem.__pathKey;

              isHidden = parse.smartEsValue(
                nextPropItem.__rawHidden,
                nextParseSources
              );
              // console.log(nextPropItem.col, isHidden);
              if (!isHidden) {
                sum += nextPropItem.col;
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
            this.analyzeUiProps(nextPropItem, baseParseSources);
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
    var text;

    if (component.__rawProps) {
      var curProps = component.props;
      var rawProps = component.__rawProps;
      for (var key in rawProps) {
        text = parse.smartEsValue(rawProps[key], parseSources);
        if (curProps[key] !== text) {
          curProps[key] = text;
        }
      }
    }

    if (component.__rawText) {
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
  __isGroupHidden(propItem, groups, baseParseSources) {
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
        parseSources.pathKey = propSchema.__pathKey;

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
