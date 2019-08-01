<template>
  <div class="demo-form-box">
    <div class="demo-form-header">
      <h2 class="demo-form-title">{{ title }}</h2>
      <el-button type="text" class="toggle-btn" @click="toggleDetails">{{
        openDetails ? "隐藏详情" : "打开详情"
      }}</el-button>
      <div class="demo-form-details" v-show="openDetails">
        <div>
          <strong>表单写法:</strong> &lt;es-form ref="form" :schema="formSchema"
          v-model="formValue"&gt;&lt;/es-form&gt;
        </div>
        <div>
          <span class="docs-title">{{ docsTitle }}</span
          >的具体配置见<a
            target="_blank"
            :href="'https://chengaohe45.github.io' + docsHref"
            >配置文档</a
          >
        </div>
        <div class="details">
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
          <h3 class="subtitle">表单输出:</h3>
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
              <pre class="pre-box">{{
                JSON.stringify(formValue, null, 2)
              }}</pre>
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
      default: "schema"
    },

    docsHref: {
      type: String,
      required: false,
      default: "/vue-easy-form-docs/dist/base/settings.html"
    }
  },

  created() {
    // window.demoVm = this;
    // console.log("Vue:", Vue.component("el-input"));

    this.$data.schema = this.formSchema;
    this.$data.code = this.filterCode();

    // Vue构造时的错误信息
    // if (!Vue.config.errorHandler) {
    // 是赋值，不是监听
    Vue.config.errorHandler = (err, vm, info) => {
      console.error(err, vm, info);

      var constructorTxt = Object.prototype.toString.call(err);
      if (constructorTxt && constructorTxt.indexOf("DOMException") >= 0) {
        alert("Vue构造节点时出错，Vue停止执行，需要重新刷新页面");
        location.reload();
      } else {
        this.$nextTick(() => {
          var runMsg = "Vue解析: 组件不存在.";
          if (utils.isStr(err)) {
            var comReg = /\<(.+?)\>/;
            var arr = err.match(comReg);
            if (arr) {
              runMsg = "Vue解析: <" + arr[1] + ">组件不存在";
            }
          }
          this.$data.runRight = false;
          this.$data.runMsg = runMsg;
        });
      }
    };
    // }

    // Vue构造时的警告信息
    // if (!Vue.config.warnHandler) {
    // 是赋值，不是监听
    Vue.config.warnHandler = (err, vm, info) => {
      console.error(err, vm, info);

      var constructorTxt = Object.prototype.toString.call(err);
      if (constructorTxt && constructorTxt.indexOf("DOMException") >= 0) {
        alert("Vue构造节点时出错，Vue停止执行，需要重新刷新页面");
        location.reload();
      } else {
        this.$nextTick(() => {
          var runMsg = "Vue解析: 组件不存在.";
          if (utils.isStr(err)) {
            var comReg = /\<(.+?)\>/;
            var arr = err.match(comReg);
            if (arr) {
              runMsg = "Vue解析: <" + arr[1] + ">组件不存在";
            }
          }
          this.$data.runRight = false;
          this.$data.runMsg = runMsg;
        });
      }
    };
    // }
  },

  computed: {},

  mounted() {},

  updated() {
    // console.log("update...");
  },

  methods: {
    /* 
    初始化时，把formSchema还原出来 
    经测试：null, array, object, function, number, boolean, string都OK；当value是undefined时会被JSON.stringify漏掉（感觉也没有错）
    */
    filterCode() {
      var functionObj = {},
        uniqIndex = 0;
      var newCode = JSON.stringify(
        this.formSchema,
        (key, value) => {
          if (
            value &&
            key == "name" &&
            typeof value == "object" &&
            value.render &&
            value.staticRenderFns
          ) {
            var vueKey = "[Vue对象" + ++uniqIndex + "(不要修改运行时会替换)]";
            var myVues = this._esMyVues ? this._esMyVues : {};
            myVues[vueKey] = value;
            this._esMyVues = myVues;
            return vueKey;
          } else if (typeof value == "function") {
            var funcKey = "FUNCTIONNAME" + ++uniqIndex;
            var funcStr = value.toString();
            funcStr = funcStr.replace(
              new RegExp("function\\\s+" + key + "\\(", "g"),
              "function("
            );
            functionObj[funcKey] = funcStr;
            return funcKey;
          } else {
            return value;
          }
        },
        2
      );

      newCode = newCode.replace(/\"(.+?)\"\:/g, "$1:");

      for (var key in functionObj) {
        var reg = new RegExp('\\"' + key + '\\"', "g");
        newCode = newCode.replace(reg, functionObj[key]);
      }

      // 使命完成
      functionObj = null;

      return newCode;
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
      this.$data.runMsg = "";

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

      // this.$nextTick(() => {
      //   this.$data.runRight = true;
      //   this.$data.runMsg = "解析成功";
      // });

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
  components: {}
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

  .demo-form-title {
    background: #d6d7da;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding: 5px 0 3px 10px;
    margin: 0 0 0 0;
    font-weight: 400;
    font-size: 22px;
    line-height: 24px;
  }

  .demo-form-details {
    padding: 10px 10px 10px 10px;
    border-left: 1px solid #d6d7da;
    border-right: 1px solid #d6d7da;
    border-bottom: 1px solid #d6d7da;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    line-height: 28px;

    .details {
      margin-top: 10px;
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

  .demo-form-header {
    position: relative;
  }

  .toggle-btn {
    position: absolute;
    right: 10px;
    top: 5px;
    line-height: 24px;
    margin: 0;
    padding: 0px;
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
      width: 100%;
      @include flex-full;
    }

    .demo-form-ui {
      margin: 10px;
      padding: 10px 10px;
      border: 1px solid #d6d7da;
      border-radius: 4px;
    }

    .demo-form-value {
      margin: 20px 10px 0;
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
      transform: scale(1.2);
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
