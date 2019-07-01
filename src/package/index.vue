<template>
  <div class="es-form">
    <form-item ref="formFrame" :schema="formSchema"></form-item>
  </div>
</template>

<style lang="scss">
@import "./static/css/mixins.scss";

$borderWidth: 6px;
$borderColor: #333;
$deleteWidth: 14px;
$disabledColor: #c0c4cc;
$hoverBg: #ecf5ff;

/* 常规pop的样式配置：如删除的提示pop */
$popBorderWidth: 6px;
$popBorderColor: #d6d9de;
$popBgColor: #fbfbfb;

$addBtnWidth: 18px;
$addBtnLineWidth: $addBtnWidth - 8;
$addBtnLineHeight: 2px;
$addBtnColor: #7b808c;

$activeBtnColor: #409eff;
$btnDisableColor: #d5d7dc;

.es-form {
  // margin: 20px 15px;
  overflow: hidden;
  line-height: normal;

  /* 一些公共样式 */

  .es-required {
    color: $g_errorColor;
    vertical-align: middle;
    margin-right: 3px;
  }

  .es-form-unit {
    margin: 0 2px 0 5px;
    @include flex-fixed;
    @include display-center;
    color: #606266;
    font-size: 95%;
  }

  .es-fade-enter-active,
  .es-fade-leave-active {
    transition: opacity 0.1s ease;
  }
  .es-fade-enter,
  .es-fade-leave-to {
    opacity: 0;
  }
}

.es-btn-group {
  margin: 0 auto;
  display: block;
  position: relative;
  white-space: nowrap;
  font-size: 0;
}

.es-btn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid $g_borderColor;
  border-color: $g_borderColor;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 0px 10px;
  font-size: 13px;
  border-radius: 4px;
  height: 30px;
  position: relative;
  z-index: 1;

  &:not(.disabled):hover {
    border-color: #c6e2ff;
    background: $hoverBg;
    z-index: 2;
    color: #409eff;
  }
}

.es-btn.disabled {
  color: $disabledColor;
  cursor: not-allowed;
  background-image: none;
  background-color: #fff;
  border-color: #ebeef5;
  z-index: 0;
}

.es-btn-group .es-btn:not(:first-child):not(:last-child) {
  border-radius: 0;
}

.es-btn-group .es-btn:not(:last-child) {
  margin-right: -1px;
}

.es-btn-group .es-btn:first-child:not(:last-child) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.es-btn-group .es-btn:last-child:not(:first-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.es-plus-btn {
  margin: 0 auto;
  padding: 0px;
  font-size: 14px;
  width: $addBtnWidth;
  height: $addBtnWidth;
  line-height: $addBtnWidth - 2;
  border: 1px solid $g_borderColor;
  box-sizing: border-box;
  border-radius: 3px;
  text-align: center;
  cursor: pointer;

  &::before {
    content: "";
    display: block;
    position: absolute;
    border-radius: 3px;
    top: ($addBtnWidth - $addBtnLineHeight - 2)/2;
    left: ($addBtnWidth - $addBtnLineWidth - 2)/2;
    width: $addBtnLineWidth;
    height: $addBtnLineHeight;
    background: $addBtnColor;
  }

  &::after {
    content: "";
    display: block;
    position: absolute;
    border-radius: 3px;
    top: ($addBtnWidth - $addBtnLineWidth - 2)/2;
    left: ($addBtnWidth - $addBtnLineHeight - 2)/2;
    width: $addBtnLineHeight;
    height: $addBtnLineWidth;
    background: $addBtnColor;
  }

  &.disabled::before {
    background: $btnDisableColor;
  }

  &.disabled::after {
    background: $btnDisableColor;
  }
}

.es-circle-delete {
  margin: 0 auto;
  padding: 0;
  width: $deleteWidth;
  height: $deleteWidth;
  border-radius: 50%;
  background: #f56c6c;
  position: relative;
}

.es-circle-delete::before {
  margin: 0 auto;
  padding: 0;
  content: "";
  display: block;
  width: $deleteWidth - 6;
  height: 2px;
  position: absolute;
  top: $deleteWidth/2 - 1;
  left: 3px;
  background: #fff;
  border-radius: 1px;
}

.es-btn.disabled .es-circle-delete {
  background: #fab6b6;
}

.es-normal-plus {
  margin: 0 auto;
  padding: 0;
  width: $addBtnLineWidth;
  height: $addBtnLineWidth;
  position: relative;

  &::before {
    content: "";
    display: block;
    position: absolute;
    border-radius: 3px;
    top: ($addBtnLineWidth - $addBtnLineHeight)/2;
    left: ($addBtnLineWidth - $addBtnLineWidth)/2;
    width: $addBtnLineWidth;
    height: $addBtnLineHeight;
    background: $addBtnColor;
  }

  &::after {
    content: "";
    display: block;
    position: absolute;
    border-radius: 3px;
    top: ($addBtnLineWidth - $addBtnLineWidth)/2;
    left: ($addBtnLineWidth - $addBtnLineHeight)/2;
    width: $addBtnLineHeight;
    height: $addBtnLineWidth;
    background: $addBtnColor;
  }
}

.es-btn.disabled .es-normal-plus::before {
  background: $btnDisableColor;
}

.es-btn.disabled .es-normal-plus::after {
  background: $btnDisableColor;
}

.es-triangle-border-up.es-left {
  transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg); /* Safari 和 Chrome */
}

