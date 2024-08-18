import utils from "../libs/utils";
import constant from "../libs/constant";
import { enterSubmit, onlySubmit } from "../libs/submit";
import { canAssign, newEsFuncion, getStaticKey } from "./parse";

("use strict");

let autoIncreaseNum = 0;
function newComponentId() {
  ++autoIncreaseNum;
  return autoIncreaseNum;
}

/**
 * 解析组件
 * @param {*} component 组件配置
 * @param {*} canEmpty  是否可返回空值
 * @param {*} clearVModel 是否需要双向绑定数据（表单不需要，因为有绑定功能；但其它组件需要）
 * @returns newComponent 返回合法的组件配置
 */
export function parseComponent(
  component,
  canEmpty = false,
  clearVModel = false
) {
  var newComponent = {
    id: "c" + newComponentId()
  };
  if (utils.isVNode(component)) {
    newComponent.jsx = component;
  } else if (utils.isObj(component) && Object.keys(component).length > 0) {
    if (!component.name) {
      if (canEmpty !== true) {
        console.error("name必须存在", component);
        throw "name必须存在";
      } else {
        return null;
      }
    }

    newComponent.name = component.name;
    if (component.class) {
      newComponent.class = newEsFuncion(component.class);
    }
    if (component.style) {
      newComponent.style = newEsFuncion(component.style);
    }

    // 指令directives
    var directives = component.d || component.directives;
    if (directives && utils.isObj(directives)) {
      var newDirectives = {};
      for (var directiveName in directives) {
        newDirectives[directiveName] = newEsFuncion(directives[directiveName]);
      }
      newComponent.directives = newDirectives;
    }

    // 插槽
    if (component.scopedSlots) {
      newComponent.scopedSlots = parseSlots(component.scopedSlots);
    }
    if (component.normalSlots) {
      newComponent.normalSlots = parseSlots(component.normalSlots);
    }

    newComponent.text = newEsFuncion(component.text);
    newComponent.hidden = newEsFuncion(component.hidden);

    var actions = parseActions(component.actions); // 原来的写法
    var emitOn = parseOn(component.on); // emit发出来的
    var nativeOn = parseOn(component.nativeOn); // 原生的
    // 合并
    if (actions) {
      var triggerNames, nativeName, curHandlers;
      actions.forEach(actionItem => {
        triggerNames = actionItem.trigger;
        triggerNames.forEach(triggerName => {
          nativeName = getNativeName(triggerName);
          if (!nativeName) {
            // 非native
            curHandlers = emitOn[triggerName];
            if (!curHandlers) {
              curHandlers = [];
              nativeOn[triggerName] = curHandlers;
            }
          } else {
            // .native监听
            curHandlers = nativeOn[nativeName];
            if (!curHandlers) {
              curHandlers = [];
              nativeOn[triggerName] = curHandlers;
            }
          }
          curHandlers.push(actionItem.handler);
        });
      });
    }

    newComponent.on = emitOn;
    newComponent.nativeOn = nativeOn;
    // newComponent.actions = actions

    var staticAttrs = {};
    if (utils.isObj(component.props)) {
      var tmpProps = component.props;
      var newProps = {};
      for (var key in tmpProps) {
        var staticKey = getStaticKey(key);
        if (!staticKey) {
          // 兼容旧式写法
          newProps[key] = newEsFuncion(tmpProps[key]);
        } else {
          staticAttrs[staticKey] = tmpProps[key]; // 保持原样，不用解析（旧式写法）
        }
      }
      newComponent.props = newProps;
    } else {
      newComponent.props = {};
    }

    // 新式写法
    if (component.attrs && utils.isObj(component.attrs)) {
      staticAttrs = Object.assign(staticAttrs, component.attrs); // 不深度拷贝了，主要用来解决是函数的问题
    }
    if (Object.keys(staticAttrs).length > 0) {
      newComponent.attrs = staticAttrs;
    }

    if (!clearVModel) {
      var vModelValue = component["vModel"] || component["v-model"];
      if (!utils.isUndef(vModelValue) && !utils.isNull(vModelValue)) {
        var valueKey = "value";
        // console.log("vModelValue", vModelValue);
        if (vModelValue && canAssign(vModelValue)) {
          newComponent.__rawVModel = newEsFuncion(vModelValue + "={{$event}}");
          newComponent.props[valueKey] = newEsFuncion(vModelValue);
        } else if (
          utils.isObj(vModelValue) &&
          utils.isObj(vModelValue.context) &&
          vModelValue.bind
        ) {
          var keyTargets = vModelValue.bind;

          if (utils.isStr(keyTargets)) {
            keyTargets = keyTargets
              .replace(/\[/g, ".")
              .replace(/\]/g, "")
              .split(".");
            // console.log("keyTargets", keyTargets);
            // 去掉空格
            keyTargets = keyTargets.filter(function(keyTarget) {
              return !!keyTarget.trim();
            });
          } else if (utils.isArr(keyTargets)) {
            // keyTargets = keyTargets;
            // 去掉空格和非key
            keyTargets = keyTargets.filter(function(keyTarget) {
              return (
                utils.isNum(keyTarget) ||
                (utils.isStr(keyTarget) && keyTarget.trim())
              );
            });
          } else {
            if (canEmpty !== true) {
              throw new Error(
                "vModel.context是一个对象时，target必须是一个字符串组成的数组或字符串"
              );
            } else {
              return null;
            }
          }

          if (keyTargets.length <= 0) {
            if (canEmpty !== true) {
              throw new Error("vModel.target必须有值");
            } else {
              return null;
            }
          }
          newComponent.__rawVModel = function(data) {
            var context = vModelValue.context;
            var lastIndex = keyTargets.length - 1;
            keyTargets.forEach(function(keyTarget, index) {
              if (index < lastIndex) {
                context = context[keyTarget];
              }
            });
            return (context[keyTargets[lastIndex]] = data.event); // 来自于解析
          };
          newComponent.props[valueKey] = function() {
            var context = vModelValue.context;
            var value;
            keyTargets.forEach(function(keyTarget) {
              value = context[keyTarget];
              context = value;
            });
            return value;
          };
        } else {
          console.warn(
            "component.vModel必须是可以赋值的，形式如:es: {{$item}}.name, 且属性名(如_naMe-0)只支持[a-zA-Z0-9_-]或一个对象{context: this, target: 'myName'}; 若不是这样的形式，则无法同步"
          );
          newComponent.props[valueKey] = newEsFuncion(vModelValue);
        }
      }
    }
  } else if (utils.isFunc(component)) {
    newComponent.func = component;
  } else if (utils.isStr(component)) {
    var tmpName = component.trim();
    if (!tmpName) {
      if (canEmpty !== true) {
        console.error("配置必须是一个数组或对象且不能为空：", component);
        throw "配置必须是一个数组或对象且不能为空";
      } else {
        return null;
      }
    }
    newComponent = Object.assign(newComponent, {
      hidden: false,
      name: tmpName,
      props: {},
      text: undefined,
      actions: []
    });
  } else {
    if (canEmpty !== true) {
      console.error("配置必须是一个数组或对象且不能为空", component);
      throw "配置必须是一个数组或对象且不能为空";
    } else {
      return null;
    }
  }

  return newComponent;
}

