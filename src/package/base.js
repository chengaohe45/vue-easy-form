/**
 * base.js
 *
 * Copyright (c) 2024 chengaohe All rights reserved.
 *
 * 无缝对接vue组件
 *
 */

// import _uniq from "lodash-es/uniq";
import constant from "./libs/constant.js";
import utils from "./libs/utils.js";
import {
  parseComponent,
  isComponentTextType,
  convertComponentText
} from "./tools/component";
// import { smartEsValue } from "./tools/parse";

const KEY_EVENT_CACHE_MAP = "_KEY_EVENT_CACHE_MAP";

// 此四个常量已经对外，不可随便改
// const KEY_GLOBAL = "global"; // 直接从表单组件（root）中取出
// const KEY_ROOT_DATA = "rootData"; // 直接从表单组件（root）中取出
// const KEY_ROOT = "root"; // 直接从表单组件（root）中取出
// const KEY_HIDDEN = "hidden"; // 直接从表单组件（root）中取出
// const KEY_INDEX = "index";
// const KEY_IDX_CHAIN = "indexChain";
// const KEY_PATH_KEY = "pathKey";
// const KEY_PARENT_VALUE = "parent"; // 最近一个对象数据（也就是最后一个数组对应的数据）
// const KEY_CURRENT_VALUE = "current"; // 当前表单主组件的数据

// function defineProperty(obj, key, vm) {
//   Object.defineProperty(obj, key, {
//     enumerable: true,
//     configurable: true,
//     get: function() {
//       if (key === KEY_INDEX) {
//         return vm[key];
//       } else {
//         var rootInstance = utils.getParent(vm, constant.ES_FORM_ROOT_NAME);
//         // window.testRoot = rootInstance || {};
//         // console.log("rootInstance", rootInstance);
//         var value;
//         switch (key) {
//           case KEY_ROOT_DATA:
//           case KEY_ROOT:
//             value = rootInstance[constant.USER_ROOT_DATA];
//             break;

//           case KEY_GLOBAL:
//             value = rootInstance[key];
//             break;

//           case KEY_HIDDEN:
//             value = rootInstance[constant.USER_HIDDEN];
//             break;
//           case KEY_PARENT_VALUE:
//             value = rootInstance[constant.KEY_PARENT_VALUE];
//             break;
//           case KEY_IDX_CHAIN:
//             var chainInfo = vm.info || {};
//             value = chainInfo[KEY_IDX_CHAIN] || "";
//             break;
//           case KEY_PATH_KEY:
//             var pathInfo = vm.info || {};
//             value = pathInfo[KEY_PATH_KEY] || "";
//             break;
//           case KEY_CURRENT_VALUE:
//             var config = vm.config || {};
//             value = utils.deepCopy(config.value);
//             break;
//           default:
//             value = vm[key];
//             break;
//         }
//         return value;
//       }
//     }
//   });
// }

("use strict");

