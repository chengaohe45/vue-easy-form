<template>
  <div class="demo-block"
    :class="{ 'hover': hovering }"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false">
    <div class="demo-form-box">
      <es-form v-if="formSchema" ref="form" :schema="formSchema" v-model="formValue"></es-form>
      <div class="error-msg" v-else-if="errMsg">{{errMsg}}</div>
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
      <transition name="text-slide">
        <a v-show="hovering || isExpanded"
          @click.stop
          target="_blank"
          :href="href"
          class="txt control-button">
          在线运行
        </a>
      </transition>
    </div>
  </div>
</template>

<style lang="scss">
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
      border-bottom: 1px solid #eaeefb;
    }

    // .demo-higlight pre code{
    //   color: #000;
    // }

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

    // .hljs {
    //   line-height: 1.8;
    //   font-size: 12px;
    //   padding: 18px 24px;
    //   background-color: #fafafa;
    //   border: none;
    //   -webkit-font-smoothing: auto;
    // }

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
        line-height: 20px;
        position: absolute;
        top: 13px;
        right: 0px;
        font-size: 14px;
        padding-left: 3px;
        padding-right: 3px;
        color: #409EFF;
        text-decoration: none;
        border-bottom: 1px solid transparent;

        &:hover {
          text-decoration: none;
          border-bottom-color: #409EFF;
        }
      }
    }

  }
</style>

<script>
  
  import Vue from 'vue';
  // import hljs from 'highlight.js';
  // import "highlight.js/styles/color-brewer.css";
  import './entry';
  import utils from '@/libs/utils'

  export default {
    data() {
      return {
        isExpanded: false,
        hovering: false,
        errMsg: false,
        formValue: {},
        formSchema: false
        
      };
    },
    
    props: {
      href: {
        type: String,
        required: false,
        default: "https://chengaohe45.github.io/vue-easy-form-docs/dist/"
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
      }
    }
  };
</script>
