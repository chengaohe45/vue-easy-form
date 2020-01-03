<template>
  <div class="demo-block"
    :class="{ 'hover': hovering }"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false">
    <div class="demo-form-box">
      <es-form v-if="formSchema" ref="form" :global="formGlobal" :schema="formSchema" v-model="formValue"></es-form>
      <div class="error-msg" v-else-if="errMsg">{{errMsg}}</div>
    </div>
    <!-- 表单操作区 -->
    <div class="demo-form-op-box" v-if="!errMsg && canOperate">
      <h3 class="demo-title">实例操作区</h3>
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
          <el-button v-if="formGlobal" size="small" round @click="toggleGlobalHandler" class="toggle-btn"
            >当前global.status为{{formGlobal.status}} >> 切换</el-button
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
                :global="opGlobal"
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
    <div class="demo-higlight" v-show="isExpanded">
      <slot></slot>
    </div>
    <div class="demo-block-control" @click="isExpanded = !isExpanded">
      <transition name="arrow-slide">
        <i :class="[iconClass, { 'hovering': hovering }]"></i>
      </transition>
      <transition name="text-slide">
        <span class="txt" v-show="hovering">{{ controlText }}</span>
      </transition>
      <el-tooltip v-if="!hash" effect="dark" content="前往codepen.io运行" placement="right">
        <transition name="text-slide">
          <el-button
            v-show="hovering || isExpanded"
            size="small"
            type="text"
            class="control-button"
            @click.stop="goCodepen">
            在线运行
          </el-button>
        </transition>
      </el-tooltip>
      <el-tooltip v-else effect="dark" content="存在自定义组件，只能前往实例运行" placement="right">
        <transition name="text-slide">
          <a v-show="hovering || isExpanded"
            @click.stop
            target="_blank"
            :href="'https://chengaohe45.github.io/vue-easy-form-docs/dist/' + hash"
            class="control-link">
            在线运行
          </a>
        </transition>
      </el-tooltip>
    </div>
  </div>
</template>


