<template>
  <div class="demo-form-box">
    <div class="demo-form-header">
      <div class="demo-details-header">
        <h2 class="demo-form-title">{{ title }}</h2>
        <a
          type="text"
          class="docs-btn"
          target="_blank"
          :href="'https://chengaohe45.github.io' + docsHref"
          @click="toggleDetails"
          >{{ docsTitle }}</a
        >
        <el-button type="text" class="toggle-btn" @click="toggleDetails">{{
          openDetails ? "隐藏详情" : "打开详情"
        }}</el-button>
      </div>
      <div class="demo-details-content" v-show="openDetails">
        <div>
          <strong>表单写法:</strong> &lt;es-form ref="form" :schema="formSchema"
          v-model="formValue"&gt;&lt;/es-form&gt;
        </div>
        <div class="details-content">
          <slot name="details" class="details"></slot>
        </div>
      </div>
    </div>
    <div class="demo-form-body">
      <div class="demo-btn-row">
        <el-button
          class="run-btn"
          type="primary"
          plain
          @click="clickHandler"
          size="small"
          >运行schema</el-button
        >
        <transition name="bounce">
          <div :class="runRight ? 'run-msg' : 'run-msg error'" v-if="runMsg">
            {{ runMsg }}
          </div>
        </transition>
      </div>
      <div class="demo-body-row">
        <div class="demo-es-source">
          <div class="demo-source-panel">
            <!-- <codemirror
              v-model="code"
              :options="cmOptions"
              style="height: 100%;"
            ></codemirror> -->
            <textarea
              class="textarea"
              autocomplete="off"
              placeholder="请输入内容"
              v-model="code"
            ></textarea>
          </div>
        </div>
        <div class="demo-es-result">
          <!-- <h3 class="subtitle">表单输出:</h3> -->
          <div class="demo-result-panel">
            <div class="demo-form-ui">
              <es-form
                ref="form"
                :schema="schema"
                v-model="formValue"
                :hasConsole="hasConsole"
                @input="formInput"
                @change="formChange"
                @submit="formSubmit"
              ></es-form>
            </div>
            <div class="demo-form-value">
              <strong>表单值(formValue):</strong>
              <pre class="pre-box">{{ stringify(formValue) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/libs/utils";
import esForm from "@/package/index.js";
import Vue from "vue";

export default {
  data() {
    return {
      formValue: {
        // name: "默认小花"
      },

      runMsg: "",
      runRight: true,

      schema: {},

      code: "",

      openDetails: true

      /**
       * 注：_es为前缀的不跟页面同步，所以不写入data里
       */
    };
  },

  props: {
    title: {
      type: String,
      required: false,
      default: "demo标题"
    },

    formSchema: {
      type: Object,
      required: true
    },

    printEvent: {
      type: Boolean,
      required: false,
      default: false
    },

    hasConsole: {
      type: Boolean,
      required: false,
      default: undefined
    },

    docsTitle: {
      type: String,
      required: false,
      default: "配置文档"
    },

    docsHref: {
      type: String,
      required: false,
      default: "/vue-easy-form-docs/dist/base/settings.html"
    }
  },

  created() {
    window.demoVm = this;
    // console.log("Vue:", Vue.component("el-input"));

    this.$data.schema = this.formSchema;
    this.$data.code = this.stringify(this.formSchema);
  },

  computed: {},

  mounted() {
    this._esInfoHandler = (err, vm, info) => {
      this.printSystem(err, vm, info);
    };

    // Vue构造时的错误信息和警告信息：是赋值，不是监听
    Vue.config.errorHandler = this._esInfoHandler;
    Vue.config.warnHandler = this._esInfoHandler;
  },

  updated() {
    // console.log("update...");
  },

  methods: {
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

    stringify(value) {
      return this.__toJson(value);
    },

    /**
     * 变为JSON输出，增强可读性
     * 经测试：null, array, object, function, number, boolean, string都OK；当value是undefined时会被JSON.stringify漏掉（感觉也没有错）
     * @param source 解析源
     * @param curTimes 解析了多少次了
     */
    __toJson(source, curTimes = 1) {
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

      newSource = newSource.replace(/"([^\\"]+?)":/g, "$1:");

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
          return this.__toJson(source, nextTime);
        }
      } else {
        // 直接输出；不做替换了；因为之前做过了MAX次了；理论就不会进入这里，进入这里只是备用做展示，对功能没有什么影响
        return newSource;
      }
    },

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
    },

    clickHandler() {
      // 重置一些基本信息
      this.$data.runMsg = "";
      this._esErrorNames = null;

      var rawSchema;

      // 检查结果是否正确
      try {
        eval("rawSchema = " + this.$data.code);
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
        this.$data.runMsg = "格式正确，具体输出见右侧";
      });

      this.$data.formValue = {};
      this.$data.schema = rawSchema;
    },

    toggleDetails() {
      this.$data.openDetails = !this.$data.openDetails;
    },

    formInput(value, sourcePathKey) {
      if (this.printEvent) {
        console.log(
          "formInput(value, sourcePathKey)：打印结果 ******************** start"
        );
        console.log(">>>>>返回两个value的值: ", value);
        console.log(">>>>>返回两个sourcePathKey的值: ", sourcePathKey);
        console.log(
          "formInput(value, sourcePathKey)：打印结果 ******************** end"
        );
        console.log("\n");
      }
    },
    formChange(value, sourcePathKey) {
      if (this.printEvent) {
        console.log(
          "formChange(value, sourcePathKey)：打印结果 --------------- start"
        );
        console.log(">>>>>返回两个value的值: ", value);
        console.log(">>>>>返回两个sourcePathKey的值: ", sourcePathKey);
        console.log(
          "formChange(value, sourcePathKey)：打印结果 --------------- end"
        );
        console.log("\n");
      }
    },
    formSubmit(/*value*/) {
      // console.log("formSubmit: ", value);
      this.$message({
        message: "触发了表单的提交事件",
        type: "success"
      });
    }
  },
  components: {},

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
</script>

