<template>
  <div class="demo-form-box">
    <!-- 主题概述 -->
    <div class="demo-form-header">
      <div class="demo-details-header">
        <h2 class="demo-form-title">{{ title }}</h2>
        <a
          type="text"
          class="docs-btn"
          target="_blank"
          href="https://github.com/chengaohe45/vue-easy-form"
          >Github</a
        >
        <a
          type="text"
          class="docs-btn"
          target="_blank"
          :href="'https://chengaohe45.github.io' + docsHref"
          >{{ docsTitle }}</a
        >
        <el-button type="text" class="toggle-btn" @click="toggleHandler">{{
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

    <!-- 功能操作 -->
    <div class="demo-form-body">
      <div class="demo-btn-row">
        <el-button
          class="run-btn"
          type="primary"
          plain
          @click="runHandler"
          size="small"
          >运行schema</el-button
        >
        <!-- 运行错误或警告显示 -->
        <div class="run-msg-box">
          <transition name="bounce">
            <span :class="runRight ? 'run-msg' : 'run-msg error'" v-if="runMsg">
              {{ runMsg }}
            </span>
          </transition>
        </div>
      </div>
      <div class="demo-body-row">
        <!-- 源码操作栏 -->
        <div class="demo-es-source">
          <div class="demo-source-panel">
            <textarea
              class="textarea"
              autocomplete="off"
              placeholder="请输入内容"
              v-model="code"
            ></textarea>
          </div>
        </div>

        <!-- 效果输出栏 -->
        <div class="demo-es-result">
          <div class="demo-result-panel">
            <!-- 表单界面区 -->
            <div class="demo-form-ui-box">
              <h3 class="demo-title">表单输出</h3>
              <div class="demo-form-ui">
                <es-form
                  ref="form"
                  :schema="schema"
                  v-model="formValue"
                  :hasConsole="hasConsole"
                  @input="formInput"
                  @change="formChange"
                  @submit="formSubmit"
                  @inited="formInit"
                ></es-form>
              </div>
            </div>

            <!-- 表单操作区 -->
            <div class="demo-form-op-box" v-if="canOperate">
              <h3 class="demo-title">表单操作</h3>
              <div class="demo-form-set-wrap">
                <div class="demo-form-btn-row">
                  <el-button
                    size="small"
                    type="primary"
                    round
                    @click="validHandler"
                    >表单验证</el-button
                  >
                  <el-button size="small" round @click="resetHandler"
                    >重置</el-button
                  >
                </div>
                <div class="demo-form-set-row">
                  <div class="demo-op-title">
                    设置表单form.setValue(key, value):
                  </div>
                  <div class="demo-op-form-box">
                    <div class="demo-op-form-col">
                      <es-form
                        ref="opRef"
                        :schema="opSchema"
                        v-model="opValue"
                        :hasConsole="false"
                      ></es-form>
                    </div>
                    <el-button
                      class="demo-op-btn-col"
                      size="small"
                      type="primary"
                      @click="setValueHandler"
                      >提交值设置</el-button
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- 值输出显示区 -->
            <div class="demo-form-op-box">
              <h3 class="demo-title">表单值(formValue)</h3>
              <pre class="pre-box">{{ stringify(formValue) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import utils from "@/libs/utils";
import sysMixin from "../mixins/sys-mixin.js";
import utils from "../../../package/libs/utils";

import operateSchema from "../schemas/operation-schema.js";

export default {
  mixins: [sysMixin],
  data() {
    return {
      formValue: {},
      schema: {},
      code: "",
      openDetails: true,

      canOperate: false /* 是否可以打开操作区域 */,

      /* 值设置所用到 */
      opSchema: operateSchema,
      opValue: {}
    };
  },

  props: {
    formSchema: {
      type: Object,
      required: true
    },

    hasConsole: {
      type: Boolean,
      required: false,
      default: undefined
    },

    hasOperate: {
      /* 是否有操作区域：默认是没有的 */
      type: Boolean,
      required: false,
      default: false
    }
  },

  created() {
    window.demoVm = this; //test

    /* 当在开发环境时，都可以打开操作区域。为什么这样做，因为这个开发人员可以快速调试；对于用户来说是隐藏的，这样更易于学习，减少干扰 */
    this.$data.canOperate = this.hasOperate || process.env.NODE_ENV != "production";
    // this.$data.canOperate = this.hasOperate;

    this.$data.schema = this.formSchema;
    this.$data.code = this.stringify(this.formSchema, true);
  },

  computed: {},

  mounted() {
    this.initListener();
  },

  updated() {
    // console.log("update...");
  },

  methods: {
    stringify(value, isFromSchema = false) {
      return this.toJson(value, 1, isFromSchema);
    },

    /**
     * 点击运行
     */
    runHandler() {
      var rawSchema = this.runSchema(this.$data.code);
      if (rawSchema) {
        // 数据有效，返回一个对象
        this.$data.formValue = {};
        this.$data.schema = rawSchema;
      } else {
        // 数据不正确，runSchema已经做提示了
      }
    },

    /**
     * 点击表单验证
     */
    validHandler() {
      if (this.$refs.form.checkAll()) {
        this.$message({
          message: "调用form.checkAll(): 表单输入正确",
          type: "success"
        });
      } else {
        this.$message({
          message: "调用form.checkAll(): 表单输入不合法",
          type: "error"
        });
      }
    },

    /**
     * 点击重置
     */
    resetHandler() {
      this.$refs.form.reset();
      this.$message({
        message: "调用form.reset(): 重置成功",
        type: "success"
      });
    },

    setValueHandler() {
      if (this.$refs.opRef.checkAll()) {
        var opValue = this.$data.opValue;

        var value;
        try {
          eval("value = " + opValue.value);
        } catch (e) {
          this.$message({
            message: "值无法解析",
            type: "error"
          });
          console.error(e);
          return false;
        }

        if (opValue.key) {
          this.$refs.form.setValue(opValue.key, value);
        } else if (utils.isObj(value)) {
          this.$refs.form.setValue(value);
        } else {
          this.$message({
            message: "当key为空时，value必须是一个对象",
            type: "warning"
          });
        }
      }
    },

    /**
     * 点击详情切换
     */
    toggleHandler() {
      this.$data.openDetails = !this.$data.openDetails;
    },

    formInput(formValue, sourcePathKey) {
      if (this.hasConsole) {
        console.log("@input:", formValue, sourcePathKey);
      }
    },

    formChange(formValue, sourcePathKey) {
      if (this.hasConsole) {
        console.log("@change:", formValue, sourcePathKey);
      }
    },

    formSubmit(/*value*/) {
      this.$message({
        message: "触发了表单的提交事件",
        type: "success"
      });
    },

    formInit(formValue) {
      if (this.hasConsole) {
        console.log("inited: ", formValue);
      }
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
      margin: 0 5px 0 0;
      font-weight: 400;
      font-size: 22px;
      line-height: 24px;
    }

    .docs-btn {
      margin: 0 5px;
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
    justify-content: space-between;
    align-items: center;

    .run-btn {
      @include flex-fixed;
    }

    .run-msg-box {
      margin: 0;
      padding: 0 0 0 5px;
      min-width: 65%;
      text-align: left;
      box-sizing: border-box;
      // @include flex-fixed;
    }

    .run-msg {
      margin: 0;
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
    margin: 8px;
    overflow: auto;
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

    .demo-title {
      margin: 0 0 0 3px;
      padding: 0;
      font-weight: bold;
      font-size: 15px;
      line-height: 20px;
      text-align: left;
    }

    .demo-form-ui-box {
      margin: 10px;
    }

    .demo-form-ui {
      margin: 8px 0 0 0;
      padding: 10px 10px;
      border: 1px solid #d6d7da;
      border-radius: 4px;
    }

    .demo-form-op-box {
      margin: 10px 10px 0;
      padding-top: 10px;
      border-top: 1px dashed #d6d7da;
      text-align: left;

      .demo-form-set-wrap {
        margin-top: 8px;
        padding: 10px;
        background: #f3f3f3;
        border-radius: 3px;
      }

      .demo-form-btn-row {
        margin-top: 2px;
        text-align: center;
      }

      .demo-form-set-row {
        margin: 10px auto 0 auto;
        padding: 10px 10px 0;
        border-top: 1px dashed #d6d7da;
        max-width: 700px;
        text-align: center;

        .demo-op-title {
          margin-left: 50px;
          text-align: left;
          font-weight: bold;
        }

        .demo-op-form-box {
          margin-top: 10px;
          @include display-flex;
          align-items: flex-start;

          .demo-op-form-col {
            @include flex-full;
          }

          .demo-op-btn-col {
            margin: 4px 0 0 20px;
            @include flex-fixed;
          }
        }
      }
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
    animation: bounce-in 0.3s;
  }
  .bounce-leave-active {
    animation: bounce-in 0.1s reverse;
  }
  @keyframes bounce-in {
    0% {
      // transform: scale(0);
      opacity: 0;
    }
    // 50% {
    //   transform: scale(1.1);
    // }
    100% {
      // transform: scale(1);
      opacity: 1;
    }
  }
}
</style>
