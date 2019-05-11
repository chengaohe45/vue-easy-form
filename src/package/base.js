import parse from "./libs/parse.js";
import utils from "./libs/utils.js";
import constant from "./libs/constant.js";
import formUtils from "./libs/form-utils";

("use strict");

export default {
  render: function(createElement) {
    // console.log("start ..........................");
    // console.log(this.config.props);
    // console.log("end ..........................");
    if (!this.config.name) {
      throw "es-base config.name必须存在";
    }
    return createElement(
      this.config.name, // tag name 标签名称 https://www.cnblogs.com/tugenhua0707/p/7528621.html
      {
        attrs: this.$data.dataProps, //attrs为原生属性
        // style: this.config.style,
        // class: this.config.class,
        // DOM属性
        domProps: {
          // innerHTML: "baz"
          // value: this.config.value
        },
        // 组件props
        props: {
          // myProp: "bar",
          value: utils.isRefVal(this.value)
            ? utils.deepCopy(this.value)
            : this.value, // 这样防止引用地址被组件内部修改
          ...this.$data.dataProps
          // clearable: true,
        },
        // 事件监听基于 "on"
        // 所以不再支持如 "v-on:keyup.enter" 修饰语
        // 需要手动匹配 KeyCode
        on: this.$data.emitOn,
        // on: {
        //   // click: (event) => {
        //   // 	console.log("click...");
        //   // },
        //   input: event => {
        //     // console.log("input...", event);
        //     // this.value = event;
        //     if (this.value != event) {
        //       this.$emit("input", event);
        //     }
        //   },
        //   change: event => {
        //     // console.log("change", event);
        //     this.$emit("change", event);
        //   }
        // },

        // 仅对于组件，用于监听原生事件，而不是组件内部使用 `vm.$emit` 触发的事件。
        nativeOn: this.$data.nativeOn,
        // nativeOn: {
        // click: this.nativeClickHandler
        // change: (event) => {
        //   // console.log("change", event);
        //   this.$emit("change", event);
        // }
        // },
        // 自定义指令。注意事项：不能对绑定的旧值设值
        // Vue 会为您持续追踪
        directives: [
          // {
          // 	name: "my-custom-directive",
          // 	value: "2",
          // 	expression: "1 + 1",
          // 	arg: "foo",
          // 	modifiers: {
          // 		bar: true
          // 	}
          // }
        ],
        // Scoped slots in the form of
        // { name: props => VNode | Array<VNode> }
        scopedSlots: {
          // default: props => createElement('span', props.text + "test3")
        },
        // 如果组件是其他组件的子组件，需为插槽指定名称
        // slot: "name-of-slot",
        // 其他特殊顶层属性
        // key: "myKey",
        ref: "__comTarget__"
      },
      // [createElement('span', "test")]
      // ["test2"]
      // "测试{{config.value}}" // 子组件中的阵列
      this.dataText
    );
  },
  props: {
    openSmart: {
      type: Boolean,
      required: false,
      default: true
    },

    config: {
      type: Object,
      required: true,
      default: () => {
        return {
          name: "", //lg-element 组件 原生组件
          // value: "",
          // attrs: {},
          // style: {},
          // class: {},
          props: {}
        };
      }
    },

    formData: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    },

    global: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    },

    emitEvents: {
      type: Array,
      required: false,
      default: null
    },

    nativeEvents: {
      type: Array,
      required: false,
      default: null
    },

    index: {
      type: Number,
      required: false,
      default: -1
    },

    idxChain: {
      //组成形式（索引,索引,索引）如：0、0,1、 1,12；“索引”用逗号隔开 通俗讲：因为array的值必须是一个数组，array里面包含array(不一定是孩子，也可能是孙子等)，每一个“索引”代表对应array的哪一项
      // 用于记录在数组中的索引
      type: String,
      required: false,
      default: ""
    },

    value: {
      type: [Object, String, Date, Array, Boolean, Number],
      required: false
    }
  },

  data() {
    return {
      // hasEsScript: false,
      unGlobalWatch: false,
      unFormDataWatch: false,
      dataProps: {},
      dataText: null,
      emitOn: null,
      nativeOn: null
    };
  },

  created() {
    this.initUi();
  },

  methods: {
    initUi() {
      if (this.openSmart) {
        if (this.needWatch()) {
          this.setWatch(); //监听formData，当其值必变时，则props也要重新执行一遍
        } else {
          this.cancelWatch();
        }
        this.parseData();
        this.createOn();
      } else {
        this.cancelWatch();
        this.$data.dataProps = utils.deepCopy(this.config.props);
      }
    },

    //判断组件的props是否存在es语句
    needWatch() {
      var hasEsScript = false;
      for (var key in this.config.props) {
        if (key != "value") {
          //过滤掉value,要不然会换掉this.value
          var scriptTxt = this.config.props[key];
          if (parse.isEsScript(scriptTxt)) {
            hasEsScript = true;
            break;
          }
        }
      }
      if (parse.isEsScript(this.config.text)) {
        hasEsScript = true;
      }
      return hasEsScript;
    },

    eventHandler(eventName, eventData) {
      this.$emit("trigger", eventName, eventData);
    },

    /**
     * 创建所需要监听的事件
     */
    createOn() {
      var emitEvents;
      if (this.emitEvents) {
        emitEvents = utils.deepCopy(this.emitEvents);
        if (!emitEvents.includes(constant.INPUT_EVENT)) {
          emitEvents.push(constant.INPUT_EVENT);
        }
      } else {
        emitEvents = [constant.INPUT_EVENT];
      }

      // emit发出的事件
      var emitOn = {};
      emitEvents.forEach(eventName => {
        if (eventName == constant.INPUT_EVENT) {
          emitOn[eventName] = eventData => {
            var eventValue;
            if (eventData && eventData.target && eventData.target.nodeName) {
              eventValue = eventData.target.value;
            } else {
              eventValue = eventData;
            }
            if (this.value !== eventValue) {
              // console.log("eventValue: ", eventValue);
              this.$emit("input", eventValue);
              this.eventHandler(eventName, eventValue);
            }
          };
        } else {
          emitOn[eventName] = eventData => {
            this.eventHandler(eventName, eventData);
          };
        }
      });

      this.$data.emitOn = Object.keys(emitOn).length > 0 ? emitOn : null;

      //原生事件
      // emit发出的事件
      if (this.nativeEvents && this.nativeEvents.length > 0) {
        var nativeOn = {};
        var nativeEvents = utils.deepCopy(this.nativeEvents);
        nativeEvents.forEach(eventName => {
          nativeOn[eventName] = eventData => {
            this.eventHandler(eventName + "." + constant.ADJ_NATIVE, eventData);
          };
        });

        this.$data.nativeOn =
          Object.keys(nativeOn).length > 0 ? nativeOn : null;
      } else {
        this.$data.nativeOn = null;
      }
    },

    parseData() {
      this.$data.dataProps = this.analyzeVal();
      var parseSources = {
        global: this.global,
        rootData: this.formData,
        index: this.index,
        idxChain: this.idxChain,
        rootSchema: formUtils.getRootSchema(this)
      };
      var dataText = parse.smartEsValue(this.config.text, parseSources);
      if (typeof dataText == "string") {
        this.$data.dataText = dataText;
      } else {
        this.$data.dataText = null;
      }
      // console.log("this.dataText", this.dataText);
    },

    analyzeVal() {
      var dataProps = {};
      for (var key in this.config.props) {
        if (key != "value") {
          //过滤掉value,要不然会换掉this.value
          var scriptTxt = this.config.props[key];
          var parseSources = {
            global: this.global,
            rootData: this.formData,
            index: this.index,
            idxChain: this.idxChain,
            rootSchema: formUtils.getRootSchema(this)
          };

          dataProps[key] = parse.smartEsValue(scriptTxt, parseSources);
        }
      }
      return dataProps;
    },
    setWatch() {
      if (!this.$data.unGlobalWatch) {
        this.$data.unGlobalWatch = this.$watch(
          "global",
          () => {
            // this.$data.dataProps = this.analyzeVal();
            this.parseData();
          },
          {
            deep: false
          }
        );
      }

      if (!this.$data.unFormDataWatch) {
        this.$data.unFormDataWatch = this.$watch(
          "formData",
          () => {
            this.parseData();
          },
          {
            deep: false
          }
        );
      }
    },

    cancelWatch() {
      if (this.$data.unGlobalWatch) {
        this.$data.unGlobalWatch();
        this.$data.unGlobalWatch = false;
      }
      if (this.$data.unFormDataWatch) {
        this.$data.unFormDataWatch();
        this.$data.unFormDataWatch = false;
      }
    }
  },

  destroyed() {},

  watch: {
    config: {
      handler: function(/* newVal, oldVal */) {
        // console.log("base.config here...");
        this.initUi();
      },
      deep: false
    }
  }
};