<style lang="scss">
@import "@/static/css/mixins.scss";

.demo-form-box {
  @include display-flex;
  @include direction-v;
  @include flex-full;
  overflow: auto;
  height: 100%;
  padding: 10px 10px 0;
  box-sizing: border-box;
  font-size: 14px;

  .demo-form-header {
    .demo-details-header {
      position: relative;
      @include display-flex;
      align-items: center;

      background: #d6d7da;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      padding: 5px 0 3px 10px;
    }

    .demo-form-title {
      margin: 0 0 0 0;
      font-weight: 400;
      font-size: 22px;
      line-height: 24px;
    }

    .docs-btn {
      margin-left: 5px;
      color: #409eff;
      text-decoration: none;
      &:hover {
        color: #66b1ff;
      }
    }

    .toggle-btn {
      position: absolute;
      right: 10px;
      top: 5px;
      line-height: 24px;
      margin: 0;
      padding: 0px;
    }
  }

  .demo-details-content {
    padding: 10px 10px 10px 10px;
    border-left: 1px solid #d6d7da;
    border-right: 1px solid #d6d7da;
    border-bottom: 1px solid #d6d7da;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    line-height: 24px;

    .details-content {
      margin-top: 5px;
      line-height: 22px;

      &:empty {
        margin-top: 0px;
      }
    }
  }

  .docs-title {
    color: #67c23a;
  }

  .demo-form-body {
    overflow: auto;
    @include flex-full;
    height: 100%;
    @include display-flex;
    @include direction-v;
    // padding-top: 5px;
    box-sizing: border-box;
    min-height: 300px;
  }

  .demo-btn-row {
    margin: 0;
    padding: 10px 10px 5px;
    @include flex-fixed;
    text-align: left;
    @include display-flex;
    align-items: center;

    .run-btn {
      @include flex-fixed;
    }

    .run-msg {
      margin: 0 0 0 10px;
      font-size: 13px;
      line-height: 16px;
      color: #67c23a;
    }

    .run-msg.error {
      color: #f56c6c;
    }
  }

  .demo-body-row {
    @include flex-fixed;
    overflow: auto;
    @include flex-full;
    height: 100%;
    @include display-flex;
    @include direction-h;
    box-sizing: border-box;
  }

  .pre-box {
    overflow: auto;
  }

  .subtitle {
    margin: 0 0 0 3px;
    padding: 0;
    font-size: 16px;
    font-weight: bold;
    line-height: 30px;
    @include flex-fixed;
  }

  .demo-es-result {
    padding: 5px 0 10px 0;
    @include flex-full;
    overflow: hidden;
    box-sizing: border-box;
    @include display-flex;
    @include direction-v;

    .demo-result-panel {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      border: 1px dashed #b3d8ff;
      border-radius: 4px;
      text-align: left;
      overflow: auto;
      // width: 100%;
      @include flex-full;
    }

    .demo-form-ui {
      margin: 10px;
      padding: 10px 10px;
      border: 1px solid #d6d7da;
      border-radius: 4px;
    }

    .demo-form-value {
      margin: 10px 10px 0;
      border-top: 1px dashed #d6d7da;
      padding: 10px;
      text-align: left;
    }
  }

  .demo-es-source {
    margin-right: 5px;
    padding: 10px 10px 10px 10px;
    width: 35%;
    @include flex-fixed;
    // overflow: hidden;
    box-sizing: border-box;
    @include display-flex;
    @include direction-v;

    background: #f3f3f3;

    .demo-source-panel {
      box-sizing: border-box;
      border: 1px dashed #b3d8ff;
      border-radius: 4px;
      text-align: left;
      // padding: 5px;
      overflow: visible;
      // height: 100%;
      @include flex-full;

      .textarea {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        // resize: none;
        // display: block;
        // resize: vertical;
        outline: none;
        padding: 5px 15px;
        line-height: 1.5;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        font-size: inherit;
        color: #606266;
        background-color: #fff;
        background-image: none;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        -webkit-transition: border-color 0.2s
          cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

        &:hover {
          border-color: #c0c4cc;
        }

        &:focus {
          border-color: #409eff;
        }
      }
    }
  }

  .bounce-enter-active {
    animation: bounce-in 0.5s;
  }
  .bounce-leave-active {
    animation: bounce-in 0.1s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  .CodeMirror {
    border: 1px solid #eee;
    // height: 500px;
    height: auto;
  }
}
</style>
