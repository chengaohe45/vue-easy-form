/**
 * tabs-observer.js
 *
 * Copyright (c) 2019 chengaohe All rights reserved.
 *
 * 用于监听tabs的变化: 这样做的目标是使所有的tabs都来自同上个监听
 *
 */

import utils from "./utils";

let tabsObserver = {
  __INTERVAL: 50,
  __listeners: [],
  __observer: null,
  __resizeWinHandler: null,
  __throttleTimer: null,

  /**
   * 移除某个监听
   * @param {*} callback
   */
  add(callback) {
    if (utils.isFunc(callback)) {
      if (this.__listeners.length <= 0) {
        this.__listeners.push(callback);
        this.__start();
      } else if (!this.__listeners.includes(callback)) {
        this.__listeners.push(callback);
      }
    } else {
      console.warn("tabsObserver.add(callback)中callback不是一个函数");
    }
  },

  /**
   * 移除某个监听
   * @param {*} callback
   */
  remove(callback) {
    var index = this.__listeners.indexOf(callback);
    if (index >= 0) {
      this.__listeners.splice(index, 1);
      if (this.__listeners.length <= 0) {
        this.__stop();
      }
    }
  },

  /**
   * 窗体改变时执行回调：当是resize时entries为undefined
   */
  __observerHandler(entries) {
    this.__listeners.forEach(cbItem => {
      cbItem(entries);
    });
  },

  /**
   * 启动监听
   */
  __start() {
    if (this.__observer) {
      return true;
      // 已经存在，不用重构
    }

    // console.log("start...");

    this.__resizeWinHandler = () => {
      if (!this.__throttleTimer)
        this.__throttleTimer = setTimeout(() => {
          this.__throttleTimer = null;
          this.__observerHandler();
        }, this.__INTERVAL);
    };

    window.addEventListener("resize", this.__resizeWinHandler, true);

    let MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver;

    this.__observer = new MutationObserver(entries => {
      this.__observerHandler(entries);
    });

    this.__observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
  },

  /**
   * 停止监听
   */
  __stop() {
    // console.log("stop...");
    if (this.__observer) {
      this.__observer.disconnect();
      this.__observer.takeRecords();
      this.__observer = null;
    }

    if (this.__resizeWinHandler) {
      window.removeEventListener("resize", this.__resizeWinHandler, true);
      this.__resizeWinHandler = null;
    }

    if (this.__throttleTimer) {
      clearTimeout(this.__throttleTimer);
      this.__throttleTimer = null;
    }
  }
};

export default tabsObserver;
