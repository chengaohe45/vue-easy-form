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
          this.resetIndexArr(
            propItem,
            propItem.__info.idxChain,
            propItem.__info.pathKey
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
        tmpValue = this.getFormatValue(propItem.format, value, true);
        // console.log(tmpValue, value);
      } else {
        tmpValue = value;
      }
      propItem.component.value = tmpValue;
    } else if (propItem.properties) {
      if (utils.isObj(value)) {
        for (var key in propItem.properties) {
          if (value.hasOwnProperty(key)) {
            this.__setValue(
              propItem.properties[key],
              value[key],
              hasIdxChainChanged
            );
          }
        }
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
      "__creatable",
      "label",
      "title",
      "isTmp"
    ];
    for (var key in schema) {
      if (!excludeKeys.includes(key)) {
        newItem[key] = utils.deepCopy(schema[key]);
      }
    }

    if (newItem.hasOwnProperty("__invalidMsg")) {
      newItem.__invalidMsg = false;
    }

    if (!utils.isUndef(schema.array.subLabel)) {
      newItem.subLabel = utils.deepCopy(schema.array.subLabel);
      // newItem.__invalidMsg = false;
    }

    // console.log("schema.layout.name == constant.LAYOUT_TABS：", schema.layout.name == constant.LAYOUT_TABS);
    if (schema.layout && schema.layout.name == constant.LAYOUT_TABS) {
      newItem.__tabsIndex = false;
    }

    // newItem.array不可有此值
    if (newItem.array) {
      newItem.array = false;
    }

    // 取出delMsg给每一项
    newItem.delMsg = utils.deepCopy(schema.array.delMsg);
    newItem.delWarnBtns = utils.deepCopy(schema.array.delWarnBtns);

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

      if (propItem.__info.idxChain != idxChain) {
        propItem.__info.idxChain = idxChain;
      }
      if (propItem.__info.pathKey != pathKey) {
        propItem.__info.pathKey = pathKey;
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
      if (propItem.__info.idxChain != idxChain) {
        propItem.__info.idxChain = idxChain;
      }
      if (propItem.__info.pathKey != pathKey) {
        propItem.__info.pathKey = pathKey;
      }

      if (propItem.__info.index != currentIndex) {
        propItem.__info.index = currentIndex;
      }
    } else if (propItem.properties) {
      if (propItem.__info.idxChain != idxChain) {
        propItem.__info.idxChain = idxChain;
      }

      if (propItem.__info.pathKey != pathKey) {
        propItem.__info.pathKey = pathKey;
      }

      if (propItem.__info.index != currentIndex) {
        propItem.__info.index = currentIndex;
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
      if (propItem.__info.idxChain != idxChain) {
        propItem.__info.idxChain = idxChain;
      }
      if (propItem.__info.pathKey != pathKey) {
        propItem.__info.pathKey = pathKey;
      }

      if (propItem.__info.index != currentIndex) {
        propItem.__info.index = currentIndex;
      }
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
          targetSchema.component.value = tmpValue;
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
   * 指定某一个属性进行清除
   * @param {Object} schema
   * @param {String} pathKey "age、more1[0].name"
   * @param {Boolean} clearNext 是否清除子级及以下
   */
  clearErrMsgByKey: function(schema, pathKey, clearNext) {
    var targetSchema = this.__getSchemaByKey(schema, pathKey);
    if (targetSchema) {
      if (!clearNext) {
        if (targetSchema.__invalidMsg) {
          targetSchema.__invalidMsg = false;
        }

        if (targetSchema.__hasError) {
          targetSchema.__hasError = false;
        }
      } else {
        // 清除自已和所有的后代
        this.clearErrMsg(targetSchema);
      }
    } else {
      // 路径不对或没有错误信息：不用理会
    }
  },

  /**
   * 清除当前propItem
   * @param {*} propItem
   */
  clearErrMsg: function(propItem) {
    // 无论是哪一种，统一判断
    if (propItem.__invalidMsg) {
      propItem.__invalidMsg = false;
    }

    if (propItem.__hasError) {
      propItem.__hasError = false;
    }

    // 是数组，清空数组
    if (propItem.array) {
      var schemaList = propItem.__propSchemaList || [];
      schemaList.forEach(schema => {
        this.clearErrMsg(schema);
      });
    }

    // 不是数据组了
    if (propItem.component) {
      // ...
    } else if (propItem.properties) {
      for (var key in propItem.properties) {
        // 清除下一级
        this.clearErrMsg(propItem.properties[key]);
      }
    } else {
      //可能是占位对象
    }
  },

  /**
   * 表单内部的结果
   */
  getValue: function(propItem) {
    return this.__getValue(propItem);
  },

  /**
   * 表单的最终结果(也就是表单值，非根值)
   * @param {*} schema  perfect后的schema
   * @param {*} baseParseSources {global: globalData, rootData: formData, rootSchema: rootSchema}
   * @param {*} globalData 表单的全局数据
   * @param {*} formData 表单的内部值
   */
  getFormValue(schema, baseParseSources) {
    if (utils.isObj(baseParseSources.rootData)) {
      var resultValue = this.__getValue(schema, baseParseSources);
      return this.__tileResultValue(schema, resultValue);
    } else {
      throw "getFormValue： formData 必须是一个对象";
    }
  },

  /**
   * 取值
   * @param {*} propItem
   * @param {*} baseParseSources {global: globalData, rootData: formData(此时这个值不一定有传，没有传时说明是取表单内部传, 有传就取最终结果), rootSchema: rootSchema}
   * @param {*} isParentHidden
   * 当formData有值时，则取出的是表单用户值，propItem也就是rootSchema，此时rootSchema最外部是不能隐藏的
   */
  __getValue: function(
    propItem,
    baseParseSources = {},
    isParentHidden = false
  ) {
    var parseSources = Object.assign({}, baseParseSources);
    parseSources.index = propItem.__info.index;
    parseSources.idxChain = propItem.__info.idxChain;
    parseSources.pathKey = propItem.__info.pathKey;

    var formData = baseParseSources.rootData;

    // 当false没有值时，证明是表单的内容取值，后不的解析不用执行，提高效率
    // formData有值，说明propItem.hidden都是已经出来的了，不做es转换，省资源
    var isHidden =
      formData && (isParentHidden || propItem.hidden) ? true : false;

    var newValue, keyValue, newArr, i, schemaList;

    if (propItem.component) {
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
            return this.getFormatValue(
              propItem.format,
              propItem.component.value,
              false
            );
          } else {
            return propItem.component.value;
          }
        } else {
          // form 内部取值
          return propItem.component.value;
        }
      }
    } else if (propItem.properties) {
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
          var nextPropItem = propItem.properties[key];

          // 占位空间，不需要取出；往下取
          if (
            nextPropItem.layout &&
            nextPropItem.layout.name === constant.LAYOUT_SPACE
          ) {
            continue;
          } else if (formData && nextPropItem.isTmp) {
            // 是取表单数据且是临时值
            continue;
          }

          var isNextHidden =
            formData && (isHidden || nextPropItem.hidden) ? true : false;
          // console.log("isNextHidden...: ", isNextHidden);
          if (!isNextHidden) {
            // 取表单内部值或用户数据时不隐藏
            keyValue = this.__getValue(
              nextPropItem,
              baseParseSources,
              isHidden
            );
            newValue[key] = keyValue;
          } else {
            // 说明是取表单用户数据且隐藏
            if (utils.isUndef(nextPropItem.hdValue)) {
              // ...说明是不取出
            } else if (!utils.isNull(nextPropItem.hdValue)) {
              // ...直接返回
              if (nextPropItem.format) {
                // 不是最终取值，或没有格式转换
                newValue[key] = this.getFormatValue(
                  nextPropItem.format,
                  nextPropItem.hdValue,
                  false
                );
              } else {
                newValue[key] = nextPropItem.hdValue;
              }
            } else {
              // 剩下null, 说明是取原始值，是什么是就什么
              keyValue = this.__getValue(
                nextPropItem,
                baseParseSources,
                isHidden
              );
              newValue[key] = keyValue;
            }
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
    var isHidden, listLen, schemaList, i;

    var parseSources = Object.assign({}, baseParseSources);
    parseSources.index = propItem.__info.index;
    parseSources.idxChain = propItem.__info.idxChain;
    parseSources.pathKey = propItem.__info.pathKey;

    if (propItem.component) {
      if (propItem.__rawHidden) {
        // false或为空都不用执行
        isHidden = parse.smartEsValue(propItem.__rawHidden, parseSources);

        if (propItem.hidden != isHidden) {
          propItem.hidden = isHidden;
        }
      }

      if (
        propItem.hasOwnProperty("__creatable") &&
        !propItem.hidden &&
        !propItem.__creatable
      ) {
        // 只有false时才可修改
        propItem.__creatable = true;
      }

      if (propItem.label) {
        // 解析组件内的属性
        this.__esParseComponent(propItem.label, parseSources);
        if (propItem.label.help) {
          // 解析组件内的属性
          this.__esParseComponent(propItem.label.help, parseSources);
        }
      }

      if (propItem.desc) {
        // 解析组件内的属性
        this.__esParseComponent(propItem.desc, parseSources);
      }

      if (propItem.unit) {
        // 解析组件内的属性
        this.__esParseComponent(propItem.unit, parseSources);
      }

      if (propItem.help) {
        // 解析组件内的属性
        this.__esParseComponent(propItem.help, parseSources);
      }

      if (propItem.subLabel) {
        // 解析组件内的属性
        this.__esParseComponent(propItem.subLabel, parseSources);
      }

      if (propItem.delMsg) {
        // 解析数组组件内的属性
        this.__esParseComponent(propItem.delMsg, parseSources);
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

        if (propItem.array.rules) {
          this.__esParseRules(propItem.array.rules, parseSources);
        }

        if (propItem.array.delAllMsg) {
          this.__esParseComponent(propItem.array.delAllMsg, parseSources);
        }
      } else {
        /* 一般组件 */
        if (propItem.rules) {
          this.__esParseRules(propItem.rules, parseSources);
        }

        // 解析组件内的属性
        this.__esParseComponent(propItem.component, parseSources);
      }
    } else if (propItem.properties) {
      if (propItem.__rawHidden) {
        // false或为空都不用执行
        isHidden = parse.smartEsValue(propItem.__rawHidden, parseSources);

        if (propItem.hidden != isHidden) {
          propItem.hidden = isHidden;
        }
      }

      if (
        propItem.hasOwnProperty("__creatable") &&
        !propItem.hidden &&
        !propItem.__creatable
      ) {
        // 只有false时才可修改
        propItem.__creatable = true;
      }

      if (propItem.title) {
        // 解析组件内的属性
        this.__esParseComponent(propItem.title, parseSources);

        if (propItem.title.help) {
          // 解析组件内的属性
          this.__esParseComponent(propItem.title.help, parseSources);
        }
      }

      if (propItem.label) {
        // 解析组件内的属性
        this.__esParseComponent(propItem.label, parseSources);

        if (propItem.label.help) {
          // 解析组件内的属性
          this.__esParseComponent(propItem.label.help, parseSources);
        }
      }

      if (propItem.desc) {
        // 解析组件内的属性
        this.__esParseComponent(propItem.desc, parseSources);
      }

      if (propItem.unit) {
        // 解析组件内的属性
        this.__esParseComponent(propItem.unit, parseSources);
      }

      if (propItem.help) {
        // 解析组件内的属性
        this.__esParseComponent(propItem.help, parseSources);
      }

      if (propItem.subLabel) {
        // 解析组件内的属性
        this.__esParseComponent(propItem.subLabel, parseSources);
      }

      if (propItem.delMsg) {
        // 解析数组组件内的属性
        this.__esParseComponent(propItem.delMsg, parseSources);
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

        if (propItem.array.rules) {
          this.__esParseRules(propItem.array.rules, parseSources);
        }

        if (propItem.array.delAllMsg) {
          this.__esParseComponent(propItem.array.delAllMsg, parseSources);
        }
      } else {
        var nextPropItem, key;
        if (propItem.layout && propItem.layout.name == constant.LAYOUT_TABS) {
          // 是普通tabs
          for (key in propItem.properties) {
            nextPropItem = propItem.properties[key];
            if (!nextPropItem.__style) {
              this.__updatePropStyle(nextPropItem, undefined, nextPropItem.col);
            }
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
          var hasCustomWidth = propItem.__hasCustomWidth;
          for (key in propItem.properties) {
            nextPropItem = propItem.properties[key];
            var hasRowSpaceChanged = false;
            var currentCol;
            if (!hasCustomWidth) {
              if (nextPropItem.__groups) {
                //是一个组
                isHidden = this.__isGroupHidden(
                  propItem,
                  nextPropItem.__groups,
                  baseParseSources
                );
                // console.log("isHidden: " + isHidden);
                if (!isHidden) {
                  //组不隐藏

                  sum += nextPropItem.__groupCol;
                  if (sum <= constant.UI_MAX_COL) {
                    //还在第一行
                    newRowSpace = 0;
                  } else {
                    newRowSpace = nextPropItem.__rawRowSpace;
                  }
                  if (
                    !nextPropItem.__style ||
                    nextPropItem.rowSpace != newRowSpace
                  ) {
                    //还原
                    nextPropItem.rowSpace = newRowSpace;
                    hasRowSpaceChanged = true;
                    currentCol = nextPropItem.__groupCol;
                  }
                } else {
                  //不必理会
                }

                if (nextPropItem.__hiddenGroup != isHidden) {
                  nextPropItem.__hiddenGroup = isHidden;
                }
              } else if (nextPropItem.__inGroups) {
                //组内成员
                if (!nextPropItem.__style || nextPropItem.rowSpace != 0) {
                  nextPropItem.rowSpace = 0;
                  hasRowSpaceChanged = true;
                  currentCol = nextPropItem.col;
                }
              } else {
                //正常成员
                var nextParseSources = Object.assign({}, baseParseSources);
                nextParseSources.index = nextPropItem.__info.index;
                nextParseSources.idxChain = nextPropItem.__info.idxChain;
                nextParseSources.pathKey = nextPropItem.__info.pathKey;

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
                  if (
                    !nextPropItem.__style ||
                    nextPropItem.rowSpace != newRowSpace
                  ) {
                    //还原
                    nextPropItem.rowSpace = newRowSpace;
                    hasRowSpaceChanged = true;
                    currentCol = nextPropItem.col;
                  }
                } else {
                  //不必理会
                }
              }
              if (hasRowSpaceChanged) {
                this.__updatePropStyle(
                  nextPropItem,
                  nextPropItem.rowSpace,
                  currentCol
                );
              }
            } else {
              if (nextPropItem.__groups) {
                //是一个组
                isHidden = this.__isGroupHidden(
                  propItem,
                  nextPropItem.__groups,
                  baseParseSources
                );
                // console.log("isHidden: " + isHidden);
                if (!isHidden) {
                  //组不隐藏
                  if (!nextPropItem.__style) {
                    this.__updatePropStyle(
                      nextPropItem,
                      nextPropItem.rowSpace,
                      nextPropItem.__groupCol
                    );
                  }
                } else {
                  //不必理会
                }

                if (nextPropItem.__hiddenGroup != isHidden) {
                  nextPropItem.__hiddenGroup = isHidden;
                }
              } else if (nextPropItem.__inGroups) {
                //组内成员
                if (!nextPropItem.__style) {
                  this.__updatePropStyle(nextPropItem, 0, nextPropItem.col);
                }
              } else {
                //正常成员
                if (!nextPropItem.__style) {
                  this.__updatePropStyle(
                    nextPropItem,
                    nextPropItem.rowSpace,
                    nextPropItem.col
                  );
                }
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

      if (
        propItem.hasOwnProperty("__creatable") &&
        !propItem.hidden &&
        !propItem.__creatable
      ) {
        // 只有false时才可修改
        propItem.__creatable = true;
      }
    }
  },

  __updatePropStyle(propItem, rowSpace, col) {
    console.log("col", col);
    var style = {
      // marginTop: rowSpace + "px",
      paddingLeft: propItem.offsetLeft + "px",
      paddingRight: propItem.offsetRight + "px"
    };
    if (rowSpace) {
      style.marginTop = rowSpace + "px";
    }
    if (utils.isNum(col)) {
      var width = Math.floor((col * 10000) / constant.UI_MAX_COL) / 100;
      width += "%";
      style.width = width;
    } else {
      style = Object.assign(style, col);
    }
    propItem.__style = style;
  },

  /**
   * 运行时解析组件：比如label, desc, component, help, title, unit
   * @param {*} component
   * @param {*} parseSources
   */
  __esParseComponent(component, parseSources) {
    var isHidden, text, style, className, value;

    if (component.hasOwnProperty("__refreshIndex")) {
      component.__refreshIndex++;
      if (component.__refreshIndex > 10000) {
        component.__refreshIndex = 1;
      }
    }
    // 项组件是没有此值的
    if (component.__rawHidden) {
      isHidden = parse.smartEsValue(component.__rawHidden, parseSources);
      if (component.hidden != isHidden) {
        component.hidden = isHidden;
      }
    }

    // 正常组件：有以下属性要解析
    if (component.name) {
      // 解析属性
      if (component.__rawProps) {
        var curProps = component.props;
        var rawProps = component.__rawProps;
        var staticPropNames = component.__staticPropNames;
        staticPropNames = staticPropNames ? staticPropNames : [];
        for (var key in rawProps) {
          if (!staticPropNames.includes(key)) {
            text = parse.smartEsValue(rawProps[key], parseSources);
          } else {
            text = rawProps[key];
          }
          if (curProps[key] !== text) {
            curProps[key] = text;
          }
        }
      }

      // 解析指令
      if (component.__rawDirectives) {
        var curDirectives = component.directives;
        var rawDirectives = component.__rawDirectives;
        for (var i = 0; i < rawDirectives.length; i++) {
          var rawDirective = rawDirectives[i];
          value = parse.smartEsValue(rawDirective.value, parseSources);
          if (value !== curDirectives[i].value) {
            curDirectives[i].value = value;
          }
        }
      }

      // 解析style
      if (component.__rawStyle) {
        style = parse.smartEsValue(component.__rawStyle, parseSources);
        if (style !== component.style) {
          component.style = style;
        }
      }

      // 解析class
      if (component.__rawClass) {
        className = parse.smartEsValue(component.__rawClass, parseSources);
        if (className !== component.class) {
          component.class = className;
        }
      }

      // 有name, toComText解析text
      if (component.__rawText) {
        text = parse.smartEsValue(component.__rawText, parseSources);
        text = utils.toComText(text);
        if (text !== component.text) {
          component.text = text;
        }
      }

      // 解析scopedSlots
      if (component.scopedSlots) {
        var scopedSlots = component.scopedSlots;
        for (var slotName in scopedSlots) {
          var values = scopedSlots[slotName];
          if (!utils.isArr(value)) {
            values = [values];
          }
          values.forEach(value => {
            if (!utils.isVNode(value) && utils.isObj(value)) {
              // 是组件，解析
              this.__esParseComponent(value, parseSources);
            }
          });
          values = null;
        }
      }
    } else {
      // 没name, toNormalText解析text
      if (component.__rawText) {
        text = parse.smartEsValue(component.__rawText, parseSources);
        text = utils.toNormalText(text);
        if (text !== component.text) {
          component.text = text;
        }
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
    // console.log("groups: ", groups);
    var result = false;
    for (var i = 0; i < groups.length; i++) {
      var fieldKeyName = groups[i];
      var propSchema = propItem.properties[fieldKeyName];
      if (
        !propSchema.layout ||
        propSchema.layout.name !== constant.LAYOUT_SPACE
      ) {
        var parseSources = Object.assign({}, baseParseSources);
        parseSources.index = propSchema.__info.index;
        parseSources.idxChain = propSchema.__info.idxChain;
        parseSources.pathKey = propSchema.__info.pathKey;

        result = parse.smartEsValue(propSchema.__rawHidden, parseSources);
        // console.log("fieldKeyName: " + fieldKeyName, result);
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
   * 运行时解析rules
   * @param {*} rules
   * @param {*} parseSources
   */
  __esParseRules(rules, parseSources) {
    // 是否必须
    if (rules.__rawRequired) {
      var isRequired = parse.smartEsValue(rules.__rawRequired, parseSources);
      if (rules.required != isRequired) {
        rules.required = isRequired;
      }
    }

    // 解析style
    if (rules.__rawStyle) {
      var style = parse.smartEsValue(rules.__rawStyle, parseSources);
      if (style !== rules.style) {
        rules.style = style;
      }
    }

    // 解析class
    if (rules.__rawClass) {
      var className = parse.smartEsValue(rules.__rawClass, parseSources);
      if (className !== rules.class) {
        rules.class = className;
      }
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
