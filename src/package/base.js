/**
 * base.js
 *
 * Copyright (c) 2019 chengaohe All rights reserved.
 *
 * 无缝对接vue组件
 *
 */

import utils from "./libs/utils.js";
import constant from "./libs/constant.js";
// import { throws } from "assert";

("use strict");

export default {
  render: function(createElement) {
    if (!this.config.name) {
      console.error("错误的config: ", this.config);
      throw "es-base config.name必须存在";
    }

    // 计算出props, attrs
    var newProps = {};
    var newAttrs = {};
    var domProps = {};

    var componentName = this.config.name.toLowerCase
      ? this.config.name.toLowerCase()
      : this.config.name;
    if (
      componentName === constant.TAG_INPUT && // 不区分大小写
      (this.config.props.type === constant.TYPE_RADIO ||
        this.config.props.type === constant.TYPE_CHECKBOX)
    ) {
      if (this.config.props.type === constant.TYPE_RADIO) {
        Object.assign(newAttrs, this.config.props);
        newAttrs.checked = this.value === this.config.props.value;

        Object.assign(newProps, this.config.props);
        if (newProps.hasOwnProperty("checked")) {
          delete newProps.checked;
        }

        domProps.checked = newAttrs.checked;
      } else {
        var checked = false;
        if (!utils.isUndef(this.config.props.trueValue)) {
          // 经测试，若指定了trueValue，无论falseValue是否指定，只有值等于trueValue，checked才为true
          if (this.value === this.config.props.trueValue) {
            checked = true;
          } else {
            checked = false;
          }
        } else if (!utils.isUndef(this.config.props.falseValue)) {
          // 经测试：当trueValue没有指定，falseValue指定，只有值等于falseValue，checked才为false
          if (this.value === this.config.props.falseValue) {
            checked = false;
          } else {
            checked = true;
          }
        } else {
          // 经测试：当trueValue和falseValue没有指定，checked才为!!this.value
          checked = !!this.value;
        }
        Object.assign(newAttrs, this.config.props);
        newAttrs.checked = checked;

        Object.assign(newProps, this.config.props);
        if (newProps.hasOwnProperty("checked")) {
          delete newProps.checked;
        }

        domProps.checked = newAttrs.checked;
      }
    } else {
      var newValue = utils.isRefVal(this.value)
        ? utils.deepCopy(this.value)
        : this.value; // 这样防止引用地址被组件内部修改
      if (!constant.FORM_INPUTS.includes(componentName)) {
        Object.assign(newAttrs, this.config.props);
        if (newAttrs.hasOwnProperty("value")) {
          delete newAttrs.value;
        }
        Object.assign(newProps, this.config.props);
        newProps.value = newValue;
      } else {
        Object.assign(newAttrs, this.config.props);
        if (newAttrs.hasOwnProperty("value")) {
          delete newAttrs.value;
        }

        Object.assign(newProps, this.config.props);
        if (newProps.hasOwnProperty("value")) {
          delete newProps.value;
        }

        // 经测试（value）：
        // textarea必须要在domProps才能显示；
        // input第一次可以在newAttrs写，之后也要在domProps才能显示值，所以也要是domProps才保险
        domProps.value = newValue;
      }
    }

    var vnode = createElement(
      this.config.name, // tag name 标签名称 https://www.cnblogs.com/tugenhua0707/p/7528621.html
      {
        // attrs: this.config.props, //attrs为原生属性
        attrs: newAttrs,

        class: this.config.class,

        style: this.config.style,

        // DOM属性
        domProps: domProps,
        // domProps: {
        //   // innerHTML: "baz"
        //   // value: this.config.value
        // },
        // 组件props
        props: newProps,
        // props: {
        //   // myProp: "bar",
        //   value: utils.isRefVal(this.value)
        //     ? utils.deepCopy(this.value)
        //     : this.value, // 这样防止引用地址被组件内部修改
        //   ...this.config.props
        //   // clearable: true,
        // },
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

    newAttrs = null;
    newProps = null;
    domProps = null;

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

    __parseInputEvent(eventData) {
      var eventValue;
      if (eventData && eventData.target && eventData.target.nodeName) {
        var tagName = eventData.target.tagName;
        var nodeType = eventData.target.type;
        if (tagName.toLowerCase() === constant.TAG_INPUT) {
          if (nodeType === constant.TYPE_RADIO) {
            if (eventData.target.checked) {
              eventValue = this.config.props.value;
            } else {
              eventValue = undefined;
            }
          } else if (nodeType === constant.TYPE_CHECKBOX) {
            if (eventData.target.checked) {
              eventValue = true;
              if (!utils.isUndef(this.config.props.trueValue)) {
                eventValue = this.config.props.trueValue;
              }
            } else {
              eventValue = false;
              if (!utils.isUndef(this.config.props.falseValue)) {
                eventValue = this.config.props.falseValue;
              }
            }
          } else {
            eventValue = eventData.target.value;
          }
        } else {
          eventValue = eventData.target.value;
        }
      } else {
        eventValue = eventData;
      }
      return eventValue;
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
            var eventValue = this.__parseInputEvent(eventData);
            // console.log("eventValue: ", this.value, eventValue);
            if (this.value !== eventValue) {
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
