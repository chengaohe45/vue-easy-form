// import parse from "./libs/parse.js";
import utils from "./libs/utils.js";
import constant from "./libs/constant.js";
// import formUtils from "./libs/form-utils";

("use strict");

export default {
  render: function(createElement) {
    // console.log("start ..........................");
    // console.log(this.config.props);
    // console.log("end ..........................");
    if (!this.config.name) {
      console.error("错误的config: ", this.config);
      throw "es-base config.name必须存在";
    }

    var vnode = createElement(
      this.config.name, // tag name 标签名称 https://www.cnblogs.com/tugenhua0707/p/7528621.html
      {
        attrs: this.config.props, //attrs为原生属性

        class: this.config.class,

        style: this.config.style,

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
          ...this.config.props
          // clearable: true,
        },
        // 事件监听基于 "on"
        // 所以不再支持如 "v-on:keyup.enter" 修饰语
        // 需要手动匹配 KeyCode
        on: this.$data.emitOn,

        // 仅对于组件，用于监听原生事件，而不是组件内部使用 `vm.$emit` 触发的事件。
        nativeOn: this.$data.nativeOn,

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
      this.config.text
    );

    // 去除多余的原生属性；去不去掉感觉都没有什么，好像没有影响到功能，只是页面上会显示原生属性
    var componentOptions = vnode.componentOptions;
    var dataAttrs = {};
    var comProps =
      componentOptions && componentOptions.Ctor.options.props
        ? componentOptions.Ctor.options.props
        : false;
    var thisProps = this.config.props;
    if (
      comProps &&
      thisProps &&
      Object.keys(comProps).length &&
      Object.keys(thisProps).length
    ) {
      var comPropsKeys = Object.keys(comProps); // 经测试：就算在定义中声明为中划线形式，这里也会返回驼峰式，如 'text-str' => 'textStr'
      for (var key in thisProps) {
        if (!comPropsKeys.includes(key)) {
          dataAttrs[key] = thisProps[key];
        }
      }
      if (vnode.data) {
        vnode.data.attrs = dataAttrs;
      }
    }

    return vnode;
  },
  // inheritAttrs: false,
  props: {
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

    value: {
      type: [Object, String, Date, Array, Boolean, Number],
      required: false
    }
  },

  data() {
    return {
      emitOn: null,
      nativeOn: null
    };
  },

  created() {
    this.initUi();
  },

  methods: {
    initUi() {
      this.createOn();
    },

    eventHandler(eventName, eventData) {
      this.$emit("trigger", eventName, eventData, this.$refs.__comTarget__);
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
