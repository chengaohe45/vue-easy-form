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
import dataCache from "./libs/data-cache.js";
import { parseComponent } from "./libs/component-utils";

("use strict");

export default {
  render: function(createElement) {
    return this.renderUi(
      createElement,
      this.config,
      false,
      constant.COM_TARGET_REF
    );
  },
  // inheritAttrs: false,
  props: {
    config: {
      type: Object,
      required: true,
      default: () => {
        return {
          name: "" //lg-element 组件 原生组件
          // value: "",
          // attrs: {},
          // style: {},
          // class: {},
          // props: {}
        };
      }
    },

    // 当!!this.info为非真时，处理事件会让父级处理
    info: {
      type: Object,
      required: true,
      default: undefined
    },

    /* 是否是主组件：也就是右边的组件；当为真时，处理事件会让父级处理 */
    isMain: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      emitOn: null,
      nativeOn: null,
      scopedSlots: undefined
    };
  },

  created() {
    this.initUi();
  },

  methods: {
    initUi() {
      var ref = constant.COM_TARGET_REF;
      this.$data.emitOn = this.createEmitOn(this.config, this.isMain, ref);
      this.$data.nativeOn = this.createNativeOn(this.config, this.isMain, ref);
      this.$data.scopedSlots = this.createScopedSlots(this.config, ref);
    },

    /**
     * 渲染函数
     * @param {*} createElement 创建VNode的函数
     * @param {*} config        组件设置
     * @param {*} isSlotCom     是否插槽的组件，因为事件不一样，插槽数据也不一样
     * @returns VNode
     */
    renderUi(createElement, config, isSlotCom, ref) {
      var vnode;
      // 根据vue源代码, VNode是不会被劫持的
      if (utils.isVNode(config)) {
        vnode = config;
      } else if (utils.isObj(config)) {
        if (!config.name) {
          console.error("错误的config: ", config);
          throw "es-base config.name必须存在";
        }

        // 防止props不存在
        var configProps = config.props ? config.props : {};

        // 计算出props, attrs
        var newProps = {};
        var newAttrs = {};
        var domProps = {};

        var directives = config.directives
          ? utils.deepCopy(config.directives)
          : []; // false, 不是数组也没有事

        var componentName = config.name.toLowerCase
          ? config.name.toLowerCase()
          : config.name;
        if (
          componentName === constant.TAG_INPUT && // 不区分大小写
          (configProps.type === constant.TYPE_RADIO ||
            configProps.type === constant.TYPE_CHECKBOX)
        ) {
          if (configProps.type === constant.TYPE_RADIO) {
            Object.assign(newAttrs, configProps);
            if (config.hasOwnProperty("value")) {
              // 用户设置了value的情况
              newAttrs.checked = config.value === configProps.value;
            } else {
              // 没有用户value
              newAttrs.checked =
                configProps.hasOwnProperty("checked") &&
                configProps.checked !== false
                  ? true
                  : false;
            }

            Object.assign(newProps, configProps);
            if (newProps.hasOwnProperty("checked")) {
              delete newProps.checked;
            }

            domProps.checked = newAttrs.checked;
          } else {
            var checked = false;
            if (config.hasOwnProperty("value")) {
              if (!utils.isUndef(configProps.trueValue)) {
                // 经测试，若指定了trueValue，无论falseValue是否指定，只有值等于trueValue，checked才为true
                if (config.value === configProps.trueValue) {
                  checked = true;
                } else {
                  checked = false;
                }
              } else if (!utils.isUndef(configProps.falseValue)) {
                // 经测试：当trueValue没有指定，falseValue指定，只有值等于falseValue，checked才为false
                if (config.value === configProps.falseValue) {
                  checked = false;
                } else {
                  checked = true;
                }
              } else {
                // 经测试：当trueValue和falseValue没有指定，checked才为!!config.value
                checked = !!config.value;
              }
            } else {
              checked =
                configProps.hasOwnProperty("checked") &&
                configProps.checked !== false
                  ? true
                  : false;
            }
            Object.assign(newAttrs, configProps);
            newAttrs.checked = checked;

            Object.assign(newProps, configProps);
            if (newProps.hasOwnProperty("checked")) {
              delete newProps.checked;
            }

            domProps.checked = newAttrs.checked;
          }
        } else {
          var newValue;
          if (config.hasOwnProperty("value")) {
            newValue = utils.isRefVal(config.value)
              ? utils.deepCopy(config.value)
              : config.value; // 这样防止引用地址被组件内部修改
          } else {
            newValue = configProps.value;
          }
          if (!constant.FORM_INPUTS.includes(componentName)) {
            Object.assign(newAttrs, configProps);
            if (newAttrs.hasOwnProperty("value")) {
              delete newAttrs.value;
            }
            Object.assign(newProps, configProps);
            newProps.value = newValue;
          } else {
            Object.assign(newAttrs, configProps);
            if (newAttrs.hasOwnProperty("value")) {
              delete newAttrs.value;
            }

            Object.assign(newProps, configProps);
            if (newProps.hasOwnProperty("value")) {
              delete newProps.value;
            }

            // 经测试（value）：
            // textarea必须要在domProps才能显示；
            // input第一次可以在newAttrs写，之后也要在domProps才能显示值，所以也要是domProps才保险
            domProps.value = newValue;
          }
        }

        let emitOn, nativeOn, scopedSlots, tmpRef;
        if (!isSlotCom) {
          // 内容组件，非插槽组件: 因为常用，所以计算好
          emitOn = this.$data.emitOn;
          nativeOn = this.$data.nativeOn;
          scopedSlots = this.$data.scopedSlots;
        } else {
          // 很少用，且scopedSlots有可能包含函数，必须实时解析
          emitOn = this.createEmitOn(config, false, ref);
          nativeOn = this.createNativeOn(config, false, ref);
          scopedSlots = this.createScopedSlots(config, ref);
        }
        // COM_TARGET_REF时ref必须存在，因为要搜索
        if (ref === constant.COM_TARGET_REF || emitOn || nativeOn) {
          tmpRef = ref;
        }

        vnode = createElement(
          config.name, // tag name 标签名称 https://www.cnblogs.com/tugenhua0707/p/7528621.html
          {
            attrs: newAttrs, //attrs为原生属性

            // 类型要求见：https://cn.vuejs.org/v2/guide/class-and-style.html
            // config.class必须是String,Object, Array才能有效；当然传入其它类型也可以，只是没有效果，也不会报错，因为createElement会做处理
            class: config.class,
            style: config.style, // config.style必须是一个对象才能有效；原理同上

            domProps: domProps, // DOM属性

            props: newProps, // 组件props
            // 事件监听基于 "on"
            // 所以不再支持如 "v-on:keyup.enter" 修饰语
            // 需要手动匹配 KeyCode
            on: emitOn,

            // 仅对于组件，用于监听原生事件，而不是组件内部使用 `vm.$emit` 触发的事件。
            nativeOn: nativeOn,

            // 自定义指令。注意事项：不能对绑定的旧值设值
            // Vue 会为您持续追踪
            directives: directives,
            // Scoped slots in the form of
            scopedSlots: scopedSlots,
            ref: tmpRef
          },
          config.text
        );

        // 去除多余的原生属性；去不去掉感觉都没有什么，好像没有影响到功能，只是页面上会显示原生属性
        var componentOptions = vnode.componentOptions;
        var dataAttrs = {};
        var comProps =
          componentOptions && componentOptions.Ctor.options.props
            ? componentOptions.Ctor.options.props
            : false;
        if (Object.keys(newProps || {}).length) {
          var comPropsKeys = Object.keys(comProps || {}); // 经测试：就算在定义中声明为中划线形式，这里也会返回驼峰式，如 'text-str' => 'textStr'
          for (var key in newProps) {
            if (!comPropsKeys.includes(key)) {
              dataAttrs[key] = newProps[key];
            }
          }
          if (vnode.data) {
            vnode.data.attrs = dataAttrs;
          }
        }

        newAttrs = null;
        newProps = null;
        domProps = null;
        directives = null;

        configProps = null;
      } else if (utils.isFunc(config)) {
        var options = {
          global: dataCache.getGlobal(this.config.__formId), // 直接取组件__formId，插槽是没有__formId的
          rootData: dataCache.getRoot(this.config.__formId), // 兼容1.7.0以前，不包括1.7.0
          root: dataCache.getRoot(this.config.__formId),
          idxChain: this.info.idxChain,
          index: this.info.index,
          pathKey: this.info.pathKey,
          $hidden: dataCache.getHiddenFunc(this.config.__formId)
        };

        vnode = config(options);
        if (!utils.isVNode(vnode)) {
          vnode = this.renderUi(createElement, vnode, isSlotCom, ref);
        }
        options = null;
      } else if (
        utils.isStr(vnode) ||
        utils.isUndef(vnode) ||
        utils.isNum(vnode) ||
        utils.isBool(vnode) ||
        utils.isNull(vnode)
      ) {
        vnode = createElement("span", vnode); // 经验证，这样写没有问题：vnode不用加""
      } else {
        console.error("错误的config: ", config);
        throw "es-base config当是一个函数时，其返回值必须是一个虚拟节点或字符串";
      }

      // 这个不能删除：vue机制，主要是为了执行config.__refreshIndex；当表单改变时，同步更新页面
      if (
        !isSlotCom &&
        config &&
        config.__refreshIndex &&
        this.__slotUpdateTime
      ) {
        // 永远都不会进入这，因为__slotUpdateTime没有值的
        this.__slotUpdateTime++;
      }

      return vnode;
    },

    eventHandler(config, eventName, args, isMain, ref) {
      args = args ? args : [];
      // console.log("this.$refs", this.$refs);
      if (isMain) {
        // 主组件：让父类去处理
        this.$emit("trigger", eventName, args, this.$refs[ref]);
      } else {
        // 一般组件，自己处理
        var options = {
          value: utils.deepCopy(config.value),
          event: args[0],
          args: args,
          pathKey: this.info.pathKey,
          index: this.info.index,
          idxChain: this.info.idxChain,
          target: this.$refs[ref]
        };

        var handlers = [];
        var actions = config.actions;
        if (actions) {
          actions.forEach(action => {
            if (action.trigger && action.trigger.includes(eventName)) {
              handlers.push(action.handler);
            }
          });
        }

        if (handlers.length > 0) {
          var thisFrom = this.__getForm();
          thisFrom._handleEvents(handlers, options);
        }
      }
    },

    __getForm() {
      var formItem = this.$parent;
      while (formItem) {
        var type = formItem._getType ? formItem._getType() : "";
        if (type == constant.UI_FORM) {
          // formItem._syncFormUi(checkSchema, eventNames, targetValue, eventData); // 最外层的表单层同步所有的ui及数位
          return formItem; // 到达表单层
        } else if (type == constant.UI_ARRAY) {
          // checkSchema.push(formItem._getSchema());
        } else {
          // ... 往上派
        }
        formItem = formItem.$parent;
      }
    },

    __parseInputEvent(config, eventData) {
      var eventValue;
      if (eventData && eventData.target && eventData.target.nodeName) {
        var tagName = eventData.target.tagName;
        var nodeType = eventData.target.type;
        if (tagName.toLowerCase() === constant.TAG_INPUT) {
          var configProps;
          if (nodeType === constant.TYPE_RADIO) {
            // 防止props不存在
            configProps = config.props ? config.props : {};
            if (eventData.target.checked) {
              eventValue = configProps.value;
            } else {
              eventValue = undefined;
            }
          } else if (nodeType === constant.TYPE_CHECKBOX) {
            // 防止props不存在
            configProps = config.props ? config.props : {};
            if (eventData.target.checked) {
              eventValue = true;
              if (!utils.isUndef(configProps.trueValue)) {
                eventValue = configProps.trueValue;
              }
            } else {
              eventValue = false;
              if (!utils.isUndef(configProps.falseValue)) {
                eventValue = configProps.falseValue;
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
     * 创建emit派发所需要监听的事件
     */
    createEmitOn(config, isMain, ref) {
      var _thisVm = this;

      var hasOwnValue = config.hasOwnProperty("value");
      var emitEvents;
      if (config.__emitEvents) {
        emitEvents = utils.deepCopy(config.__emitEvents);
        if (hasOwnValue && !emitEvents.includes(constant.INPUT_EVENT)) {
          emitEvents.push(constant.INPUT_EVENT);
        }
      } else {
        if (hasOwnValue) {
          emitEvents = [constant.INPUT_EVENT];
        } else {
          emitEvents = [];
        }
      }

      // emit发出的事件
      var emitOn = {};
      emitEvents.forEach(eventName => {
        if (eventName == constant.INPUT_EVENT && hasOwnValue) {
          emitOn[eventName] = function(eventData) {
            var eventValue = _thisVm.__parseInputEvent(config, eventData);
            if (config.value !== eventValue) {
              config.value = eventValue;
              _thisVm.eventHandler(config, eventName, arguments, isMain, ref);
            }
          };
        } else {
          emitOn[eventName] = function() {
            _thisVm.eventHandler(config, eventName, arguments, isMain, ref);
          };
        }
      });

      if (Object.keys(emitOn).length > 0) {
        return emitOn;
      } else {
        _thisVm = undefined; // 没有关联清除
        return null;
      }
    },

    /**
     * 创建原生事件所需要监听的事件
     */
    createNativeOn(config, isMain, ref) {
      // emit发出的事件
      if (config.__nativeEvents && config.__nativeEvents.length > 0) {
        var _thisVm = this;
        var nativeOn = {};
        var nativeEvents = utils.deepCopy(config.__nativeEvents);
        nativeEvents.forEach(eventName => {
          nativeOn[eventName] = function() {
            _thisVm.eventHandler(
              config,
              eventName + "." + constant.ADJ_NATIVE,
              arguments,
              isMain,
              ref
            );
          };
        });

        if (Object.keys(nativeOn).length > 0) {
          return nativeOn;
        } else {
          _thisVm = undefined;
          return null;
        }
      } else {
        return null;
      }
    },

    createScopedSlots(config, pref) {
      var scopedSlots = config.scopedSlots;
      if (scopedSlots) {
        var newScopedSlots = {};
        for (var key in scopedSlots) {
          newScopedSlots[key] = this.newSlotFunc(key, scopedSlots[key], pref);
        }
        return newScopedSlots;
      } else {
        return undefined;
      }
    },

    newSlotFunc(key, slotValue, pref) {
      var vm = this;
      return function(scoped) {
        var vnodes;
        if (utils.isFunc(slotValue)) {
          var options = {
            global: dataCache.getGlobal(vm.config.__formId),
            rootData: dataCache.getRoot(vm.config.__formId), // 兼容1.7.0以前，不包括1.7.0
            root: dataCache.getRoot(vm.config.__formId),
            idxChain: vm.info.idxChain,
            index: vm.info.index,
            pathKey: vm.info.pathKey,
            $hidden: dataCache.getHiddenFunc(vm.config.__formId)
          };
          scoped = scoped ? scoped : {};
          vnodes = slotValue(options, scoped);
          if (!utils.isArr(vnodes)) {
            vnodes = [vnodes];
          }
          var tmpVNodes = [];
          vnodes.forEach(function(vnode) {
            if (!utils.isVNode(vnode) && utils.isObj(vnode)) {
              var newComponent = parseComponent(
                vnode,
                vm.info.pathKey + "> scopeSlots(function返回值) > " + key,
                true,
                false
              );
              if (newComponent) {
                tmpVNodes.push(newComponent);
              }
            } else {
              tmpVNodes.push(vnode);
            }
          });
          vnodes = tmpVNodes;
        } else {
          vnodes = [slotValue];
        }

        var newVNode,
          newVNodes = [];
        vnodes.forEach(function(vnode, index) {
          if (!utils.isVNode(vnode) && utils.isObj(vnode)) {
            if (!vnode.hidden) {
              newVNode = vm.renderUi(
                vm.$createElement,
                vnode,
                true,
                pref + "_" + index
              );
              newVNodes.push(newVNode);
            }
          } else {
            newVNodes.push(vnode);
          }
        });

        if (newVNodes.length <= 0) {
          newVNodes = undefined;
        }

        return newVNodes;
      };
    }
  },

  destroyed() {
    this.$data.emitOn = null;
    this.$data.nativeOn = null;
    this.$data.scopedSlots = null;
  },

  watch: {
    config: {
      handler: function(/* newVal, oldVal */) {
        this.initUi();
      },
      deep: false
    }
  }
};
