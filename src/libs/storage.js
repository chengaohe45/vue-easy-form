"use strict";

/* -----------------------本地储存模块----------------------------- */
/* 判断是否过期，如果过期则先删除 */
var expiresKey = "__expires__";

var d = new Date().getTime();
for (var key in localStorage) {
  var v = localStorage.getItem(key);
  if (v) {
    try {
      v = window.JSON.parse(v);
    } catch (e) {
      console.warn(v);
    }
    if (
      Object.prototype.toString
        .call(v)
        .toLowerCase()
        .indexOf("array") > 0
    ) {
      var expires = v[0] && v[0][expiresKey];
      if (expires && /^\d{13,}$/.test(expires) && expires <= d)
        localStorage.removeItem(key);
    }
  }
}

var storage = {
  /**
   * 保存值到本地存储
   * @method set
   * @param {String} key  需要保存的键名
   * @param {Object|String|Array|Boolean} value  需要保存的值
   * @param {Number} expires 存储的过期时间 单位：秒
   */
  set: function(key, value, expires) {
    var v = []; /* 这个数据将记录两个值：第一个值为过期时间，其中0为永久性保存；第二个值为用户需要保存的值 */
    var expiresObj = {};
    if (expires && typeof expires === "number") {
      var d = new Date().getTime();
      expiresObj[expiresKey] = d + expires * 1000;
    } else {
      expiresObj[expiresKey] = 0; /* 0 代表永久性保存  */
    }
    v.push(expiresObj);
    v.push(value);
    localStorage.setItem(key, window.JSON.stringify(v));
  },
  /**
   * 需要获取的本地存储
   * @method get
   * @param  {String} key 对应的key
   * @return {Object|String|Array|Boolean}  返回值
   */
  get: function(key, defaultValue = "") {
    var value = localStorage.getItem(key);
    if (value === null || value === undefined) {
      value = defaultValue;
      return value;
    }

    try {
      value = window.JSON.parse(value);
    } catch (e) {
      return value; /* 防止以前的写法：没有经过window.JSON.stringify对setItem的值进行处理 */
    }

    if (typeof value !== "object") {
      return value;
    }

    var expires = value[0] && value[0][expiresKey];
    if (typeof expires === "number") {
      /* 现在的写法 */
      if (expires && /^\d{13,}$/.test(expires)) {
        var d = new Date().getTime();
        if (expires <= d) {
          localStorage.removeItem(key);
          return defaultValue;
        }
      }
      return value[1];
    } else {
      /* 为了兼容之前的业务，这样写不是现在的格式所以直接返回以前的值 */
      return value;
    }
  },
  /**
   * 删除一个本地存储
   * @method remove
   * @param  {String} key 需要删除的key
   */
  remove: function(key) {
    localStorage.removeItem(key);
  }
};

export default storage;