.es-triangle-border-up {
  @include arrow($borderColor, $borderWidth, "top", #fff);
}

.es-btn.disabled .es-triangle-border-up {
  border-bottom-color: $disabledColor;
}

.es-btn:not(.disabled):hover .es-triangle-border-up:before {
  border-bottom-color: $hoverBg;
}

.es-triangle-border-down {
  @include arrow($borderColor, $borderWidth, "bottom", #fff);
}

.es-triangle-border-down.es-right {
  transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg); /* Safari 和 Chrome */
}

.es-btn.disabled .es-triangle-border-down {
  border-top-color: $disabledColor;
}

.es-btn:not(.disabled):hover .es-triangle-border-down:before {
  border-top-color: $hoverBg;
}

/* 常规pop的样式样式：如删除的提示pop */
.es-form-pop-box {
  display: block;
  min-height: 16px;
  position: absolute;
  top: 0;
  left: 0;

  margin: auto auto;

  color: #fff;
  font-size: 12px;
  line-height: 16px;
  z-index: 1999;

  .es-form-pop-content {
    background: $popBgColor;
    border-radius: 4px;
    border: 1px solid $g_borderColor;
    padding: 10px 10px 10px 10px;
    max-width: 160px;
    color: #606266;
    line-height: 1.4;
    text-align: justify;
    font-size: 14px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    font-size: 13px;
    text-align: center;
  }

  .es-form-pop-content.es-thin {
    padding: 5px 8px;
  }

  .es-btn-row {
    margin-top: 5px;
    font-size: 12px;
  }

  .es-pop-arrow-top {
    @include arrow($popBorderColor, $popBorderWidth, "top", $popBgColor);
    position: absolute;
  }

  .es-pop-arrow-right {
    @include arrow($popBorderColor, $popBorderWidth, "right", $popBgColor);
    position: absolute;
    left: auto;
  }

  .es-pop-arrow-bottom {
    @include arrow($popBorderColor, $popBorderWidth, "bottom", $popBgColor);
    position: absolute;
  }

  .es-pop-arrow-left {
    @include arrow($popBorderColor, $popBorderWidth, "left", $popBgColor);
    position: absolute;
  }
}
</style>

<script>
import formItem from "./form-item.vue";
import utils from "./libs/utils.js";
import formUtils from "./libs/form-utils.js";
import parse from "./libs/parse.js";
import constant from "./libs/constant.js";

export default {
  /* ====================== 生命周期 ====================== */
  created() {
    this.__initUi(this.schema);

    this.$nextTick(() => {
      this.$data.isInited = true; // 为什么要写这个，因为开发过程中，有些组件的默认值需要转化，导致会触发checkRules, 体验不好
      this.$emit("inited", utils.deepCopy(this._esResultValue));
    });
    return;
  },

  mounted() {},

  destroyed() {},

  /* ====================== 引用组件 ====================== */

  components: {
    formItem
  },

  /* ====================== 数据绑定 ====================== */

  props: {
    global: {
      // 用来接受外部数据
      type: Object,
      default: () => ({})
    },

    schema: {
      type: Object
    },

    value: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    }
  },

  data() {
    return {
      formSchema: {}, // $data有这个值说明是es-form
      isInited: false

      // formGlobal: {},

      // formData: {},
      // resultValue: {},
      // originalValue: {} // 最初的值
    };
  },

  /* ====================== 事件处理 ====================== */

  methods: {
    getRef(name) {
      return this.$refs.formFrame.getRef(name);
    },

    isHidden(pathKey) {
      this._isHidden(pathKey);
    },

    _isHidden(pathKey) {
      return false;
    },

    /* 下划线一杠代表对内使用 */
    _getType() {
      return constant.UI_FORM;
    },

    /* 下划线一杠代表对内使用 */
    _getSchema() {
      return this.$data.formSchema;
    },

    //检查整个表单
    checkAll() {
      var isValid = this.__checkProp(
        this.$data.formSchema,
        this.$data.formSchema
      );
      return isValid;
    },

    __initUi(schema) {
      var tmpSchema = formUtils.completeSchema(schema);
      //将value的值同步到schema中
      this.__setValue(tmpSchema, this.value);
      //进行初始化
      this.$data.formSchema = tmpSchema;
      this.__syncValue();
      this._esOriginalValue = utils.deepCopy(this._esFormData);
    },

    __checkProp(schema, rootSchema) {
      //idxChain要与每一form-item的idxitem是一样的，否则判断会出现不一致，要小心
      // console.log("idxChain ==  schema.__idxChain", idxChain, '|', schema.__idxChain);
      var isValid = true;

      var parseSources = {
        global: this.global,
        rootData: this._esFormData,
        index: schema.__index,
        idxChain: schema.__idxChain,
        rootSchema: rootSchema
      };

      //是否隐藏，隐藏就不用检查有效性了
      var isHidden = parse.smartEsValue(schema.hidden, parseSources);
      if (isHidden) {
        return isValid;
      }
      // idxChain = idxChain ? idxChain : "";
      var validResult,
        checkedResult,
        isTabs,
        tabsIndex,
        nextPropItem,
        i,
        arrayValue,
        schemaList;
      if (schema.properties) {
        if (schema.array) {
          if (schema.array.rules) {
            arrayValue = formUtils.getValue(schema);
            checkedResult = formUtils.checkRules(
              schema.array.rules,
              arrayValue,
              "",
              parseSources,
              schema.__pathKey
            );
            if (checkedResult === true) {
              schema.__invalidMsg = false;
            } else {
              schema.__invalidMsg = checkedResult;
              isValid = false;
            }
          }

          isTabs = schema.array.name == constant.ARRAY_TABS ? true : false;
          tabsIndex = isTabs ? schema.__tabsIndex : false;

          schemaList = schema.__propSchemaList;
          for (i = 0; i < schemaList.length; i++) {
            nextPropItem = schemaList[i];

            validResult = this.__checkProp(nextPropItem, rootSchema);
            if (isTabs) {
              // 父节点是tabs
              if (!validResult && i !== tabsIndex) {
                // 有错，tab是隐藏的
                if (!nextPropItem.__hasError) {
                  nextPropItem.__hasError = true;
                }
              } else {
                // 没有错或当前的tabs是我这一tab
                if (nextPropItem.__hasError) {
                  nextPropItem.__hasError = false;
                }
              }
            }

            isValid = !isValid ? isValid : validResult;
          }

          if (!isValid && schema.ui && !schema.ui.showBody) {
            // 有错 schema.title为null, 可能是ARRAY_TABS的item
            schema.ui.showBody = true;
          }
        } else {
          isTabs =
            schema.layout && schema.layout.name == constant.LAYOUT_TABS
              ? true
              : false;
          tabsIndex = isTabs ? schema.__tabsIndex : false;
          for (var key in schema.properties) {
            nextPropItem = schema.properties[key];

            validResult = this.__checkProp(nextPropItem, rootSchema);
            if (isTabs) {
              // 父节点是tabs
              if (!validResult && key !== tabsIndex) {
                // 有错，tab是隐藏的
                if (!nextPropItem.__hasError) {
                  nextPropItem.__hasError = true;
                }
              } else {
                // 没有错或当前的tabs是我这一tab
                if (nextPropItem.__hasError) {
                  nextPropItem.__hasError = false;
                }
              }
            }

            isValid = !isValid ? isValid : validResult;
          }

          if (!isValid && schema.title && !schema.title.showBody) {
            // 有错
            schema.title.showBody = true;
          }
        }
      } else if (schema.component) {
        if (!schema.array) {
          // 是叶子，但也不是数组
          checkedResult = formUtils.checkRules(
            schema.rules,
            schema.value,
            "",
            parseSources,
            schema.__pathKey
          );
          if (checkedResult === true) {
            schema.__invalidMsg = false;
          } else {
            schema.__invalidMsg = checkedResult;
            isValid = false;
          }
        } else {
          // 是叶子，但也是数组
          if (schema.array.rules) {
            arrayValue = formUtils.getValue(schema);
            checkedResult = formUtils.checkRules(
              schema.array.rules,
              arrayValue,
              "",
              parseSources,
              schema.__pathKey
            );
            if (checkedResult === true) {
              schema.__invalidMsg = false;
            } else {
              schema.__invalidMsg = checkedResult;
              isValid = false;
            }
          }

          isTabs = schema.array.name == constant.ARRAY_TABS ? true : false;
          tabsIndex = isTabs ? schema.__tabsIndex : false;

          schemaList = schema.__propSchemaList;
          for (i = 0; i < schemaList.length; i++) {
            nextPropItem = schemaList[i];

            validResult = this.__checkProp(nextPropItem, rootSchema);
            if (isTabs) {
              // 父节点是tabs
              if (!validResult && i !== tabsIndex) {
                // 有错，tab是隐藏的
                if (!nextPropItem.__hasError) {
                  nextPropItem.__hasError = true;
                }
              } else {
                // 没有错或当前的tabs是我这一tab
                if (nextPropItem.__hasError) {
                  nextPropItem.__hasError = false;
                }
              }
            }

            isValid = !isValid ? isValid : validResult;
          }
        }
      }
      return isValid;
    },

    // 发出提交事件
    __submit() {
      this.$nextTick(() => {
        if (this.$data.isInited) {
          this.$emit("submit", utils.deepCopy(this._esResultValue));
        } else {
          console.warn("表单还未初始化完成，无法派发submit事件");
        }
      });
    },

    // 对外调用，发出提交事件
    submit() {
      this.__submit();
    },

    /**
     * 对外调用，取值
     */
    getValue() {
      return utils.deepCopy(this._esResultValue); //为什么不直接返回this.value? 因为watch是异步监听的，若设置为this.value, 当setValue,再getValue,那么取同的数据就不一致了
    },

    /**
     * 对外调用，设置值
     */
    setValue(key, value) {
      if (utils.isStr(key)) {
        //是字符串时，则值是键值，设置某个值
        this.__setValueByKey(this.$data.formSchema, key, value);
        this.__syncValue();
      } else if (utils.isObj(key)) {
        //是object,全局设置
        this.__setValue(this.$data.formSchema, key);
        this.__syncValue();
      }
    },

    /**
     * 对外调用，取某一个tabs的索引
     */
    getTabsIndex(key) {
      return formUtils.getTabsIndex(this.$data.formSchema, key);
    },

    /**
     * 对外调用，设某一个tabs的索引
     */
    setTabsIndex(key, index) {
      formUtils.setTabsIndex(this.$data.formSchema, key, index);
    },

    /**
     * 对外调用，重置值
     */
    reset() {
      // console.log(this._esOriginalValue);
      this.setValue(this._esOriginalValue);
      //去年所有的错误提示
      formUtils.clearErrorMsg(this.$data.formSchema);
    },

    /*
    把value赋给(同步)给某一项
    */
    __setValueByKey(schema, key, value) {
      if (key && utils.isStr(key)) {
        formUtils.setValueByKey(
          schema,
          formUtils.perfectTileValue(schema, key),
          utils.deepCopy(value)
        );
      }
    },

    /*
    把value赋给(同步)schema
    */
    __setValue(schema, value) {
      if (utils.isObj(value) && Object.keys(value).length > 0) {
        //value没有值
        formUtils.setValue(
          schema,
          formUtils.perfectTileValue(schema, utils.deepCopy(value))
        );
      }
    },

    _syncUi(checkSchema, eventNames, targetValue, eventData) {
      //  console.log("over...: ", checkSchema, eventNames, targetValue, eventData);
      // return this.$data.formSchema;
      // var tmpResultValue = false;
      var sourcePathKey = checkSchema[0].__pathKey; // checkSchema必有值
      if (eventNames.includes(constant.INPUT_EVENT)) {
        // 需要同步
        this.__syncValue(sourcePathKey); // 第一个就是触发源
        // tmpResultValue =this._esResultValue;
      }

      if (this.isInited) {
        var inputSchema = checkSchema[0];
        // 验证当前的输入框
        var parseSources = {
          global: this.global,
          rootData: this._esFormData,
          index: inputSchema.__index,
          idxChain: inputSchema.__idxChain,
          rootSchema: this.$data.formSchema
        };
        // 为什么要写这个，因为开发过程中，有些组件的默认值需要转化，导致会触发checkRules, 体验不好
        var checkedResult = formUtils.checkRules(
          inputSchema.array ? inputSchema.array.rules : inputSchema.rules,
          targetValue,
          eventNames,
          parseSources,
          inputSchema.__pathKey
        );
        // console.log("inputSchema.rules: ", targetValue, this._esFormData);
        if (checkedResult === true) {
          inputSchema.__invalidMsg = false;
        } else if (checkedResult !== false) {
          // 字符串，错误
          inputSchema.__invalidMsg = checkedResult;
        } else {
          // 为false, 不是目标事件，不用理会
        }

        // 取出所有需要执行的事件
        var handlers = [];
        var actions = inputSchema.array
          ? inputSchema.array.actions
          : inputSchema.component.actions;
        if (actions) {
          actions.forEach(action => {
            if (utils.isInter(action.trigger, eventNames)) {
              handlers.push(action.handler);
            }
          });
        }

        if (handlers.length > 0 || eventNames.includes(constant.INPUT_EVENT)) {
          var vm = this;
          vm.$nextTick(() => {
            // 这用可以记录是什么导致表单改变
            if (handlers.length > 0) {
              handlers.forEach(handler => {
                handler.call(vm, targetValue, sourcePathKey, eventData);
              });
            }

            if (eventNames.includes(constant.INPUT_EVENT)) {
              this.$emit(
                "change",
                utils.deepCopy(this._esResultValue),
                sourcePathKey
              );
            }

            checkSchema = null;
            eventNames = undefined;
            targetValue = undefined;
            eventData = undefined;
            handlers = null;
          });
        }
      }
    },

    _toggleUi(type, data) {
      switch (type) {
        case "tabs": // tabs头部触发 data: {key, index}
          formUtils.setTabsIndex(this.$data.formSchema, data.key, data.index); // 更改目标的tabs的索引
          break;
        case "toggle": // properies 隐藏或打开触发 data: {key}
          formUtils.togglePropBody(this.$data.formSchema, data.key); // 切换隐藏/打开
          break;
        default:
          break;
      }
    },

    __syncValue(sourcePathKey) {
      // 不单只是执行actions
      var formData = formUtils.getValue(this.$data.formSchema);
      this._esFormData = formData;

      var baseParseSources = {
        global: this.global,
        rootData: this._esFormData,
        rootSchema: this.$data.formSchema
      };

      formUtils.analyzeUiProps(this.$data.formSchema, baseParseSources);
      var resultValue = formUtils.getResultValue(
        this.$data.formSchema,
        baseParseSources
      );

      this._esResultValue = resultValue;

      this.$emit(
        "input",
        utils.deepCopy(resultValue),
        sourcePathKey ? sourcePathKey : false
      );
    }
  },

  watch: {
    //watch是异步监听的，而$emit("input"...)是同步的
    schema: {
      handler(newVal) {
        if (utils.isObj(newVal) && Object.keys(newVal).length > 0) {
          this.__initUi(newVal);
        }
      },
      deep: false
    },

    //watch是异步监听的，而$emit("input"...)是同步的
    value: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this._esResultValue)) {
          this.__setValue(this.$data.formSchema, newVal);
          this.__syncValue();
        } else {
          // ...
        }
      },
      deep: false
    },

    global: {
      handler(newVal, oldVal) {
        if (
          utils.isObj(newVal) &&
          JSON.stringify(newVal) !== JSON.stringify(oldVal)
        ) {
          // this.$data.formGlobal = JSON.parse(JSON.stringify(newVal)); // 为什么要重新复制，因为form-item为是深度监听
          this.__syncValue();
        }
      },
      deep: true
    }
  }
};
</script>
