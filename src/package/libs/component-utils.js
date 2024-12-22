/**
 * component-utils.js
 *
 * Copyright (c) 2020 chengaohe All rights reserved.
 *
 * 解析表单所需要的组件
 */

import utils from "./utils";
// import constant from "./constant";
// import { enterSubmit, onlySubmit } from "./submit";
import { isEsOrFunc, newEsFunction } from "../tools/parse";
import global from "./global";
import { parseComponent, createEmptyComponent } from "../tools/component";

("use strict");

/**
 * 解析主组件：如也就是右栏的组件
 */
export function parseMainComponent(propItem, formId, myPathKey) {
  var component = propItem.component;
  var newComponent,
    defaultAlign = false;
  if (utils.isVNode(component)) {
    throw myPathKey + " > 主组件暂不支持直接配置虚拟节点";
  } else if (utils.isObj(component) && Object.keys(component).length > 0) {
    if (!component.name) {
      component = Object.assign({}, component, { name: global.defaultCom }); // 补上组件name
    }
    // console.log("parseMainComponent....", component);
    newComponent = parseComponent(component, false, true);
    // 主组特有配置
    var ref = utils.isStr(component.ref) ? component.ref.trim() : null;
    if (ref) {
      newComponent.ref = ref;
    }

    newComponent.align = parseAlign(component.align, defaultAlign);
    newComponent.flex = parseFlex(component.flex, component.size);
    // value
    if (utils.hasOwn("value", propItem)) {
      newComponent.value = propItem.value;
    } else if (utils.hasOwn("value", component)) {
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
      align: defaultAlign,
      flex: false,
      value: utils.hasOwn("value", propItem)
        ? propItem.value
        : global.defaultCom === component
        ? global.defaultVal
        : undefined
    };
  } else {
    // 要自动补充value
    newComponent = {
      name: global.defaultCom,
      align: defaultAlign,
      flex: false,
      value: global.defaultVal
    };
  }

  newComponent.__formId = formId;

  return newComponent;
}

/**
 * 解析一般属性组件：如label, desc
 */
export function parsePropComponent(
  value,
  formId,
  myPathKey,
  canEmptyText = false
) {
  var tmpValue = value;
  if (utils.isObj(value) && Object.keys(value).length > 0) {
    var name = utils.isStr(value.name) ? value.name.trim() : value.name;
    if (!name) {
      var rawText = value.text;
      if (!utils.isFunc(rawText)) {
        rawText = utils.toNormalText(rawText); // 转换为文本
      }
      if (rawText || canEmptyText) {
        tmpValue = Object.assign({}, value, createEmptyComponent());
      }
    }
  } else if (utils.isNormalText(value)) {
    if (rawText || canEmptyText) {
      tmpValue = createEmptyComponent(utils.toNormalText(value));
    }
  }
  return parseComponent(tmpValue, true, false, myPathKey);
}

/**
 * 提取出class和style
 * @param {*} item
 * @returns {class和style}
 */
export function parseClassStyle(item, needParse = true) {
  var newItem = {};
  if (needParse && isEsOrFunc(item.class)) {
    newItem.class = null;
    newItem.__rawClass = newEsFunction(item.class);
  } else {
    if (item.class) {
      newItem.class = utils.deepCopy(item.class);
    }
  }

  if (needParse && isEsOrFunc(item.style)) {
    newItem.style = null;
    newItem.__rawStyle = newEsFunction(item.style);
  } else {
    if (utils.isObj(item.style) && Object.keys(item.style).length) {
      newItem.style = utils.deepCopy(item.style);
    }
  }
  return newItem;
}

/**
 * 解析项label和项组件的对齐方式
 */
export function parseAlign(align, defaultVal = "left") {
  var aligns = ["left", "center", "right"];
  if (aligns.includes(align)) {
    return align;
  }
  return defaultVal;
}

/**
 * 解析项label和项组件的在弹性布局中的占位情况
 */
export function parseFlex(flex, size) {
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
}