export default {
  // functional: true,

  render: function(createElement) {
    var vnodes = this.createVnodes(createElement, this.config, false, true);
    return vnodes[0];
  },
  props: {
    config: {
      type: [Object, Function],
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

    index: {
      type: Number,
      required: false,
      default: -1
    },

    // 当!!this.info为非真时，处理事件会让父级处理
    info: {
      type: Object,
      required: true,
      default: undefined
    },

    /* 是否是主组件：来自表单的组件, 因为有双向绑定 */
    isMain: {
      type: Boolean,
      required: false,
      default: false
    },

    emitEvents: {
      type: Array,
      required: false,
      default: () => {
        return [];
      }
    }
  },

  data() {
    return {
      // hasEsScript: false,
      // uiIndex: 0,
      // dataComponent: {},
      // dataText: null,
      // emitOn: null,
      // nativeOn: null
      // comVal: undefined
      // __watchInfo: null  // 记录正在watch的目标
    };
  },

  created() {
    // console.log("created...");
    // this.initUi();
    // 一般不会启用
    // if (!this.config.id) {
    //   this.$watch(
    //     "config", // item比较特殊
    //     () => {
    //       this.initUi();
    //     },
    //     {
    //       deep: false
    //     }
    //   );
    // }
  },

  methods: {
    initUi() {
      // this.createDep();
      // this.emitOn = this.createEventOn(this.config, true, false);
      // this.nativeOn = this.createEventOn(this.config, true, true);
    },

    eventHandler(config, isNative, eventName, args) {
      var eventData = args ? args[0] : undefined;
      if (this.config === config && this.emitEvents.includes(eventName)) {
        // 主组件，非slot
        // console.log("this.config === config", this.config === config);
        this.$emit(eventName, eventData);
      }

      if (this.isMain && this.config === config) {
        // console.log("------------", eventName, args);
        // 主组件：让父类去处理
        var emitInfo = {
          eventName,
          args,
          target: this.getConfigRef(),
          isNative
        };
        this.$emit("trigger", emitInfo);
        return true;
      }
      // console.log("config", config);
      var handlers = this.getHandlers(config, isNative, eventName);
      if (handlers && handlers.length > 0) {
        // var options = {
        //   value: utils.deepCopy(targetValue),
        //   event: eventData,
        //   args: args,
        //   pathKey: this.schema.__info.pathKey,
        //   index: this.schema.__info.index,
        //   idxChain: this.schema.__info.idxChain,
        //   target: target
        // };
        // 一般组件，自己处理
        // var options = {
        //   value: utils.deepCopy(config.value),
        //   event: args[0],
        //   args: args,
        //   pathKey: this.info.pathKey,
        //   index: this.info.index,
        //   idxChain: this.info.idxChain,
        //   target: this.$refs[ref]
        // };
        var data = {
          event: eventData,
          args,
          // source: this.item,
          target: this.getConfigRef(),
          isNative
          // index: this.info ? this.info.index : -1
        };

        var rootInstance = utils.getParent(this, constant.ES_FORM_ROOT_NAME);
        rootInstance._handleEvents(handlers, data);
        rootInstance = null;
      }
    },

    getConfigRef() {
      return this.$children && this.$children.length > 0
        ? this.$children[0]
        : this;
    },

    fetchMainEvent(typeKey) {
      if (!this[KEY_EVENT_CACHE_MAP]) {
        this[KEY_EVENT_CACHE_MAP] = {};
      }
      var eventCacheMap = this[KEY_EVENT_CACHE_MAP];
      if (!eventCacheMap[this.config.id]) {
        eventCacheMap = {};
        eventCacheMap[this.config.id] = {
          emitOn: this.createEventOn(this.config, true, false),
          nativeOn: this.createEventOn(this.config, true, true)
        };
        this[KEY_EVENT_CACHE_MAP] = eventCacheMap;
      }
      // console.log(
      //   "eventCacheMap[typeKey]",
      //   eventCacheMap[[this.config.id]]["emitOn"]
      // );
      return eventCacheMap[this.config.id][typeKey];
    },

    /**
     * 创建所需要监听的事件(emit)
     * @param {*} config
     * @param {*} isRootRender 代表来自非插槽（首个config为对象）
     * @returns
     */
    createEventOn(config, isRootRender, isNative) {
      // jsx和纯函数写法不用监听事件
      if (config.jsx || config.func) {
        return null;
      }
      var hasInputValue =
        (this.isMain && config === this.config) || !!config.__rawVModel; // 所有组件的value都设置为可同步

      // 统计出要监听的事件
      var eventNames = isNative
        ? config.__extraNativeEvents
        : config.__extraEmitEvents;
      eventNames = eventNames ? eventNames.slice() : [];
      var eventOn = isNative ? config.nativeOn : config.on;
      if (eventOn) {
        // eventNames = Object.keys(eventOn);
        for (var eventName in eventOn) {
          if (!eventNames.includes(eventName)) {
            eventNames.push(eventName);
          }
        }
      }
      if (!isNative) {
        if (hasInputValue && !eventNames.includes(constant.INPUT_EVENT)) {
          eventNames.push(constant.INPUT_EVENT);
        }
        // 主界面的组件才需要
        if (isRootRender && this.emitEvents.length) {
          this.emitEvents.forEach(function(emitEvent) {
            if (!eventNames.includes(emitEvent)) {
              eventNames.push(emitEvent);
            }
          });
        }
      }
      // console.log("eventNames", eventNames);

      var extOn = {};
      var _this = this;
      eventNames.forEach(eventName => {
        if (!isNative && eventName == constant.INPUT_EVENT && hasInputValue) {
          extOn[eventName] = function() {
            _this.syncValue(config, arguments[0]);
            _this.eventHandler(config, isNative, eventName, arguments);
          };
        } else {
          extOn[eventName] = function() {
            _this.eventHandler(config, isNative, eventName, arguments);
          };
        }
      });

      return Object.keys(extOn).length > 0 ? extOn : null;
    },

    getHandlers(config, isNative, eventName) {
      var eventOn = isNative ? config.nativeOn : config.on;
      var handlers = eventOn[eventName] || [];
      return handlers;
    },

    syncValue(config, eventValue) {
      if (this.isMain && this.config === config) {
        if (config.value !== eventValue) {
          config.value = eventValue;
        }
      } else if (config.__rawVModel) {
        // vmodel这个够了
        var parseSources = {
          global: this.global,
          root: {},
          event: eventValue,
          index: this.info ? this.info.index : -1
        };
        // var options = {
        //   global: dataCache.getGlobal(vm.config.__formId),
        //   rootData: dataCache.getRoot(vm.config.__formId), // 兼容1.7.0以前，不包括1.7.0
        //   root: dataCache.getRoot(vm.config.__formId),
        //   idxChain: vm.info.idxChain,
        //   index: vm.info.index,
        //   pathKey: vm.info.pathKey,
        //   $hidden: dataCache.getHiddenFunc(vm.config.__formId)
        // };
        // smartEsValue(config.__rawVModel, parseSources);
        if (typeof config.__rawVModel === "function") {
          config.__rawVModel(parseSources);
        }
      } else {
        // this.$data.comVal = eventValue;
      }
    },

    // createDep() {
    //   if (!this.config.jsx) {
    //     if (!this.__tmpParseSources) {
    //       var parseSources = {
    //         config: {},
    //         event: undefined
    //       };
    //       defineProperty(parseSources, KEY_GLOBAL, this);
    //       defineProperty(parseSources, KEY_INDEX, this);
    //       defineProperty(parseSources, KEY_IDX_CHAIN, this);
    //       defineProperty(parseSources, KEY_PATH_KEY, this);
    //       defineProperty(parseSources, KEY_HIDDEN, this);
    //       defineProperty(parseSources, KEY_ROOT_DATA, this);
    //       defineProperty(parseSources, KEY_ROOT, this);
    //       defineProperty(parseSources, KEY_PARENT_VALUE, this);

    //       // 在render中使用
    //       this.__tmpParseSources = parseSources;
    //     }
    //   } else if (this.__tmpParseSources) {
    //     this.__tmpParseSources = undefined;
    //   }
    //   // this.uiIndex++;
    // },

    /**
     *
     * @param {*} createElement
     * @param {*} config
     * @param {*} fromSlotInfo 这个来自于插槽 {fromScoped: false, scoped}
     * @param {*} isRootRender 来自主渲染
     * @returns
     */
    createVnodes(createElement, config, fromSlotInfo, isRootRender) {
      var vnode;
      var dataComponents = this.fillDataForConfig(
        createElement,
        config,
        fromSlotInfo,
        isRootRender
      );
      if (
        fromSlotInfo &&
        (dataComponents === undefined ||
          dataComponents === null ||
          utils.isStr(dataComponents))
      ) {
        return dataComponents ? [dataComponents] : []; // 插槽可以直接使用字符串
      }
      dataComponents = utils.isArr(dataComponents)
        ? dataComponents
        : [dataComponents];
      var vnodes = [];
      dataComponents.forEach(dataComponent => {
        if (utils.isVNode(dataComponent.jsx)) {
          vnode = dataComponent.jsx;
        } else {
          // 一般的写法
          if (!dataComponent.name) {
            console.error("错误的config: ", dataComponent);
            throw "es-base config.name必须存在";
          }
          vnode = createElement(
            dataComponent.name, // tag name 标签名称 https://www.cnblogs.com/tugenhua0707/p/7528621.html
            {
              attrs: dataComponent.props, //attrs为原生属性
              // style: this.config.style,
              class: dataComponent.class,
              style: dataComponent.style,
              // DOM属性
              domProps: dataComponent.domProps,
              // 组件props
              props: dataComponent.props,
              // 事件监听基于 "on"
              // 所以不再支持如 "v-on:keyup.enter" 修饰语
              // 需要手动匹配 KeyCode
              on: dataComponent.on,

              // 仅对于组件，用于监听原生事件，而不是组件内部使用 `vm.$emit` 触发的事件。
              nativeOn: dataComponent.nativeOn,
              // 自定义指令。注意事项：不能对绑定的旧值设值
              // Vue 会为您持续追踪
              directives: dataComponent.directives,
              // directives: [
              //   {
              //   	name: "my-custom-directive",
              //   	value: "2",
              //   	expression: "1 + 1",
              //   	arg: "foo",
              //   	modifiers: {
              //   		bar: true
              //   	}
              //   }
              // ],
              // Scoped slots in the form of
              // { name: props => VNode | Array<VNode> }
              scopedSlots: dataComponent.scopedSlots
              // 如果组件是其他组件的子组件，需为插槽指定名称
              // slot: "name-of-slot",
              // 其他特殊顶层属性
              // key: "myKey",
              // ref: "myRef"
              // ref: "__comTarget__"
            },
            // [createElement('span', "test")]
            // ["test2"]
            // "测试{{config.value}}" // 子组件中的阵列
            dataComponent.normalSlots || []
          );

          // 去除多余的原生属性；去不去掉感觉都没有什么，好像没有影响到功能，只是页面上会显示原生属性
          var componentOptions = vnode.componentOptions;
          var dataAttrs = {};
          var comProps =
            componentOptions && componentOptions.Ctor.options.props
              ? componentOptions.Ctor.options.props
              : false;
          var thisProps = dataComponent.props;
          if (Object.keys(thisProps || {}).length) {
            var comPropsKeys = Object.keys(comProps || {}); // 经测试：就算在定义中声明为中划线形式，这里也会返回驼峰式，如 'text-str' => 'textStr'
            for (var key in thisProps) {
              if (!comPropsKeys.includes(key)) {
                dataAttrs[key] = thisProps[key];
              }
            }
            if (vnode.data) {
              vnode.data.attrs = dataAttrs;
            }
          }
        }
        vnodes.push(vnode);
      });

      return vnodes;
    },

    /**
     *
     * @param {*} createElement
     * @param {*} config
     * @param {*} fromSlotInfo
     * @param {*} isRootRender
     * @returns slots可能会返回一个数组，其它的不会
     */
    fillDataForConfig(createElement, config, fromSlotInfo, isRootRender) {
      var newComponent = {};

      if (config.jsx) {
        return config;
      }
      // var parseSources = this.__tmpParseSources;
      if (!config.func) {
        if (fromSlotInfo) {
          // 插槽需要判断hidden
          var hidden = config.hidden;
          if (utils.isFunc(hidden)) {
            hidden = fromSlotInfo.fromScoped
              ? config.hidden(this.fetchRootParseSource(), fromSlotInfo.scoped)
              : config.hidden(this.fetchRootParseSource());
          }
          if (hidden) {
            return null;
          }
        }
        // 解析props
        // 合并attrs, props: attrs优先级更高
        var domProps = {};
        var valueKey = "value";
        var dataProps = config.attrs ? Object.assign({}, config.attrs) : {};
        if (this.isMain && !fromSlotInfo) {
          // 来自于表单的主组件且非slot(也就是最外层), 取value值
          if ("value" in config) {
            // dataProps[valueKey] = utils.isRefVal(config.value)
            //   ? utils.deepCopy(config.value)
            //   : config.value; // 这样防止引用地址被组件内部修改
            dataProps[valueKey] = config.value;
          }
        }
        var propValue;
        for (var key in config.props) {
          // 若存在key, 说明来自于attrs
          if (!(key in dataProps)) {
            var scriptTxt = config.props[key];
            propValue = this.execEsValue(scriptTxt, fromSlotInfo);
            dataProps[key] = propValue;
          }
        }

        if (constant.FORM_INPUTS.includes(config.name)) {
          // 经测试（value）：
          // textarea必须要在domProps才能显示；
          // input第一次可以在newAttrs写，之后也要在domProps才能显示值，所以也要是domProps才保险
          if (valueKey in dataProps) {
            domProps[valueKey] = dataProps[valueKey];
            delete dataProps[valueKey];
          }
        }

        // console.log("dataProps: ", dataProps);
        newComponent.name = config.name || "span";
        newComponent.props = dataProps;
        newComponent.domProps = domProps;

        // 解析style
        if (config.style) {
          var style = this.execEsValue(config.style, fromSlotInfo);
          if (utils.isObj(style)) {
            newComponent.style = style;
          }
        }

        // 解析class
        if (config.class) {
          var newClass = this.execEsValue(config.class, fromSlotInfo);
          if (
            utils.isStr(newClass) ||
            utils.isObj(newClass) ||
            utils.isArr(newClass)
          ) {
            newComponent.class = newClass;
          }
        }

        // 指令
        if (config.directives && utils.isObj(config.directives)) {
          var newDirectives = [
            // {
            //   name: "my-custom-directive",
            //   value: "2",
            //   expression: "1 + 1",
            //   arg: "foo",
            //   modifiers: {
            //     bar: true
            //   }
            // }
          ];
          var directives = config.directives;
          for (var directiveName in directives) {
            var directiveValue = this.execEsValue(
              directives[directiveName],
              fromSlotInfo
            );
            newDirectives.push({
              name: directiveName,
              value: directiveValue
            });
          }
          newComponent.directives = newDirectives;
        }

        // 非作用域插槽
        var slotInfo = this.createNormalSlots(
          createElement,
          config.normalSlots
        );
        // console.log("slotInfo", slotInfo);
        var normalSlots = slotInfo.normalSlots || [];

        // 作用域插槽
        var scopedSlots = this.createScopedSlots(
          createElement,
          config.scopedSlots
        );
        scopedSlots = Object.assign({}, slotInfo.scopedSlots, scopedSlots);
        newComponent.scopedSlots = scopedSlots;
        newComponent.normalSlots = normalSlots;
        newComponent.on = isRootRender
          ? this.fetchMainEvent("emitOn")
          : this.createEventOn(config, false, false);
        newComponent.nativeOn = isRootRender
          ? this.fetchMainEvent("nativeOn")
          : this.createEventOn(config, false, true);

        // 解析text
        var dataText = this.execEsValue(config.text, fromSlotInfo);
        if (config.name || !fromSlotInfo) {
          if (dataText !== undefined && dataText !== null) {
            // newComponent.text = dataText + "";
            normalSlots.push(dataText + "");
          }
        } else {
          // slot可以返回字符串
          if (result !== undefined && result !== null) {
            return result + "";
          } else {
            return "";
          }
        }
        // if (newComponent.on && newComponent.on["test-true"]) {
        //   console.log("----------------newComponent.on", newComponent.on);
        // } else {
        //   console.log("newComponent.on", newComponent.on);
        // }
      } else {
        // 是函数
        var func = config.func;
        var result = this.execEsValue(func, fromSlotInfo);
        if (!fromSlotInfo) {
          if (utils.isVNode(result) || (utils.isObj(result) && result.name)) {
            // 返回一个组件，再次解析
            var newResult = parseComponent(result, false, false, "Base");
            return this.fillDataForConfig(createElement, newResult, false);
          } else {
            newComponent.name = "span";
            newComponent.props = {};
            if (result !== undefined && result !== null) {
              result = result + "";
              newComponent.normalSlots = result ? [result] : [];
            }
          }
        } else {
          if (!isComponentTextType(result)) {
            var newSlotResult = [];
            result = utils.isArr(result) ? result : [result];
            // console.log('result', result)
            result.forEach(resultItem => {
              if (isComponentTextType(resultItem)) {
                var resultText = convertComponentText(resultItem);
                if (resultText) {
                  newSlotResult.push(resultText);
                }
              } else {
                var slotComponent = parseComponent(
                  resultItem,
                  true,
                  false,
                  "Base-fromSlotInfo"
                );
                if (slotComponent) {
                  slotComponent = this.fillDataForConfig(
                    createElement,
                    slotComponent,
                    false
                  );
                  newSlotResult.push(slotComponent);
                }
              }
            });
            return newSlotResult;
          } else {
            return convertComponentText(result);
          }
        }
      }

      // parseSources = null; // 删掉临时数据

      return newComponent;
    },

    // 返回对象，内包含{normalSlots: [], scopedSlots: {}}
    createNormalSlots(createElement, normalSlots) {
      var newNormalSlots = [];
      var newScopedSlots = {};
      if (normalSlots) {
        // console.log("normalSlots", normalSlots);
        for (var key in normalSlots) {
          var vnodes = this.newNoramlSlot(createElement, normalSlots[key]);
          // console.log("vnodes", vnodes);
          if (vnodes.length > 0) {
            // 生成slot
            var slotVnode = createElement(
              "template",
              { slot: key === "default" ? undefined : key },
              vnodes
            );
            newNormalSlots.push(slotVnode);
            // 为什么做这一步：因为用template写时，非插槽也会编译成$scopedSlots,导致组件实现时也可能用到了$scopedSlots
            newScopedSlots[key] = function() {
              return vnodes;
            };
          }
        }
      }
      return { normalSlots: newNormalSlots, scopedSlots: newScopedSlots };
    },

    newNoramlSlot(createElement, slotValue) {
      if (!utils.isArr(slotValue)) {
        slotValue = [slotValue];
      }
      var newAllVNodes = [];
      slotValue.forEach(node => {
        if (utils.isStr(node)) {
          newAllVNodes.push(node);
        } else {
          var newVNodes = this.createVnodes(
            createElement,
            node,
            { fromScoped: false },
            false
          );
          if (newVNodes && newVNodes.length > 0) {
            newAllVNodes = newAllVNodes.concat(newVNodes);
          }
        }
      });

      return newAllVNodes;
    },

    // 返回的是一个对象
    createScopedSlots(createElement, scopedSlots) {
      if (scopedSlots) {
        var newScopedSlots = {};
        for (var key in scopedSlots) {
          newScopedSlots[key] = this.newScopedSlotFunc(
            createElement,
            scopedSlots[key]
          );
        }
        return newScopedSlots;
      } else {
        return {};
      }
    },

    newScopedSlotFunc(createElement, slotValue) {
      return scoped => {
        if (!utils.isArr(slotValue)) {
          slotValue = [slotValue];
        }
        // console.log('slotValue', slotValue)
        var newAllVNodes = [];
        slotValue.forEach(node => {
          if (utils.isStr(node)) {
            newAllVNodes.push(node);
          } else {
            var newVNodes = this.createVnodes(
              createElement,
              node,
              { fromScoped: true, scoped: scoped },
              false
            );
            if (newVNodes && newVNodes.length > 0) {
              newAllVNodes = newAllVNodes.concat(newVNodes);
            }
          }
        });
        return newAllVNodes;
      };
    },
    execEsValue(scriptTxt, fromSlotInfo) {
      // console.log("this", this);
      if (typeof scriptTxt === "function") {
        var rootInstance = utils.getParent(this, constant.ES_FORM_ROOT_NAME);
        return fromSlotInfo && fromSlotInfo.fromScoped
          ? scriptTxt(
              rootInstance._fetchParseSources(this.info),
              fromSlotInfo.scoped
            )
          : scriptTxt(rootInstance._fetchParseSources(this.info));
      } else {
        return scriptTxt;
      }
    },
    fetchRootParseSource() {
      var rootInstance = utils.getParent(this, constant.ES_FORM_ROOT_NAME);
      return rootInstance._fetchParseSources(this.info);
    }
  },

  destroyed() {},

  watch: {
    // config: {
    //   handler: function(/* newVal, oldVal */) {
    //     // console.log("base.config here...");
    //     this.initUi();
    //   },
    //   deep: false
    // }
  }
};
