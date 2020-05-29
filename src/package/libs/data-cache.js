/**
 * data-cache.js
 *
 * Copyright (c) 2020 chengaohe All rights reserved.
 *
 * 用于记录表单数据
 *
 */

// import utils from "./utils";
// import constant from "./constant";

var formDataMap = {};
window.formDataMap = formDataMap;
let dataCache = {
  __getData(formId) {
    if (!formDataMap[formId]) {
      formDataMap[formId] = {};
    }
    return formDataMap[formId];
  },

  getRoot(formId, defaultValue) {
    var data = this.__getData(formId);
    return data.root ? data.root : defaultValue;
  },

  setRoot(formId, value) {
    var data = this.__getData(formId);
    data.root = value;
  },

  getGlobal(formId, defaultValue) {
    var data = this.__getData(formId);
    return data.global ? data.global : defaultValue;
  },

  setGlobal(formId, value) {
    var data = this.__getData(formId);
    data.global = value;
  },

  getHiddenFunc(formId) {
    var data = this.__getData(formId);
    return data.hiddenFunc;
  },

  setHiddenFunc(formId, value) {
    var data = this.__getData(formId);
    data.hiddenFunc = value;
  },

  remove(formId) {
    if (formDataMap.hasOwnProperty(formId)) {
      formDataMap[formId].hiddenFunc = null;
      delete formDataMap[formId];
    }
  }
};
window.dataCache = dataCache;

export default dataCache;
