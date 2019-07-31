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
      <div class="demo-es-source">
        <h3 class="subtitle">formSchema:</h3>
        <div class="demo-source-panel">
          <!-- <el-button type="primary" plain @click="clickHandler">运行</el-button> -->
          <codemirror
            v-model="code"
            :options="cmOptions"
            style="height: 100%;"
          ></codemirror>
        </div>
      </div>
      <div class="demo-es-result">
        <h3 class="subtitle">表单输出</h3>
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
            表单值(formValue):
            <pre class="pre-box">{{ JSON.stringify(formValue, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// language
import "codemirror/mode/javascript/javascript.js";
// theme css
// import 'codemirror/theme/monokai.css'
// // require active-line.js
// import'codemirror/addon/selection/active-line.js'
// // styleSelectedText
// import'codemirror/addon/selection/mark-selection.js'
// import'codemirror/addon/search/searchcursor.js'
// // hint
// import'codemirror/addon/hint/show-hint.js'
// import'codemirror/addon/hint/show-hint.css'
// import'codemirror/addon/hint/javascript-hint.js'
// import'codemirror/addon/selection/active-line.js'
// highlightSelectionMatches
// import'codemirror/addon/scroll/annotatescrollbar.js'
// import'codemirror/addon/search/matchesonscrollbar.js'
// import'codemirror/addon/search/searchcursor.js'
// import'codemirror/addon/search/match-highlighter.js'
// keyMap
// import'codemirror/mode/clike/clike.js'
// import'codemirror/addon/edit/matchbrackets.js'
// import'codemirror/addon/comment/comment.js'
// import'codemirror/addon/dialog/dialog.js'
// import'codemirror/addon/dialog/dialog.css'
// import'codemirror/addon/search/searchcursor.js'
// import'codemirror/addon/search/search.js'
// import'codemirror/keymap/sublime.js'
// foldGutter
// import'codemirror/addon/fold/foldgutter.css'
// import'codemirror/addon/fold/brace-fold.js'
// import'codemirror/addon/fold/comment-fold.js'
// import'codemirror/addon/fold/foldcode.js'
// import'codemirror/addon/fold/foldgutter.js'
// import'codemirror/addon/fold/indent-fold.js'
// import'codemirror/addon/fold/markdown-fold.js'
// import'codemirror/addon/fold/xml-fold.js'

// import CodeMirror from "codemirror";

const FUNCTIONNAME = "FUNCTIONNAME";

export default {
  data() {
    return {
      formValue: {
        // name: "默认小花"
      },

      // functionIndex: 0,

      schema: {},

      code: "",

      cmOptions: {
        tabSize: 4,
        // styleActiveLine: false,
        lineNumbers: true,
        // styleSelectedText: false,
        // line: true,
        // foldGutter: true,
        // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        // highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        mode: "text/javascript"
        // hint.js options
        // hintOptions:{
        //   // 当匹配只有一项的时候是否自动补全
        //   completeSingle: false
        // },
        //快捷键 可提供三种模式 sublime、emacs、vim
        // keyMap: "sublime",
        // matchBrackets: true,
        // showCursorWhenSelecting: true,
        // theme: "monokai",
        // extraKeys: { "Ctrl": "autocomplete" }
      },

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
    window.demoVm = this;

    this.$data.schema = this.formSchema;

    var functionObj = {},
      functionIndex = 0;
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
          return "[编译的Vue Object]";
        } else if (typeof value == "function") {
          // var obj = this.$data.functionObj;
          var funcKey = FUNCTIONNAME + ++functionIndex;
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

    this.$data.code = newCode;
  },

  computed: {},

  mounted() {},

  methods: {
    clickHandler() {
      var result;
      eval("result = " + this.$data.code);
      // console.log("code: ", result);
      this.$data.formValue = {};
      this.$data.schema = result;
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
    @include direction-h;
    // padding-top: 5px;
    box-sizing: border-box;
    min-height: 300px;
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
    padding: 5px 10px 10px 10px;
    width: 35%;
    @include flex-fixed;
    overflow: hidden;
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
      overflow: auto;
      height: 100%;
      @include flex-full;
    }
  }

  .CodeMirror {
    border: 1px solid #eee;
    // height: 500px;
    height: auto;
  }
}
</style>