/**
 * 解析slots
 */
export function parseSlots(slots) {
  var newSlots = {};
  if (slots !== undefined && slots !== null) {
    if (!utils.isObj(slots) || utils.isVNode(slots)) {
      newSlots.default = slots;
    } else {
      newSlots = Object.assign({}, slots);
    }
  }
  return newSlots;
}

/**
 * 解析/标准化项组件的事件
 * @param {*} actions
 */
export function parseActions(actions) {
  // 解析是否为特殊写法
  var newActions = [];
  if (
    (utils.isObj(actions) && Object.keys(actions).length > 0) ||
    (utils.isArr(actions) && actions.length > 0) ||
    utils.isFunc(actions) ||
    utils.isStr(actions)
  ) {
    var tmpActions;
    if (utils.isFunc(actions)) {
      tmpActions = [{ trigger: constant.CLICK_EVENT, handler: actions }];
    } else if (utils.isObj(actions)) {
      tmpActions = [actions];
    } else if (utils.isStr(actions)) {
      tmpActions = [actions];
    } else {
      // 就是数组了
      tmpActions = actions;
    }
    tmpActions.forEach(tmpAction => {
      var newTrigger, newAction;
      if (utils.isStr(tmpAction)) {
        tmpAction = tmpAction.trim();
        if (tmpAction == constant.ENTER_SUBMIT) {
          // keyup.native提交事件
          newActions.push({
            trigger: [constant.KEYUP_NATIVE],
            handler: enterSubmit
          });
        } else {
          var actionInfos = tmpAction.split(/\s*=\s*/);
          if (
            actionInfos &&
            actionInfos.length == 2 &&
            actionInfos[1] == constant.ONLY_SUBMIT
          ) {
            newAction = {};
            newTrigger = parseTrigger(actionInfos[0]);
            // @ts-ignore
            newAction.trigger =
              newTrigger && newTrigger.length > 0
                ? newTrigger
                : [constant.CLICK_EVENT];
            // @ts-ignore
            newAction.handler = onlySubmit;
            newActions.push(newAction);
          } else {
            console.warn("存在不合法的事件，将过滤去掉，不会执行", actions);
          }
        }
      } else if (utils.isFunc(tmpAction.handler)) {
        newAction = {};
        newTrigger = parseTrigger(tmpAction.trigger);
        // @ts-ignore
        newAction.trigger =
          newTrigger && newTrigger.length > 0
            ? newTrigger
            : [constant.CLICK_EVENT];
        // @ts-ignore
        newAction.handler = tmpAction.handler;
        newActions.push(newAction);
      } else {
        // 非法写，不是函数，去掉它
        console.warn("存在不合法的事件，将过滤去掉，不会执行", actions);
      }
    });
  } else {
    // console.warn("key(" + myPathKey + ")component事件类型不合法.");
  }

  return newActions.length > 0 ? newActions : null;
}