<script>
  
  import Vue from 'vue';
  import './entry';
  import utils from '@/libs/utils';
  import packageJson from '@/../package.json';
  import operateSchema from "@/components/demo-frame/schemas/operation-schema.js";

  export default {
    data() {
      return {

        /* 值设置所用到 */
        opGlobal: {
          fromDoc: true
        },
        opSchema: operateSchema,
        opValue: {},

        isExpanded: false,
        hovering: false,
        errMsg: false,
        formValue: {},
        formSchema: false,
        formGlobal: undefined,
        codepen: {
          script: '',
          html: '',
          style: ''
        }
      };
    },
    
    props: {
      hash: {
        type: String,
        required: false,
        default: undefined
      },
      canOperate: {
        type: Boolean,
        required: false,
        default: false
      },
      open: {
        type: Boolean,
        required: false,
        default: false
      }
    },

    computed: {

      iconClass() {
        return this.isExpanded ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      },

      controlText() {
        return this.isExpanded ? "隐藏代码" : "显示代码";
      }
    },


    created() {
      this.$data.isExpanded = this.open;
      // console.log(utils.deepCopy(this.$slots));
      // 看是否存在：因为可能经过了vuepress编辑，文本找散了
      var result = this.getSchema();
      if (utils.isObj(result)) {
        this.$data.formSchema = result;
      } else if (utils.isStr(result)) {
        this.$data.errMsg = result;
      }
    },

    mounted() {
      if (this.$data.formSchema === false) {
        var result = this.getSchema();
        if (utils.isObj(result)) {
          this.$data.formSchema = result;
        } else if (utils.isStr(result)) {
          this.$data.errMsg = result;
        }
      }
    },

    methods: {
      getSchema() {
        var schema = false;
        var defaultNodes = this.$slots.default;
        if (defaultNodes && defaultNodes[0] && defaultNodes[0].elm) {
          var txt = defaultNodes[0].elm.innerText;
          // txt = "aaaa export default {dafdf"
          var reg = /export\s+default(\s|\n)*\{/g;
          var lastSection = txt.split(reg)[2];
          // console.log(txt.split(reg))
          if (lastSection) {
            var lastIndex = lastSection.lastIndexOf("}");
            var dataTxt = lastSection.substr(0, lastIndex);
            dataTxt = dataTxt.trim();
            this.codepen.script = dataTxt;
            var scriptTxt = "return ({" + dataTxt + "});";
            // console.log(scriptTxt);
            var dataSchema = false;
            var result;
            try {
              result = new Function(scriptTxt)();
              result = result.data();
              var tmpSchema = result.schema || result.formSchema;
              if (utils.isObj(tmpSchema) && Object.keys(tmpSchema).length > 0) {
                dataSchema = tmpSchema;

                // 取全局
                var tmpGlobal = result.global || result.formGlobal;
                if (utils.isObj(tmpGlobal) && Object.keys(tmpGlobal).length > 0) {
                  this.$data.formGlobal = tmpGlobal;
                  this.$data.codepen.html = '<es-form :schema="formSchema" :global="formGlobal" v-model="formValue"></es-form>';
                } else {
                  this.$data.codepen.html = '<es-form :schema="formSchema" v-model="formValue"></es-form>';
                }
              } else {
                dataSchema = "数据不正确: data必须存在对象schema且不能为空";
              }
            } catch (e) {
              dataSchema = "数据不正确";
            }
            schema = dataSchema;
          } else {
            // schema = false;
          }
        } else {
          // schema = false;
        }
        return schema;
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

      toggleGlobalHandler() {
        var formGlobal = this.$data.formGlobal;
        if (formGlobal && formGlobal.hasOwnProperty("status")) {
          formGlobal.status = !formGlobal.status;
        }
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

      goCodepen() {
        var useScript = 'Vue.use(window["esForm"], { // 进行全局配置' + 
            '\n   rowSpace: 12, // 系统默认为20' + 
            '\n   defaultCom: "el-input", // 默认组件改为el-input' + 
            '\n   trimDoms: ["input", "textarea", "el-input"], ' +
            '\n   hasConsole: true  // 打开控制台' + 
            '\n});'
        const elmRawVersion = packageJson.devDependencies["element-ui"] || packageJson.dependencies["element-ui"];
        const elmReg = /\d+(\.\d+)*/g;
        const elmVersion = elmRawVersion.match(elmReg)[0];
        const formVersion = packageJson.version;
        const { script, html, style } = this.$data.codepen;
        const resourcesTpl = '<scr' + 'ipt src="//unpkg.com/vue/dist/vue.js"></scr' + 'ipt>' +
        '\n<scr' + `ipt src="//unpkg.com/element-ui@${ elmVersion }/lib/index.js"></scr` + 'ipt>' + 
        '\n<scr' + `ipt src="//unpkg.com/vue-easy-form@${ formVersion }/dist/es-form.umd.min.js"></scr` + 'ipt>';
        let jsTpl = useScript + '\n\nvar Main = {\n   ' + script + '\n}';
        let htmlTpl = `${resourcesTpl}\n<div id="app" style="font-size: 14px;">\n  ${html.trim()}\n</div>`;
        let cssTpl = `@import url("//unpkg.com/element-ui@${ elmVersion }/lib/theme-chalk/index.css");\n${(style || '').trim()}\n`;
        jsTpl = jsTpl
          ? jsTpl + '\nvar Ctor = Vue.extend(Main)\nnew Ctor().$mount(\'#app\')'
          : 'new Vue().$mount(\'#app\')';
        const data = {
          js: jsTpl,
          css: cssTpl,
          html: htmlTpl
        };
        const form = document.getElementById('fiddle-form') || document.createElement('form');
        while (form.firstChild) {
          form.removeChild(form.firstChild);
        }
        form.method = 'POST';
        form.action = 'https://codepen.io/pen/define/';
        form.target = '_blank';
        form.style.display = 'none';

        const input = document.createElement('input');
        input.setAttribute('name', 'data');
        input.setAttribute('type', 'hidden');
        input.setAttribute('value', JSON.stringify(data));

        form.appendChild(input);
        document.body.appendChild(form);

        form.submit();
      }
    }
  };
</script>

<style lang="scss">
  @import "@/static/css/mixins.scss";
  // 覆盖一下样式，因为被vuepress>table影响了
  .el-date-table {
    margin: 0;
    display: table;
    border-collapse: separate;
    border-spacing: 0;
    border: none;

    td {
      border: none;
    }

    th {
      border: none;
      border-bottom-width: 1px;
    }

    tr:nth-child(2n) {
      background-color: transparent;
    }
  }

  .es-form-array-table {
    
    table {
      margin: 0;
      display: table;
      border-collapse: separate;
      border-spacing: 0;
      border: none;
    }

    td {
        border: none;
        border-top-width: 1px;
        border-right-width: 1px;
      }

      th {
        border: none;
        border-top-width: 1px;
        border-right-width: 1px;
      }

    tr:nth-child(2n) {
      background-color: transparent;
    }
  }

  .demo-block {
    
    margin-top: 20px;
    position: relative;
    z-index: 100;
    font-size: 14px;
    border: solid 1px #ebebeb;
    border-radius: 3px;
    overflow: hidden;
    transition: .2s;

    .demo-form-box {
      padding: 20px;
      // border-bottom: 1px solid #eaeefb;

      font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;
      
    }
    
    .demo-higlight pre {
      margin: 0;
      border-radius: 0;
    }
    
    .demo-higlight .extra-class {
      border-radius: 0;
    }

    .error-msg {
      text-align: center;
      color: #F56C6C;
    }

    .demo-block-control {
      border-top: solid 1px #eaeefb;
      height: 44px;
      box-sizing: border-box;
      background-color: #fff;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      text-align: center;
      margin-top: -1px;
      color: #d3dce6;
      cursor: pointer;
      position: relative;
    
      &.is-fixed {
        position: fixed;
        bottom: 0;
        width: 868px;
      }

      i {
        font-size: 16px;
        line-height: 44px;
        transition: .3s;
        &.hovering {
          transform: translateX(-40px);
        }
      }

      > .txt {
        position: absolute;
        transform: translateX(-30px);
        font-size: 14px;
        line-height: 44px;
        transition: .3s;
        display: inline-block;
      }

      &:hover {
        color: #409EFF;
        background-color: #f9fafc;
      }

      & .text-slide-enter,
      & .text-slide-leave-active {
        opacity: 0;
        transform: translateX(10px);
      }
      
      .control-button {
        // line-height: 20px;
        position: absolute;
        top: 6px;
        right: 10px;
        font-size: 14px;
        padding-left: 3px;
        padding-right: 3px;
        color: #409EFF;
        text-decoration: none;
        // border-bottom: 1px solid transparent;

        &:hover {
          text-decoration: none;
          // border-bottom-color: #409EFF;
        }
      }

      .control-link {
        line-height: 34px;
        position: absolute;
        top: 6px;
        right: 10px;
        font-size: 14px;
        padding-left: 3px;
        padding-right: 3px;
        color: #409EFF;
        text-decoration: none;
        display: inline-block;
        // border-bottom: 1px solid transparent;
        outline: 0;
        margin: 0;
        -webkit-transition: .1s;
        transition: .1s;

        &:hover {
          text-decoration: none;
          // border-bottom-color: #409EFF;
        }
      }

    }

    .demo-form-op-box {
      // margin: 10px 10px 0;
      // padding-top: 10px;
      // border-top: 1px dashed #d6d7da;
      border-top: 1px solid #eaeefb;
      background: #f3f3f3;
      text-align: left;

      .demo-title {
        margin: 0;
        padding: 5px;
        line-height: 20px;
        font-size: 15px;
      }

      .toggle-btn {
        width: 220px;
      }

      .demo-form-set-wrap {
        // margin-top: 8px;
        padding: 10px;
        
        // border-radius: 3px;
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
</style>
