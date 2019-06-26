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
      <div class="demo-form-ui">
        <div class="demo-form-wrap">
          <es-form
            ref="form"
            :schema="formSchema"
            v-model="formValue"
            @input="formInput"
            @change="formChange"
            @submit="formSubmit"
          ></es-form>
        </div>
        <div class="demo-value-box">
          <div class="demo-set-get-box" v-if="hasValue">
            <div class="get-box">
              <div class="box-inner">
                <el-button type="primary" @click="getFormValue"
                  >取值( form.getValue() )</el-button
                >
                <div class="value-parse-box" v-if="formValue2">
                  <pre>{{ JSON.stringify(formValue2, null, 2) }}</pre>
                </div>
              </div>
            </div>
            <div class="set-box">
              <div class="box-inner">
                <el-button type="primary" @click="setFormValue"
                  >赋值( form.setValue({}) )</el-button
                >
                <div class="value-parse-box">
                  <el-input
                    type="textarea"
                    :rows="10"
                    placeholder="请输入Json"
                    v-model="rawFormValue"
                  >
                  </el-input>
                </div>
                <div v-if="errorMsg">{{ errorMsg }}</div>
              </div>
            </div>
            <div class="reset-box">
              <div class="box-inner">
                <el-button type="primary" @click="resetFormValue"
                  >重置( form.reset() )</el-button
                >
                <br /><br />
                <div>
                  <el-button type="primary" @click="checkFormValue"
                    >验证( form.checkAll() )</el-button
                  >
                  <div
                    class="value-parse-box"
                    v-if="typeof checkResult == 'boolean'"
                  >
                    <pre>{{ JSON.stringify(checkResult, null, 2) }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            表单值(formValue):
            <pre>{{ JSON.stringify(formValue, null, 2) }}</pre>
          </div>
        </div>
      </div>
      <div class="demo-form-source">
        <div class="source-inner">
          <strong>formSchema:</strong>
          <pre>{{
            JSON.stringify(
              formSchema,
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
                  //return "[Function]";
                  return value.toString();
                } else {
                  return value;
                }
              },
              2
            )
          }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formValue: {
        // name: "默认小花"
      },

      openDetails: true,

      formValue2: null,
      rawFormValue: "",
      checkResult: null,
      errorMsg: ""
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

    hasValue: {
      type: Boolean,
      required: false
    },

    printEvent: {
      type: Boolean,
      required: false,
      default: false
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
  },

  computed: {},

  mounted() {},

  methods: {
    getFormValue() {
      this.$data.formValue2 = this.$refs.form.getValue();

      this.$data.rawFormValue = JSON.stringify(this.$data.formValue2, null, 2);

      this.$message({
        message: "值也填进赋值框里，可以修改试试",
        type: "success"
      });
    },

    checkFormValue() {
      this.$data.checkResult = this.$refs.form.checkAll();
    },

    resetFormValue() {
      this.$data.checkResult = null;
      this.$data.formValue2 = null;
      this.$refs.form.reset();
    },

    toggleDetails() {
      this.$data.openDetails = !this.$data.openDetails;
    },

    setFormValue() {
      try {
        this.$data.errorMsg = "";
        // console.log(1);
        var result;
        eval("result = " + this.$data.rawFormValue);
        // console.log(2);
        this.$refs.form.setValue(result);
      } catch (e) {
        // console.error("e: ", e);
        this.$data.errorMsg = "此值解析不出来";
      }
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
  padding: 10px;
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

  .demo-form-wrap {
    margin: 10px;
    padding: 10px 10px;
    border: 1px solid #d6d7da;
    border-radius: 4px;
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
    padding-top: 20px;
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

  .demo-set-get-box {
    // margin: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #eee;
    // overflow: auto;
    @include flex-full;
    // height: 100%;
    @include display-flex;
    @include direction-h;
    padding-top: 20px;
    box-sizing: border-box;

    .get-box {
      width: 35%;
    }

    .set-box {
      width: 65%;
    }

    .box-inner {
      margin: 0 5px;
    }

    .value-parse-box {
      margin-top: 10px;
    }
  }

  .demo-value-box {
    margin: 20px 10px 0 10px;
    border-top: 1px dashed #d6d7da;
    padding: 10px;
    text-align: left;
  }

  .demo-form-ui {
    width: 70%;
    padding: 10px 0;
    box-sizing: border-box;
    border: 1px dashed #d6d7da;
    border-radius: 4px;
    overflow: auto;
  }

  .demo-form-source {
    width: 30%;
    overflow: auto;
    .source-inner {
      box-sizing: border-box;
      border: 1px dashed #d6d7da;
      border-radius: 4px;
      text-align: left;
      margin-left: 20px;
      padding: 10px;
      overflow: auto;
      height: 100%;
    }
  }
}
</style>