/**
 * 新型写法：on nativeOn
 * @param {*} eventObj  // on and nativeOn
 */
export function parseOn(eventObj) {
  var newEventObj = {};
  // 解析是否为特殊写法
  if (utils.isObj(eventObj)) {
    for (var eventName in eventObj) {
      var newTriggerNames = parseTrigger(eventName);
      if (newTriggerNames && newTriggerNames.length > 0) {
        var handler = eventObj[eventName];
        if (handler === constant.ONLY_SUBMIT) {
          handler = onlySubmit;
        } else if (!utils.isFunc(handler)) {
          handler = null;
        }
        if (handler) {
          newTriggerNames.forEach(function(newTriggerName) {
            var curHandlers = newEventObj[newTriggerName];
            if (!curHandlers) {
              curHandlers = [];
              newEventObj[newTriggerName] = curHandlers;
            }
            curHandlers.push(handler);
          });
        }
      }
    }
  }

  return newEventObj;
}

/**
 * 解析触发事件
 * @param {*} trigger
 * 1. 事件字件串或者以空格隔开的事件所组成的字符串，如"click" or "click change"
 * 2. 事件组成的数组
 * @returns 返回数组，没有时返回一个null
 */
export function parseTrigger(trigger) {
  var tmpTriggers;
  if (utils.isArr(trigger) || utils.isStr(trigger)) {
    if (utils.isStr(trigger)) {
      trigger = trigger.trim();
      tmpTriggers = trigger.split(/\s+/);
    } else {
      tmpTriggers = [];
      trigger.forEach(item => {
        if (utils.isStr(item)) {
          item = item.trim();
          tmpTriggers = tmpTriggers.concat(item.split(/\s+/));
        }
      });
    }
  } else {
    tmpTriggers = null;
  }
  return tmpTriggers && tmpTriggers.length > 0 ? tmpTriggers : null;
}

/**
 * 提取是否为.native事件
 * @param {*} eventName
 */
function getNativeName(eventName) {
  var dotNative = "." + constant.ADJ_NATIVE;
  var lastIndex = eventName.lastIndexOf(dotNative);
  if (lastIndex != -1 && eventName.substr(lastIndex) === dotNative) {
    // .native监听
    var nativeName = eventName.substr(0, lastIndex);
    if (nativeName) {
      return nativeName;
    } else {
      return false; //因为eventName是经过处理的,不会出现点在前面，所以不会进入这里
    }
  } else {
    return false;
  }
}
