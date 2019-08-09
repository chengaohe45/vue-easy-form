import utils from "@/libs/utils";
import Vue from "vue";
import esForm from "@/package/index.js";

export default {
  /**
   * 注：_es为前缀的不跟页面同步，所以不写入data里
   */
  data() {
    return {
      runMsg: "",
      runRight: true
    };
  },

  props: {
    title: {
      // 此页面模块的标题
      type: String,
      required: false,
      default: "demo标题"
    },

    docsTitle: {
      // 帮助文档的标题
      type: String,
      required: false,
      default: "配置文档"
    },

    docsHref: {
      // 帮助文档的链接
      type: String,
      required: false,
      default: "/vue-easy-form-docs/dist/base/settings.html"
    }
  },

  methods: {
    initListener() {
      this._esInfoHandler = (err, vm, info) => {
        this.printSystem(err, vm, info);
      };

      // Vue构造时的错误信息和警告信息：是赋值，不是监听
      Vue.config.errorHandler = this._esInfoHandler;
      Vue.config.warnHandler = this._esInfoHandler;
    },

    printSystem(err, vm, info) {
      console.error(err, vm, info);
      var constructorTxt = Object.prototype.toString.call(err);
      if (constructorTxt && constructorTxt.indexOf("DOMException") >= 0) {
        alert("Vue构造节点时出错，Vue停止执行，需要重新刷新页面");
        location.reload();
      } else {
        this.$nextTick(() => {
          var runMsg = "Vue解析: 存在警告信息(信息可开发者模查看).";
          if (utils.isStr(err)) {
            var comReg = /<(.+?)>/;
            var arr = err.match(comReg);
            if (arr) {
              if (!this._esErrorNames) {
                this._esErrorNames = [arr[1]];
              } else if (!this._esErrorNames.includes(arr[1])) {
                this._esErrorNames.push(arr[1]);
              }
              runMsg =
                "Vue解析: <" +
                this._esErrorNames.join(">, <") +
                ">组件不存在,请修改.(注意：若不修改，Vue机制下将不提示上一次相同组件名的警告)";
            } else if (err.indexOf("Invalid prop") >= 0) {
              runMsg = "组件属性的类型可能不对(信息可开发者模式查看)！";
            } else if (err.indexOf("Missing required prop") >= 0) {
              runMsg = "缺少必要的组件属性(信息可开发者模式查看)！";
            }
          }
          this.$data.runRight = false;
          this.$data.runMsg = runMsg;
        });
      }
    },

    /**
     * 点击运行调用的函数
     * @param {*} rawCode
     */
    runSchema(rawCode) {
      // 重置一些基本信息
      this.$data.runMsg = "";
      this._esErrorNames = null;

      var rawSchema;

      // 检查结果是否正确
      try {
        eval("rawSchema = " + rawCode);
      } catch (e) {
        this.$nextTick(() => {
          this.$data.runRight = false;
          this.$data.runMsg = "输入框schema无法解析";
        });
        console.error(e);
        return false;
      }

      // 代替自定义组件
      this.replaceVue(rawSchema);

      var checkResult = esForm.check(rawSchema);
      if (checkResult !== true) {
        this.$nextTick(() => {
          this.$data.runRight = false;
          this.$data.runMsg = checkResult;
        });
        console.error(checkResult);
        return false;
      }

      this.$nextTick(() => {
        this.$data.runRight = true;
        this.$data.runMsg = "格式正确，详情具体输出";
      });

      return rawSchema;
    },

    /**
     * 变为JSON输出，增强可读性
     * 经测试：null, array, object, function, number, boolean, string都OK；当value是undefined时会被JSON.stringify漏掉（感觉也没有错）
     * @param source 解析源
     * @param curTimes 解析了多少次了
     * @param isFromSchema 是否来自schema, 因为schema在弄漂亮点，去掉key的双引号
     */
    toJson(source, curTimes = 1, isFromSchema = false) {
      const MAX = 3; // 大于3次就不做变换了
      const CAN_REPLACE = curTimes <= MAX ? true : false;
      var randStr = utils.randStr(15, 20);
      var uniqIndex = 0;
      const UNDEFINED =
        curTimes < CAN_REPLACE ? "UND" + randStr : "undefined值";
      const FUNCTION_NAME =
        curTimes < CAN_REPLACE ? "FUNC" + randStr : "function值";

      var undefinedObj = {},
        functionObj = {},
        hasSameUndefined = false;

      var newSource = JSON.stringify(
        source,
        (key, value) => {
          if (
            key === UNDEFINED ||
            value === UNDEFINED ||
            key.indexOf(FUNCTION_NAME) == 0
          ) {
            // 出现相同的字符串，说明UNDEFINED值不可用(只是存在理论上的可能，比当上联合国秘书长的概率还低)
            hasSameUndefined = true;
          } else if (value === undefined) {
            value = UNDEFINED;
            undefinedObj[key] = value;
          } else if (
            isFromSchema &&
            value &&
            key == "name" &&
            typeof value == "object" &&
            value.render &&
            value.staticRenderFns
          ) {
            var vueKey =
              "[Vue对象" + ++uniqIndex + "(不要修改,运行时自会替换)]";
            var myVues = this._esMyVues ? this._esMyVues : {};
            myVues[vueKey] = value;
            this._esMyVues = myVues;
            return vueKey;
          } else if (utils.isFunc(value)) {
            // 因为数据是来自于开发者，这个基本可以控制字符串有FUNCTIONNAME
            var funcKey = FUNCTION_NAME + ++uniqIndex;
            var funcStr = value.toString();
            funcStr = funcStr.replace(
              new RegExp("function\\s+" + key + "\\(", "g"),
              "function("
            );
            functionObj[funcKey] = funcStr;
            return funcKey;
          }
          return value;
        },
        2
      );

      if (isFromSchema) {
        // 去年双引号
        newSource = newSource.replace(/"([^\\"]+?)":/g, "$1:");
      }

      if (CAN_REPLACE) {
        if (!hasSameUndefined) {
          // 没有有相同的字符串，替换

          for (var key in functionObj) {
            var reg = new RegExp('\\"' + key + '\\"', "g");
            newSource = newSource.replace(reg, functionObj[key]);
          }

          if (Object.keys(undefinedObj).length > 0) {
            // 需要替挽
            // undefined 代替
            // 因为数据是来自于开发者，这个基本可以控制字符串有UNDEFINED
            var undefinedReg = new RegExp('"' + UNDEFINED + '"', "g");
            newSource = newSource.replace(undefinedReg, "undefined");
          }

          return newSource;
        } else {
          //  有相同的字符串，重来一次
          newSource = null;
          var nextTime = curTimes + 1;
          return this.toJson(source, nextTime, isFromSchema);
        }
      } else {
        // 直接输出；不做替换了；因为之前做过了MAX次了；理论就不会进入这里，进入这里只是备用做展示，对功能没有什么影响
        return newSource;
      }
    },

    /**
     * 代替VueKey（就是上面toJson后相反）
     * @param {*} result 左边输入框的原生字符
     */
    replaceVue(result) {
      if (
        utils.isObj(result) &&
        this._esMyVues &&
        Object.keys(this._esMyVues).length > 0
      ) {
        var myVues = this._esMyVues;
        for (var key in result) {
          var value = result[key];
          if (utils.isStr(value) && myVues[value]) {
            result[key] = myVues[value];
          } else if (utils.isObj(value)) {
            this.replaceVue(value);
          }
        }
      }
    }
  },

  beforeDestroy() {
    if (this._esInfoHandler) {
      // 若别的地方修改了，不用理会
      if (this._esInfoHandler == Vue.config.errorHandler) {
        Vue.config.errorHandler = null;
      }

      // 若别的地方修改了，不用理会
      if (this._esInfoHandler == Vue.config.warnHandler) {
        Vue.config.warnHandler = null;
      }

      this._esInfoHandler = null;
    }
  }
};
