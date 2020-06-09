// import constant from "./constant";

let utils = {
  __Vue: null,
  __key: 0,

  initVue(Vue) {
    this.__Vue = Vue;
  },
  /**
   * unicode letters used for parsing html tags, component names and property paths.
   * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
   * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
   *
   * from vue source code
   */
  unicodeRegExp: /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/,

  validateComponentName: function(name) {
    var reg = new RegExp(
      "^[a-zA-Z][\\-\\.0-9_" + this.unicodeRegExp.source + "]*$"
    );
    return reg.test(name);
  },

  newUid: function(prefix) {
    utils.__key++;
    return prefix ? prefix + "_" + utils.__key : utils.__key;
  },

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
   * 是否scopedSlot为空
   * @param {*} value
   */
  isSlotUndef(value) {
    return this.isUndef(value) || this.isNull(value) || false;
  },

  /**
   * 判断是否一个Vue实例：包括Vue或VueComponent实例
   * @param {*} value
   */
  isVue(value) {
    return value instanceof this.__Vue;
  },

  /**
   * 判断是否一个虚拟节点
   * @param {*} value
   */
  isVNode(value) {
    var VNode = this.__VNode;
    if (!VNode) {
      var Vue = this.__Vue;
      var instance = new Vue();
      var vnode = instance.$createElement("span", "");
      VNode = vnode.constructor;
      this.__VNode = VNode;

      vnode = null;
      instance = null;
    }
    return value instanceof VNode;
  },

  isVueObj(value) {
    if (this.isObj(value)) {
      if (value.template || (value.staticRenderFns && value.__file)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  isRefVal(value) {
    return this.isObj(value) || this.isArr(value);
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
    if (this.isVNode(data) || this.isVue(data)) {
      // 虚拟节点，vue组件实例，不用深度拷贝
      rawIndex = rawRefs.indexOf(data);
      // console.log("__deepCopy vnode");
      if (rawIndex < 0) {
        // 一对一保存; 先保存索引地址，下一级的deep可能会用到
        rawRefs.push(data);
        newRefs.push(data);
      }
      return data;
    } else if (type == "array") {
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

  /**
   * 处理可以有回调的钩子函数：主要是before、after
   * @param {*} handle 句柄
   * @param {*} context 上下文对象（指出来自哪里）
   * @param {*} data 句柄所需要的数据
   * @param {*} callback 回调
   */
  execCbHook(handle, context, data, callback) {
    var hasExecuted = false; // 保存程序只执行一次
    if (handle) {
      var done = function(result) {
        if (!hasExecuted) {
          hasExecuted = true;
        } else {
          // 已经执行过，无需要再执行
          console.warn("done只能执行一次，不能执行多次；第二次执行done将无效");
          return false;
        }
        if (callback) {
          callback.call(context, result);
        }
        context = null;
      };
      handle.call(context, done, this.deepCopy(data));
      data = null;
      done = null;
    } else {
      if (callback) {
        callback.call(context);
      }
      data = null;
      context = null;
    }
  },

  /**
   * [deepFreeze 深冻结的数据是object和array]
   * @param  {[type]} data [description]
   * @return {[type]}   [description]
   */
  deepFreeze: function(data) {
    var rawRefs = [];
    var newRefs = [];
    var newData = this.__deepFreeze(data, rawRefs, newRefs);
    rawRefs = null;
    newRefs = null;
    return newData;
  },

  /**
   * [deepFreeze 深冻结的数据是object和array]
   * @param  {[type]} data [description]
   * @return {[Array]}   [rawRefs] 记录原始的object and array
   * rawRefs作用防止数据中某个地方存在循环的问题
   */
  __deepFreeze: function(data, rawRefs) {
    var type = utils.type(data);
    var rawIndex;
    if (this.isVNode(data) || this.isVue(data)) {
      // 虚拟节点，vue组件实例，不用冻结
      rawIndex = rawRefs.indexOf(data);
      if (rawIndex < 0) {
        // 一对一保存; 先保存索引地址，下一级的deep可能会用到
        rawRefs.push(data);
      }
    } else if (type == "array") {
      rawIndex = rawRefs.indexOf(data);
      if (rawIndex < 0) {
        // 一对一保存; 先保存索引地址，下一级的deep可能会用到
        rawRefs.push(data);

        // 冻结这一层
        Object.freeze(data);

        for (var i = 0; i < data.length; ++i) {
          this.__deepFreeze(data[i], rawRefs); // 继续走下一级
        }
      } else {
        // 已经存在的数据，则说明已经处理过，无需处理了
      }
    } else if (type === "object") {
      rawIndex = rawRefs.indexOf(data);
      if (rawIndex < 0) {
        // 一对一保存; 先保存索引地址，下一级的deep可能会用到
        rawRefs.push(data);

        // 冻结这一层
        Object.freeze(data);

        for (var key in data) {
          this.__deepFreeze(data[key], rawRefs);
        }
      } else {
        // 已经存在的数据，则说明已经处理过，无需处理了
      }
    } else {
      // 其它类型，无需要理会
    }
  },

  /**
   * 数组去重
   * @param {Array} arr
   */
  unique: function(arr) {
    var newArr = [];
    if (this.isArr(arr)) {
      var tmpObj = {};
      arr.forEach(item => {
        tmpObj[item] = 1;
      });
      newArr = Object.keys(tmpObj);
    }
    return newArr;
  },

  /* 两个数组是否有交集 */
  isInter(arr1, arr2) {
    for (var i = 0; i < arr1.length; i++) {
      if (arr2.includes(arr1[i])) {
        return true;
      }
    }
    return false;
  },

  /**
   * 转在vue的驼峰形式
   * @param {*} value
   * 经在Vue的实例中测试，Vue对props属性名的解析有：
   * 1. "text-Str" "text-str"  都会转成"textStr", 但"text--str"会报错，主要是template无法显示
   * 1. "text-8str" 都会转成"text8str"
   */
  vueCamelCase(value) {
    var reg = /-(\w)/g;
    return value.replace(reg, function($0, $1) {
      return $1.toUpperCase();
    });
  },

  /**
   * 切换组件的text为字符串：支持string, number, boolean；
   * 与toNormalText相比，范围要大于或等于
   * @param {*} value
   */
  toComText(value) {
    var newValue;
    if (this.isStr(value)) {
      newValue = value.trim();
      newValue = newValue ? newValue : undefined;
    } else if (this.isNum(value) || this.isBool(value)) {
      newValue = value + "";
    } else {
      newValue = undefined;
    }
    return newValue;
  },

  /**
   * 切换一般的text为字符串：只支持string, number, 因为有些组件对布尔型有特殊作用
   * @param {*} value
   */
  toNormalText(value) {
    var newValue;
    if (this.isStr(value)) {
      newValue = value.trim();
      newValue = newValue ? newValue : undefined;
    } else if (this.isNum(value)) {
      newValue = value + "";
    } else {
      newValue = undefined;
    }
    return newValue;
  },

  /* 与toNormalText是对应的 */
  isNormalText(value) {
    if (this.isStr(value)) {
      return true;
    } else if (this.isNum(value)) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * 随机产生一定长度的字符串：只有数字和字母
   * @param {*} min 最小长度，默认为10，必须大于0
   * @param {*} max 最大长度，默认为10，必须大于0
   */
  randStr(min, max) {
    var chars = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ];

    var len;

    var isRightMax = true;
    if (!this.isNum(min) || min < 1) {
      min = 10;
    }

    if (!this.isNum(max) || max < 1) {
      isRightMax = false;
      max = 10;
    }

    if (!isRightMax) {
      len = min;
    } else {
      if (min >= max) {
        len = max;
      } else {
        // 取出min和max的随机长度
        len = min + Math.round(Math.random() * (max - min));
      }
    }

    var randStr = "",
      randIndex;
    var charsLen = chars.length;
    for (var i = 0; i < len; i++) {
      randIndex = Math.floor(Math.random() * charsLen);
      randStr += chars[randIndex];
    }
    return randStr;
  },

  mergeGlobal(global, extra) {
    if (utils.isObj(extra)) {
      for (var key in extra) {
        if (!utils.isUndef(global[key])) {
          var value = extra[key];
          switch (key) {
            case "boxRowHeight":
            case "boxRowSpace":
            case "boxLabelWidth":
            case "rowHeight":
            case "rowSpace":
            case "labelWidth":
            case "offsetLeft":
            case "offsetRight":
              if (key == "boxRowHeight") {
                console.warn("全局设置boxRowHeight已经弃用，请改用为rowHeight");
                key = "rowHeight";
              } else if (key == "boxRowSpace") {
                console.warn("全局设置boxRowSpace已经弃用，请改用为rowSpace");
                key = "rowSpace";
              } else if (key == "boxLabelWidth") {
                console.warn(
                  "全局设置boxLabelWidth已经弃用，请改用为labelWidth"
                );
                key = "labelWidth";
              }

              if (utils.isNum(value) && value >= 0) {
                global[key] = value;
              } else {
                console.warn(
                  "mergeGlobal: key(" +
                    key +
                    ")的值不是数值且大于等于0；此默认值将不重设"
                );
              }
              break;
            case "colon":
              if (utils.isBool(value)) {
                global[key] = value;
              } else {
                console.warn(
                  "mergeGlobal: key(" +
                    key +
                    ")的值不是true/false；此默认值将不重设"
                );
              }
              break;
            case "direction":
              if (["v", "h"].includes(value)) {
                global[key] = value;
              } else {
                console.warn(
                  "mergeGlobal: key(" +
                    key +
                    ')的值不是数组["v", "h"]；此默认值将不重设'
                );
              }
              break;
            case "defaultCom":
              if (value && utils.isStr(value) && value.trim()) {
                var defaltName = value.trim();
                if (utils.validateComponentName(defaltName)) {
                  global[key] = defaltName;
                } else {
                  console.warn(
                    "mergeGlobal: key(" +
                      key +
                      ")的值有误(组件名存在html非法字符)；此默认值将不重设"
                  );
                }
              } else {
                console.warn(
                  "mergeGlobal: key(" +
                    key +
                    ")的值有误(1. 不能为空; 2. 是字符串)；此默认值将不重设"
                );
              }
              break;

            case "trimEvent":
              console.warn("trimEvent已经移走了，请关注trimDoms");
              break;

            case "trimDoms":
              var tmpValue;
              if (utils.isStr(value)) {
                tmpValue = [value.trim()];
              } else if (utils.isArr(value)) {
                tmpValue = value.map(item => {
                  if (utils.isStr(item)) {
                    return item.trim();
                  } else {
                    return item;
                  }
                });
              } else {
                console.warn(
                  "mergeGlobal: key(" +
                    key +
                    ")的值有误, 必须是一个组件名或一个组件；此默认值将不重设"
                );
              }

              if (tmpValue) {
                tmpValue = tmpValue.filter(item => {
                  return item ? true : false;
                });
                if (tmpValue.length <= 0) {
                  console.log("trimDoms的长度为0");
                }
                // console.log("tmpValue", tmpValue);
                global[key] = tmpValue;
              }
              break;
            case "defaultVal":
              if (!utils.isUndef(value)) {
                global[key] = value;
              } else {
                console.warn(
                  "mergeGlobal: key(" +
                    key +
                    ")不能设置为undefined；此默认值将不重设"
                );
              }
              break;
            case "hasConsole":
              if (utils.isBool(value)) {
                global[key] = value;
              } else {
                console.warn(
                  "mergeGlobal: key(" +
                    key +
                    ")不能设置为非true/false；此默认值将不重设"
                );
              }
              break;
            default:
              break;
          }
        } else {
          console.warn("mergeGlobal: key(" + key + ")不存在");
        }
      }
    }
  }
};

export default utils;
