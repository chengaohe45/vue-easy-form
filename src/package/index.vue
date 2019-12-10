<template>
  <div class="es-form">
    <form-item ref="formFrame" :schema="formSchema"></form-item>
    <consolePanel
      v-if="canConsole"
      :rootData="csRootData"
      :formValue="csFormValue"
    ></consolePanel>
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
  position: relative;
  // overflow: hidden;
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
  vertical-align: middle; // safari

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
import globalSettings from "./libs/global.js";
import schemaUtils from "./libs/schema-utils.js";
import formUtils from "./libs/form-utils.js";
import parse from "./libs/parse.js";
import constant from "./libs/constant.js";

import consolePanel from "./components/console.vue";

export default {
  /* ====================== 生命周期 ====================== */
  created() {
    this.$data.canConsole = utils.isBool(this.hasConsole)
      ? this.hasConsole
      : globalSettings.hasConsole;

    this._esHiddenLevel = 0; // 层级设置为0
    this._esLockSubmit = false;

    var hiddenFunc = this.isHidden;
    this._esHiddenFunc = hiddenFunc.bind(this); // 用于作隐藏解析

    this.__initUi(this.schema);
  },

  mounted() {},

  destroyed() {},

  data() {
    return {
      /* _es这些属性都不涉及页面的控制，所以不设置为data
      _esHiddenLevel: 0,
      _esOriginalValue: null,
      _esHiddenFunc: null,
      _esResultValue: null,
      _esFormData: null,
      _esLockSubmit: false // 开始是false,
      _esWarns: []
      */

      canConsole: true,
      csRootData: null, // 用于console, 只有当canConsole为true时才有值
      csFormValue: null,

      formSchema: {}, // $data有这个值说明是es-form
      isInited: false
    };
  },

  /* ====================== 引用组件 ====================== */

  components: {
    formItem,
    consolePanel
  },

  /* ====================== 数据绑定 ====================== */

  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    global: {
      // 经测试：当传为null时，global的值就为null, 当传为undefined时，global的值就为default
      // 用来接受外部数据
      type: Object,
      // 经测试：当传为null或undefined时，validator中的value参数都为default，跟global有点不同，奇怪吧
      // validator: function (value) {
      //   console.log("value: ", value);
      //   return value !== null;
      // },
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
    },

    hasConsole: {
      type: Boolean,
      required: false,
      default: undefined // 不能设置true/false,因为没设置会去匹配global
    }
  },

  /* ====================== 事件处理 ====================== */

  methods: {
    /**
     * @param name 索引值
     * @param idxChain 组件所在的位置 如: 1,2 或 0
     */
    getRef(name, idxChain) {
      // var start = +new Date();
      var ref = this.$refs.formFrame.getRef(name);
      // console.log("ref: ", ref);
      if (ref && utils.isArr(ref)) {
        if (utils.isNum(idxChain)) {
          ref = ref[idxChain];
        } else if (idxChain && utils.isStr(idxChain)) {
          var indexs = idxChain.split(",");
          var curLevel = ref;
          for (var i = 0; i < indexs.length; i++) {
            var index = indexs[i];
            if (utils.isArr(curLevel) && index !== "" && curLevel[index]) {
              curLevel = curLevel[index];
            } else {
              curLevel = null;
              break;
            }
          }
          ref = curLevel;
        }
      }
      // var end = +new Date();
      // console.log("expired = ", end - start);
      return ref ? ref : null;
    },

    /**
     * 对外调用，取值
     * 实时取值，表单存在的值;也是getRootData的别名
     */
    getValue() {
      return utils.deepCopy(this._esFormData); //为什么不直接返回this.value? 因为watch是异步监听的，若设置为this.value, 当setValue,再getValue,那么取的数据就不一致了
    },

    /**
     * 对外调用，取值
     * 实时取值，表单存在的值;也是getValue的别名
     */
    getRootData() {
      return utils.deepCopy(this._esFormData);
    },

    /**
     * 对外调用，取值
     * 实时取值，用户提交所需要的值，不包括隐藏的或临时的；也就是v-model
     */
    getFormValue() {
      return utils.deepCopy(this._esResultValue); //为什么不直接返回this.value? 因为watch是异步监听的，若设置为this.value, 当setValue,再getValue,那么取的数据就不一致了
    },

    /**
     * 对外调用，取值
     */
    getGlobal() {
      return utils.deepCopy(this.global ? this.global : {}); // 防止null情况
    },

    /**
     * 对外调用，设置值
     */
    setValue(pathKey, value) {
      if (utils.isStr(pathKey)) {
        pathKey = parse.chainPathKey(pathKey); // 转链式，如：base["person"].name => base.person.name
        //是字符串时，则值是键值，设置某个值
        this.__setValueByKey(this.$data.formSchema, pathKey, value);
        this.__syncValue();
      } else if (utils.isObj(pathKey)) {
        //是object,全局设置
        this.__setValue(this.$data.formSchema, pathKey);
        this.__syncValue();
      }
    },

    /* 
    判断某项是否处于隐藏 
    注：此函数有容灾处理，一定要执行到最后，不能中途退出
    */
    isHidden(pathKey) {
      if (pathKey && utils.isStr(pathKey)) {
        pathKey = parse.chainPathKey(pathKey); // 转链式，如：base["person"].name => base.person.name
      } else {
        throw "isHidden: 参数必须是字符串且不能为空";
      }

      this._esHiddenLevel++;
      const MAX_TOTAL = 50;
      if (this._esHiddenLevel > MAX_TOTAL) {
        // 实际上不会这么深的(虽然理论上存在)
        throw "解析$hidden:[" +
          pathKey +
          "]出错，系统执行$hidden超过" +
          MAX_TOTAL +
          "次，可能为死循环";
      }

      var curHiddenValue = false;

      var rootSchema = this.$data.formSchema;
      var targetSchema = formUtils.getSchemaByKey(rootSchema, pathKey); // 看看最后一个是否存在
      if (!targetSchema) {
        if (this.$data.canConsole) {
          // 说明是调试状才打印
          if (!this._esWarns) {
            this._esWarns = [pathKey];
            this.$nextTick(() => {
              if (this._esWarns) {
                console.warn(
                  "无法匹配" +
                    this._esWarns.join("、") +
                    ",系统则认为其hidden为false"
                );
                this._esWarns = null;
              }
            });
          } else if (!this._esWarns.includes(pathKey)) {
            this._esWarns.push(pathKey);
          }
        }

        curHiddenValue = false;
      } else {
        var seperator = ".";
        var keys = pathKey.split(seperator);
        var parentPathKey = "",
          tmpParentPathKey;
        var reg = /\[\d+\]$/;
        var arraySymbol = "[";
        var key;
        var len = keys.length - 1;
        for (var i = 0; i <= len; i++) {
          key = keys[i];
          if (key.indexOf(arraySymbol) >= 0) {
            key = key.replace(reg, "");
          }

          tmpParentPathKey = parentPathKey
            ? parentPathKey + seperator + key
            : key;
          parentPathKey = parentPathKey
            ? parentPathKey + seperator + keys[i]
            : keys[i];

          // 为什么写tmpParentPathKey == pathKey, 防止test.name[0]这种情况
          var itemSchema =
            tmpParentPathKey == pathKey
              ? targetSchema
              : formUtils.getSchemaByKey(rootSchema, tmpParentPathKey);
          // if (itemSchema) {
          var parseSources = {
            global: this.global ? this.global : {}, // 防止null情况
            rootData: this._esFormData,
            index: itemSchema.__index,
            idxChain: itemSchema.__idxChain,
            pathKey: itemSchema.__pathKey,
            rootSchema: rootSchema,
            isHidden: this._esHiddenFunc
          };

          if (parse.smartEsValue(itemSchema.__rawHidden, parseSources)) {
            curHiddenValue = true;
            break;
          } else {
            // 父节点是显示的，继续
          }
          // } else {
          //   console.warn(
          //     "无法匹配" + tmpParentPathKey + "(系统则认为hidden为false)"
          //   );
          //   curHiddenValue = false;
          //   break;
          // }
        }
      }

      this._esHiddenLevel--;
      // console.log("this._esHiddenLevel: ", this._esHiddenLevel);

      // 全部都没有隐藏
      return curHiddenValue;
    },

    //检查整个表单
    checkAll() {
      var isValid = this.__checkProp(
        this.$data.formSchema,
        this.$data.formSchema
      );
      return isValid;
    },

    // 对外调用，发出提交事件
    submit() {
      this.__submit();
    },

    /**
     * 对外调用，取某一个tabs的索引
     */
    getTabsIndex(pathKey) {
      if (pathKey && utils.isStr(pathKey)) {
        pathKey = parse.chainPathKey(pathKey); // 转链式，如：base["person"].name => base.person.name
      } else {
        throw "isHidden: 参数必须是字符串且不能为空";
      }

      return formUtils.getTabsIndex(this.$data.formSchema, pathKey);
    },

    /**
     * 对外调用，设某一个tabs的索引
     */
    setTabsIndex(pathKey, index) {
      if (pathKey && utils.isStr(pathKey)) {
        pathKey = parse.chainPathKey(pathKey); // 转链式，如：base["person"].name => base.person.name
      } else {
        throw "isHidden: 参数必须是字符串且不能为空";
      }

      formUtils.setTabsIndex(this.$data.formSchema, pathKey, index);
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

    /* 下划线一杠代表对内使用 */
    _getType() {
      return constant.UI_FORM;
    },

    /* 下划线一杠代表对内使用 */
    _getSchema() {
      return this.$data.formSchema;
    },

    __initUi(schema) {
      this.$data.isInited = false;
      var tmpSchema = schemaUtils.completeSchema(schema);
      //将value的值同步到schema中
      this.__setValue(tmpSchema, this.value);
      //进行初始化
      this.$data.formSchema = tmpSchema;
      this.__syncValue();
      this._esOriginalValue = utils.deepCopy(this._esFormData);

      this.$nextTick(() => {
        this.$data.isInited = true; // 为什么要写这个，因为开发过程中，有些组件的默认值需要转化，导致会触发checkRules, 体验不好
        this.$emit("inited", utils.deepCopy(this._esResultValue));
      });
    },

    __checkProp(schema, rootSchema) {
      //idxChain要与每一form-item的idxitem是一样的，否则判断会出现不一致，要小心
      // console.log("idxChain ==  schema.__idxChain", idxChain, '|', schema.__idxChain);
      var isValid = true;

      //是否隐藏，隐藏就不用检查有效性了
      var isHidden = schema.hidden; // 省资源，不做es转
      if (isHidden) {
        return isValid;
      }

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
            checkedResult = this.__checkRules(schema, arrayValue, "");
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
          checkedResult = this.__checkRules(schema, schema.component.value, "");
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
            checkedResult = this.__checkRules(schema, arrayValue, "");
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
      // parseSources = null;
      return isValid;
    },

    // 发出提交事件
    __submit() {
      if (!this.$data._esLockSubmit) {
        this.$data._esLockSubmit = true; // 加锁，保存只触发一次
        this.$nextTick(() => {
          this.$data._esLockSubmit = false;
          if (this.$data.isInited) {
            this.$emit("submit", utils.deepCopy(this._esResultValue));
          } else {
            console.warn("表单还未初始化完成，无法派发submit事件");
          }
        });
      }
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

    _syncUi(checkSchemas, eventNames, options) {
      var sourcePathKey = checkSchemas[0].__pathKey; // checkSchemas必有值
      if (eventNames.includes(constant.INPUT_EVENT)) {
        // 需要同步
        this.__syncValue(sourcePathKey); // 第一个就是触发源
        // tmpResultValue =this._esResultValue;
      }

      if (this.isInited) {
        var inputSchema = checkSchemas[0];
        // 验证当前的输入框
        var parseSources = {
          global: this.global ? this.global : {}, // 防止null情况
          rootData: this._esFormData,
          index: inputSchema.__index,
          idxChain: inputSchema.__idxChain,
          pathKey: inputSchema.__pathKey,
          rootSchema: this.$data.formSchema,
          isHidden: this._esHiddenFunc
        };
        // 为什么要写这个，因为开发过程中，有些组件的默认值需要转化，导致会触发checkRules, 体验不好
        var checkedResult = this.__checkRules(
          inputSchema,
          options.value,
          eventNames,
          parseSources
        );

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
          // 这个可以记录是什么导致表单改变
          if (handlers.length > 0) {
            handlers.forEach(handler => {
              handler.call(this, options);
            });
          }

          if (eventNames.includes(constant.INPUT_EVENT)) {
            this.$emit(
              "change",
              utils.deepCopy(this._esResultValue),
              sourcePathKey
            );
          }
        }

        /* 释放内存 */
        checkSchemas = null;
        eventNames = undefined;
        options = null;
        handlers = null;
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
        global: this.global ? this.global : {}, // 防止null情况
        rootData: this._esFormData,
        rootSchema: this.$data.formSchema,
        isHidden: this._esHiddenFunc
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

      if (this.$data.canConsole) {
        this.$data.csRootData = utils.deepCopy(formData);
        this.$data.csFormValue = utils.deepCopy(resultValue);
      }

      baseParseSources = null;
      resultValue = null;
    },

    /**
     *
     * @param {*} schema 这个东西已经是解析过了，不用重新解析
     * @param {*} value
     * @param {*} triggers 当triggers没有时，说明rules的规则无论是什么条件触发都要判断一遍
     * @returns Boolean or string
     * true 是需要检查的，并且正确
     * false 不需要检查
     * string 是需要检查的，但不正确
     */
    __checkRules: function(schema, value, triggers) {
      var rules, fromArray;
      if (schema.array && schema.array.rules) {
        rules = schema.array.rules;
        fromArray = true;
      } else {
        rules = schema.rules;
        fromArray = false;
      }

      if (!rules) {
        //没有规则
        return true;
      }

      // 是数组,检查min, max
      if (!triggers && fromArray) {
        // 数据提交时再检查
        if (
          schema.array.min > 0 &&
          schema.__propSchemaList.length < schema.array.min
        ) {
          return schema.array.minMsg;
        } else if (
          schema.array.max > 0 &&
          schema.__propSchemaList.length > schema.array.max
        ) {
          return schema.array.maxMsg;
        }
      }

      var isRequired = rules.required;
      if (isRequired) {
        //空要检查
        if (formUtils.isEmpty(value)) {
          return rules.emptyMsg;
        }
      } else if (!isRequired && formUtils.isEmpty(value)) {
        //空时不检查，场景：当埋写邮件地址时，要么不写要么写正确
        return true;
      }
      //非空情况
      var checkList = rules.checks;
      var errMsg = true;
      var checkFun, newOptions;
      // var newParseSources;

      if (checkList && checkList.length > 0) {
        var hadChecked = false;
        for (var i = 0; i < checkList.length; i++) {
          var checkItem = checkList[i];
          var checkTriggers = checkItem.trigger; //检查时机，默认为实时
          // triggers为空时，就无条件检查(checkAll); 不为空时就条件触发
          if (!triggers || utils.isInter(checkTriggers, triggers)) {
            checkFun = checkItem.handler;

            hadChecked = true;
            var result = true;

            if (!newOptions) {
              newOptions = {};
              newOptions.value = value;
              newOptions.pathKey = schema.__pathKey;
              newOptions.idxChain = schema.__idxChain;
              newOptions.index = schema.__index;
            }
            result = checkFun.call(this, newOptions);

            if (result !== true) {
              if (utils.isStr(result)) {
                //直接返回错误信息
                errMsg = result.trim();
                if (!errMsg) {
                  errMsg = rules.errMsg;
                }
              } else {
                //用统一的错误信息
                errMsg = rules.errMsg;
              }
              break;
            }
          }
        }

        if (!hadChecked) {
          // 当triggers为空时是不会进入这里的，所以triggers不会为空
          /* 若是正在输入且之前的错误信息为空提示则删掉 */
          if (
            triggers.includes(constant.INPUT_EVENT) &&
            schema.__invalidMsg === rules.emptyMsg
          ) {
            errMsg = true;
          } else if (fromArray) {
            if (
              schema.array.min > 0 &&
              schema.__propSchemaList.length >= schema.array.min &&
              schema.__invalidMsg === schema.array.minMsg
            ) {
              // 之前是最小提示有误；现在去掉
              errMsg = true;
            } else if (
              schema.array.max > 0 &&
              schema.__propSchemaList.length <= schema.array.max &&
              schema.__invalidMsg === schema.array.maxMsg
            ) {
              // 之前是最大提示有误；现在去掉
              errMsg = true;
            } else {
              errMsg = false; // 保持原样
            }
          } else {
            errMsg = false;
          }
        }
      } else {
        // 没有要验证的东西
        errMsg = true;
        if (triggers && fromArray) {
          // 数组非提交时
          if (
            triggers.includes(constant.INPUT_EVENT) &&
            schema.__invalidMsg === rules.emptyMsg
          ) {
            errMsg = true;
          } else if (
            schema.array.min > 0 &&
            schema.__propSchemaList.length >= schema.array.min &&
            schema.__invalidMsg === schema.array.minMsg
          ) {
            // 之前是最小提示有误；现在去掉
            errMsg = true;
          } else if (
            schema.array.max > 0 &&
            schema.__propSchemaList.length <= schema.array.max &&
            schema.__invalidMsg === schema.array.maxMsg
          ) {
            // 之前是最大提示有误；现在去掉
            errMsg = true;
          } else {
            errMsg = false; // 保持原样
          }
        }
      }
      // newParseSources = null;
      newOptions = null;
      return errMsg;
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
      /**
       * 注：不是深度改变时，newVal和oldVal是一样的
       */
      handler(newVal, oldVal) {
        // console.log("newValue: ", newVal, oldVal, this.global);
        if (utils.isObj(newVal)) {
          // undefined也就变为{default}, 从而下入这里
          if (newVal === oldVal) {
            // 深度改变
            // console.log("=== here...");
            this.__syncValue();
          } else if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            // 地址改变且值不同
            // console.log("!== here...");
            this.__syncValue();
          }
        } else if (newVal === null) {
          // global的值变为null，需要做兼容
          // console.log("123");
          this.__syncValue();
        }
      },
      deep: true
    }
  },

  beforeDestroy() {
    this._esOriginalValue = null;
    this._esHiddenFunc = null;
    this._esResultValue = null;
    this._esFormData = null;
  }
};
</script>
