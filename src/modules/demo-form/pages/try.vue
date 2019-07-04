<template>
  <div class="demo-try-box">
    <div class="demo-try-body">
      <div class="demo-try-ui">
        <div class="demo-try-wrap">
          <es-form
            ref="form"
            :schema="formSchema"
            v-model="formValue"
          ></es-form>
        </div>
        <div class="note">
          注：灰色背景就是表单的内容区域.
          <br />
          (可以拷例子过来，注意例子不要有<span class="em">自定义组件或函数</span
          >哦, 因为配置stringify没有把这两个东西格式化)
        </div>
        <div class="demo-try-value-box">
          <div>
            表单值(formValue):
            <pre>{{ JSON.stringify(formValue, null, 2) }}</pre>
          </div>
        </div>
      </div>
      <div class="demo-try-source">
        <div class="source-inner">
          <strong>formSchema:</strong>
          <div class="source-area-box">
            <!-- <el-input
              type="textarea"
              class="area"
              placeholder="请输入内容"
              v-model="formSchemaTxt">
            </el-input> -->
            <textarea
              class="area"
              placeholder="请输入内容"
              v-model="formSchemaTxt"
            ></textarea>
          </div>
          <div class="source-btn-box">
            <!-- <el-button>重置</el-button> -->
            <el-button type="primary" @click="execSchema">执行</el-button>
          </div>
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

      formValue2: null,
      rawFormValue: "",
      checkResult: null,
      errorMsg: "",

      defaultSchemaTxt: JSON.stringify(
        {
          name: {
            label: "es: {{$root}}.clickTotal > 255 ? '名称1': '名称2'",
            component: "el-input",
            value: "首页位置"
          },
          clickTotal: {
            label: {
              text: "点击量"
            },
            component: {
              name: "el-input-number",
              props: {
                // step: "es: {{$root}}.clickTotal >= 255 ? 1 : 2"
              }
            },
            rules: {
              checks: {
                handler: "es: {{$root.clickTotal}}>=255",
                trigger: "input"
              },
              errMsg: "点击量不能小于255."
            },
            value: 253
          }
        },
        null,
        2
      ),

      formSchemaTxt: "",

      clickTotal: 0,

      formSchema: {
        name: {
          label: "广告名称",
          component: {
            name: "el-input",
            ref: "name"
          },
          value: "初始化时，右边的代码不是我的源代码"
        },
        clickTotal: {
          label: {
            text: "点击量"
          },
          // isTrim: false,
          component: {
            name: "el-input",
            // ref: "clickTotal",
            props: {
              step: 1
              // step: "es: {{$root}}.clickTotal >= 255 ? 1 : 2",
            }
            // actions: {
            //   trigger: "input",
            //   handler: value => {
            //     // this.$data.formValue = { name: "he88" + value };
            //     // this.$refs.form.setValue("name", "he88-" + value);
            //     // console.log("try actions: ", value);
            //   }
            // }
          },
          rules: {
            // checks: {
            //   name: "es: {{$root.clickTotal}}>=255",
            //   trigger: "input"
            // },
            // errMsg: "点击量不能小于255"
          },
          value: 255
        }
      }
    };
  },

  props: {
    title: {
      type: String,
      required: false,
      default: "demo标题"
    },

    hasValue: {
      type: Boolean,
      required: false
    }
  },

  created() {
    this.$data.formSchemaTxt = this.$data.defaultSchemaTxt;
  },

  computed: {},

  mounted() {},

  methods: {
    parse(objTxt) {
      var scriptTxt = "return (" + objTxt + ");";
      try {
        var result = new Function(scriptTxt)();
        // console.log("result", result);
        this.$data.formValue = {};
        this.$data.formSchema = result;
      } catch (e) {
        var errMsg = "解析出错";
        if (typeof e == "string") {
          errMsg = e;
        }
        console.error("e: ", e);
        this.$notify.error({
          title: "错误",
          message: errMsg
        });
      }
    },

    execSchema() {
      this.parse(this.$data.formSchemaTxt);
    },

    formInput(value, sourcePathKey) {
      console.log("try -----formInput: ", value, sourcePathKey);
    },

    formChange(value, sourcePathKey) {
      console.log("try ---- formChange: ", value, sourcePathKey);
    }
  },
  components: {}
};
</script>

<style lang="scss">
@import "@/static/css/mixins.scss";

.demo-try-box {
  @include display-flex;
  @include direction-v;
  @include flex-full;
  overflow: hidden;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  font-size: 14px;

  .demo-try-wrap {
    margin: 10px;
    padding: 0;
    background: rgba(0, 0, 0, 0.1);
  }

  .note {
    margin-left: 10px;
    text-align: left;
    font-size: 12px;
    color: #aaa;
    line-height: 16px;

    .em {
      color: #f56c6c;
    }
  }

  .demo-try-body {
    overflow: auto;
    @include flex-full;
    height: 100%;
    @include display-flex;
    @include direction-h;
    padding-top: 20px;
    box-sizing: border-box;
  }

  .demo-try-value-box {
    margin: 20px 10px 0 10px;
    border-top: 1px dashed #d6d7da;
    padding: 10px;
    text-align: left;
  }

  .demo-try-ui {
    width: 70%;
    padding: 10px 0;
    box-sizing: border-box;
    border: 1px dashed #d6d7da;
    border-radius: 4px;
    overflow: auto;
  }

  .demo-try-source {
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
      @include display-flex;
      @include direction-v;
    }

    .source-area-box {
      margin-top: 5px;
      @include flex-full;
      @include display-flex;
      @include direction-v;

      .area {
        width: 100%;
        height: 100%;
        @include flex-full;

        display: block;
        resize: vertical;
        padding: 5px 10px;
        line-height: 1.5;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 100%;
        font-size: inherit;
        color: #606266;
        background-color: #fff;
        background-image: none;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        -webkit-transition: border-color 0.2s
          cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        outline: none;
      }

      .area:hover {
        border-color: #c8d6e9;
      }

      .area:focus {
        border-color: #409eff;
      }
    }
    .source-btn-box {
      margin-top: 10px;
      text-align: center;
    }
  }
}
</style>
