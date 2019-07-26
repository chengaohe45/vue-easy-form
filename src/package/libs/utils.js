// import constant from "./constant";

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
    var type = utils.type(data);
    var newData;
    if (type == "array") {
      newData = [];
      for (var i = 0; i < data.length; ++i) {
        newData[i] = utils.deepCopy(data[i]);
      }
      return newData;
    } else if (type === "object") {
      newData = {};
      for (var key in data) {
        newData[key] = utils.deepCopy(data[key]);
      }
      return newData;
    } else {
      return data;
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
                global[key] = value.trim();
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
