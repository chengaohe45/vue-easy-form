let utils = {
  /**
   * [trim 删除字符左右两的字符：默认为空格和换行符]
   * @param  {[String]} value [description]
   * @param  {[type]} reg   [description]
   * @return {[type]}       [description]
   */
  trim: function(value, reg) {
    var tmpValue = value + "";
    reg = reg ? reg : /^(\s|\r|\n|\t)+|(\s|\r|\n|\t)+$/g; //不传就直接删除前后的空格，换行； 若是只删空格就这样：/^\s+|\s+$/g
    return tmpValue.replace(reg, "");
  },

  type: function(obj) {
    var toString = Object.prototype.toString;
    var map = {
      "[object Boolean]": "boolean",
      "[object Number]": "number",
      "[object String]": "string",
      "[object Function]": "function",
      "[object Array]": "array",
      "[object Date]": "date",
      "[object RegExp]": "regExp",
      "[object Undefined]": "undefined",
      "[object Null]": "null",
      "[object Object]": "object"
    };

    var value = map[toString.call(obj)];
    if (!value) {
      //不是基本类型
      if (obj instanceof Element) {
        //dom节点，
        return "element";
      }
    }
    return value;
  },

  isBool(value) {
    return utils.type(value) === "boolean";
  },

  isNum(value) {
    return utils.type(value) === "number";
  },

  isStr(value) {
    return utils.type(value) === "string";
  },

  isFunc(value) {
    return utils.type(value) === "function";
  },

  isArr(value) {
    return utils.type(value) === "array";
  },

  isDate(value) {
    return utils.type(value) === "date";
  },

  isReg(value) {
    return utils.type(value) === "regExp";
  },

  isUndef(value) {
    return utils.type(value) === "undefined";
  },

  isNull(value) {
    return utils.type(value) === "null";
  },

  isObj(value) {
    return utils.type(value) === "object";
  },

  /**
   * [deepCopy 深拷贝, 深拷贝的数据是object和array]
   * @param  {[type]} data [description]
   * @return {[type]}   [description]
   */
  deepCopy: function(data) {
    var rawRefs = [];
    var newRefs = [];
    var newData = this.__deepCopy(data, rawRefs, newRefs);
    rawRefs = null;
    newRefs = null;
    return newData;
  },

  /**
   * [deepCopy 深拷贝, 深拷贝的数据是object和array]
   * @param  {[type]} data [description]
   * @return {[Array]}   [rawRefs] 记录原始的object and array
   * @return {[Array]}   [newRefs] 记录新的object and array
   * rawRefs和newRefs是一对一的关系，作用防止数据中某个地方存在循环的问题
   */
  __deepCopy: function(data, rawRefs, newRefs) {
    var type = utils.type(data);
    var newData, rawIndex;
    if (type == "array") {
      rawIndex = rawRefs.indexOf(data);
      if (rawIndex < 0) {
        newData = [];

        // 一对一保存; 先保存索引地址，下一级的deep可能会用到
        rawRefs.push(data);
        newRefs.push(newData);

        for (var i = 0; i < data.length; ++i) {
          newData[i] = this.__deepCopy(data[i], rawRefs, newRefs);
        }

        return newData;
      } else {
        // 已经存在的数据，则取出上个拷贝的数组
        return newRefs[rawIndex];
      }
    } else if (type === "object") {
      rawIndex = rawRefs.indexOf(data);
      if (rawIndex < 0) {
        newData = {};

        // 一对一保存; 先保存索引地址，下一级的deep可能会用到
        rawRefs.push(data);
        newRefs.push(newData);

        for (var key in data) {
          newData[key] = this.__deepCopy(data[key], rawRefs, newRefs);
        }
        return newData;
      } else {
        // 已经存在的数据，则取出上个拷贝的对象
        return newRefs[rawIndex];
      }
    } else {
      return data;
    }
  },

  /* 判断路径是否动态路径(vue-router) */
  isDynaPath(path) {
    return path && path.indexOf("/:") >= 0;
  },

  /**
   * [offsetBit 补位，最小多少位，不够就补]
   * @param  {[String or Number]} value      [description]
   * @param  {[Number]} total      [共多少位]
   * @param  {[String]} offsetChar [需求补在前面的字符，单个字符]
   * @return {[String]}            [返回 string]
   */
  offsetBit(value, total, offsetChar) {
    total = total ? total : 2;
    offsetChar = offsetChar ? offsetChar : "0";
    var tmpValue = value + "";
    if (tmpValue.length < total) {
      for (let i = 0; i < total - tmpValue.length; i++) {
        tmpValue = offsetChar + tmpValue;
      }
    }
    return tmpValue;
  },

  extend: function(source1, source2, isDeep) {
    var tmpSource;
    if (isDeep) {
      tmpSource = utils.deepCopy(source1);
    } else {
      tmpSource = source1;
    }
    for (var key in source2) {
      tmpSource[key] = source2[key];
    }
    return tmpSource;
  },

  /**
   * [formatDate 格式化时间 返回符合格式的字符串]
   * @param  {[type]} date [时间]
   * @param  {[type]} type [返回日期还是日期+时间]
   * @return {[type]}      [description]
   */
  formatDate: function(date, type) {
    if (!date) {
      return "";
    }

    if (typeof date !== "string") {
      var year = utils.offsetBit(date.getFullYear(), 2, 0);
      var month = utils.offsetBit(date.getMonth() + 1, 2, 0);
      var dt = utils.offsetBit(date.getDate(), 2, 0);
      var hour = utils.offsetBit(date.getHours(), 2, 0);
      var minute = utils.offsetBit(date.getMinutes(), 2, 0);
      var second = utils.offsetBit(date.getSeconds(), 2, 0);

      var dateStr = year + "-" + month + "-" + dt;
      var timeStr = hour + ":" + minute + ":" + second;
      if (type == "year") {
        return year + "";
      } else if (type == "month") {
        return year + "-" + month;
      } else if (type == "date") {
        return dateStr;
      } else if (type == "time") {
        return timeStr;
      } else {
        return dateStr + " " + timeStr;
      }
    } else {
      return date;
    }
  },

  /**
   * [isMobile 是否手机格式]
   * @param  {[String]}  value [description]
   * @return {Boolean}       [description]
   */
  isMobile: function(value) {
    var reg = /^1[3-9]\d{9}$/;
    if (!reg.test(value)) {
      return false;
    }
    return true;
  },

  /**
   * [isEmail 是否邮件格式]
   * @param  {[String]}  value [description]
   * @return {Boolean}       [description]
   */
  // isEmail: function(value) {
  //   var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  //   if (!reg.test(value)) {
  //     return false;
  //   }
  //   return true;
  // },

  /**
   * [isInt 是否是正数字]
   * @param  {[Number or String]}  value [description]
   * @param  {[Number]}  minNum [最小值，因为这个很常用, 不写就不比较]
   * @return {Boolean}       [description]
   */
  // isInt: function(value, minNum) {
  //   let tmpValue = value + "";
  //   var reg = /^(\-)?\d+$/;
  //   if (!reg.test(tmpValue + "")) {
  //     if (minNum == null) {
  //       return true;
  //     } else {
  //       tmpValue = parseInt(tmpValue);
  //       if (tmpValue >= minNum) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     }
  //   }
  //   return false;
  // },

  /**
   * [isFloat 是否是浮点数]
   * @param  {[Number or String]}  value [description]
   * @param  {[Number]}  minNum [最小值，因为这个很常用, 不写就不比较]
   * @return {Boolean}       [description]
   */
  // isFloat: function(value, minNum) {
  //   let tmpValue = value + "";
  //   if (utils.isInt(tmpValue)) {
  //     var reg = /^(\-)(0|[1-9]\d*)\.\d+$/;
  //     if (reg.test(tmpValue)) {
  //       if (minNum == null) {
  //         return true;
  //       } else {
  //         tmpValue = parseInt(tmpValue);
  //         if (tmpValue >= minNum) {
  //           return true;
  //         } else {
  //           return false;
  //         }
  //       }
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return false;
  //   }
  // },

  /**
   * [isDateTime 是否是时间格式]
   * @param  {[String]}  value [description]
   * @param  {[type]}  type  [description]
   * @return {Boolean}       [description]
   */
  isDateTime: function(value, type) {
    if (value && typeof value === "string") {
      var dateRegStr =
        "20\\d{2}(\\-|\\/)(0?\\d|1[012])\\1(0?\\d|[12]\\d|3[01])";
      var timeRegStr =
        "(0?\\d|1\\d|2[0123]):(0?\\d|[12345]\\d):(0?\\d|[12345]\\d)";

      var reg;
      if (type == "date") {
        reg = RegExp(dateRegStr);
      } else if (type == "time") {
        reg = RegExp(timeRegStr);
      } else {
        reg = RegExp("^" + dateRegStr + "\\s+" + timeRegStr + "$");
      }
      // var reg = /^20\d{2}(\-|\/)(0?\d|1[012])\1(0?\d|[12]\d|3[01])\s+(0?\d|1\d|2[0123]):(0?\d|[12345]\d):(0?\d|[12345]\d)$/;
      if (reg.test(value)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  pathTrim: function(path) {
    return path.toLowerCase().replace(/\/$/, "");
  },

  /**
   * [isUri 是否是一条网络地址]
   * @param  {[String]}  value [description]
   * @return {Boolean}       [description]
   */
  // isUri: function(value) {
  //   var reg = /^(http|https|ftp)?\:\/\/[\w\W]+$/;
  //   if (typeof value == "string" && value && reg.test(value)) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  /**
   * key映射
   * @param {*} source 可以是一个数组或一个对象
   * @param {*} map
   */
  keyMap(source, map) {
    // console.log(source, map);
    var tmpSource, newSource, key;
    if (!utils.isArr(source)) {
      tmpSource = source;
      newSource = {};
      for (key in tmpSource) {
        if (map[key]) {
          newSource[map[key]] = tmpSource[key];
        } else {
          newSource[key] = tmpSource[key];
        }
      }
      return newSource;
    } else {
      var tmpList = source;
      var newList = [];
      for (var i = 0; i < tmpList.length; i++) {
        tmpSource = tmpList[i];
        newSource = {};
        for (key in tmpSource) {
          if (map[key]) {
            newSource[map[key]] = tmpSource[key];
          } else {
            newSource[key] = tmpSource[key];
          }
        }
        newList.push(newSource);
      }
      return newList;
    }
  }
};

export default utils;
