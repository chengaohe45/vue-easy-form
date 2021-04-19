<template>
  <div class="demo-custom"
    :class="{ 'hover': hovering, 'no-top-line': noTopLine}"
    @mouseenter="hovering = true"
    @mouseleave="hovering = keepEnter ? true : false">
    <div class="demo-list-box">
      <slot name="demo"></slot>
    </div>
    <!-- 表单操作区 -->
    <div class="demo-higlight" :style="{height: isExpanded ? 'auto' : minHeight + 'px'}">
      <slot></slot>
    </div>
    <div class="demo-custom-control" @click="isExpanded = !isExpanded">
      <transition name="arrow-slide">
        <i :class="[iconClass, { 'hovering': hovering }]"></i>
      </transition>
      <transition name="text-slide">
        <span class="txt" v-show="hovering">{{ controlText }}</span>
      </transition>
      <el-tooltip effect="dark" content="存在自定义组件，可往实例运行" placement="right">
        <transition name="text-slide">
          <a v-show="hovering || isExpanded"
            @click.stop
            target="_blank"
            :href="'https://chengaohe45.github.io/vue-easy-form-docs/demo/' + hash"
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
  // import operateSchema from "@/components/demo-frame/schemas/operation-schema.js";

  export default {
    data() {
      return {
        isExpanded: false,
        hovering: false
    
      };
    },
    
    props: {
      minHeight: {
        type: Number,
        required: false,
        default: 0
      },
      hash: {
        type: String,
        required: false,
        default: ""
      },
      keepEnter: {
        type: Boolean,
        required: false,
        default: false
      },
      open: {
        type: Boolean,
        required: false,
        default: false
      },
      noTopLine: {
        type: Boolean,
        required: false,
        default: false
      },
      toggleTexts: {
        type: Array,
        required: false,
        default: () => {
          return ["显示代码", "隐藏代码"]
        }
      }
    },

    computed: {

      iconClass() {
        return this.isExpanded ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      },

      controlText() {
        return this.isExpanded ? this.toggleTexts[1] : this.toggleTexts[0];
      }
    },


    created() {
      this.$data.isExpanded = this.open;
      this.$data.hovering = this.keepEnter ? true : false;
    },

    mounted() {
      
    },

    methods: {
      
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

  .demo-custom {
    
    margin-top: 20px;
    font-size: 14px;
    border: solid 1px #ebebeb;
    border-radius: 3px;
    overflow: hidden;
    transition: .2s;



      &.no-top-line {
        margin-top: 5px;
      }

    .global-box {
      text-align: left;
      margin-left: 5px;
      padding-bottom: 3px;
    }

    .demo-list-box {
      max-height: 800px;
      overflow: auto;
      padding: 20px;
      border-top: 1px solid #eaeefb;
      // border-bottom: 1px solid #eaeefb;

      font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;

      &:empty {
        padding-top: 0px;
        padding-bottom: 0px;
        border-top: none;
        // border-bottom: none;
      }

    }

    &.no-top-line .demo-list-box {
      border-top: none;
    }

    .demo-higlight {
      overflow: hidden;
    }
    
    .demo-higlight pre {
      margin: 0;
      // border-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }
    
    .demo-higlight .extra-class {
      // border-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }

    .demo-list-box:not(:empty) + .demo-higlight {
      pre {
        margin: 0;
        border-radius: 0;
      }
      
      .extra-class {
        border-radius: 0;
      }
    }

    .error-msg {
      text-align: center;
      color: #F56C6C;
    }

    .demo-custom-control {
      border-top: solid 1px #eaeefb;
      height: 44px;
      box-sizing: border-box;
      background-color: #fff;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      text-align: center;
      // margin-top: -1px;
      color: #d3dce6;
      cursor: pointer;
      position: relative;
      // background-color: #f9fafc;
    
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
