/**
 * base.js
 *
 * Copyright (c) 2024 chengaohe All rights reserved.
 *
 * 无缝对接vue组件
 *
 */

// import _uniq from "lodash-es/uniq";
import constant from "./libs/constant.js";
import utils from "./libs/utils.js";

// 此四个常量已经对外，不可随便改
export const KEY_GLOBAL = "global"; // 直接从表单组件（root）中取出
export const KEY_ROOT_DATA = "rootData"; // 直接从表单组件（root）中取出
export const KEY_ROOT = "root"; // 直接从表单组件（root）中取出
export const KEY_HIDDEN = "isHidden"; // 直接从表单组件（root）中取出
export const KEY_INDEX = "index";
export const KEY_IDX_CHAIN = "idxChain";
export const KEY_PATH_KEY = "pathKey";
export const KEY_PARENT_VALUE = "parent"; // 最近一个对象数据（也就是最后一个数组对应的数据）
export const KEY_CURRENT_VALUE = "value"; // 当前表单主组件的数据

/**
 *
 * @param {*} obj
 * @param {*} key
 * @param {*} vm
 * @param {*} schemaInfo schema 必带__info
 */
function defineProperty(obj, key, vm, schemaInfo) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      var rootInstance, value;
      switch (key) {
        case KEY_ROOT_DATA:
        case KEY_ROOT:
          rootInstance = utils.getParent(vm, constant.ES_FORM_ROOT_NAME);
          value = rootInstance[constant.USER_ROOT_DATA];
          break;

        case KEY_GLOBAL:
          rootInstance = utils.getParent(vm, constant.ES_FORM_ROOT_NAME);
          value = rootInstance[key];
          break;
        case KEY_HIDDEN:
          rootInstance = utils.getParent(vm, constant.ES_FORM_ROOT_NAME);
          value = rootInstance[constant.USER_HIDDEN];
          break;
        case KEY_INDEX:
          value = schemaInfo[key];
          break;
        case KEY_IDX_CHAIN:
        case KEY_PATH_KEY:
          value = schemaInfo[key] || "";
          break;
        case KEY_PARENT_VALUE:
        case KEY_CURRENT_VALUE:
          rootInstance = utils.getParent(vm, constant.ES_FORM_ROOT_NAME);
          var userValue = rootInstance[constant.USER_ROOT_DATA];
          var pathKey = schemaInfo[KEY_PATH_KEY] || "";
          if (pathKey) {
            var splitKeys = utils.parsePathKeys(pathKey);
            if (key === KEY_PARENT_VALUE) {
              // 判断是否是数组: 这样判断是因为key是不可以数字，若相同必为数组
              if (splitKeys[splitKeys.length - 1] === schemaInfo.index + "") {
                // 数组
                splitKeys = splitKeys.slice(0, splitKeys.length - 2);
              } else {
                splitKeys = splitKeys.slice(0, splitKeys.length - 1);
              }
            }
            var currentValue = userValue;
            for (var keyIndex = 0; keyIndex < splitKeys.length; ++keyIndex) {
              if (currentValue) {
                currentValue = currentValue[splitKeys[keyIndex]];
              } else {
                return undefined;
              }
            }
            return currentValue;
          } else {
            return userValue;
          }
        // break;
        default:
          value = vm[key];
          break;
      }
      return value;
    }
  });
}

export function createParseDep(vm, schemaInfo) {
  var parseSources = {
    config: {},
    event: undefined
  };
  defineProperty(parseSources, KEY_GLOBAL, vm, schemaInfo);
  defineProperty(parseSources, KEY_INDEX, vm, schemaInfo);
  defineProperty(parseSources, KEY_IDX_CHAIN, vm, schemaInfo);
  defineProperty(parseSources, KEY_PATH_KEY, vm, schemaInfo);
  defineProperty(parseSources, KEY_HIDDEN, vm, schemaInfo);
  defineProperty(parseSources, KEY_ROOT_DATA, vm, schemaInfo);
  defineProperty(parseSources, KEY_ROOT, vm, schemaInfo);
  defineProperty(parseSources, KEY_PARENT_VALUE, vm, schemaInfo);
  defineProperty(parseSources, KEY_CURRENT_VALUE, vm, schemaInfo);
  return parseSources;
}
