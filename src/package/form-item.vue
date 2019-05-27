<template>
  <div class="es-form-item">
    <div v-if="hasTitle" :class="titleClass">
      <div v-if="schema.title.text" class="es-title-txt">
        {{ schema.title.text }}
      </div>
      <div v-else class="es-title-txt es-title-empty">&nbsp;</div>
      <div
        v-if="schema.title.__hasToggle"
        class="es-more-btn"
        @click="toggleBody"
      >
        {{ schema.title.showBody ? "隐藏" : "打开" }}
      </div>
      <div v-if="schema.help" class="es-form-help">
        <!-- <es-base :config="schema.help" :open-smart="false"></es-base> -->
        <es-base
          :config="schema.help"
          :form-data="formData"
          :global="global"
          :idx-chain="schema.__idxChain"
          :index="schema.__index"
        ></es-base>
      </div>
    </div>
    <div
      class="es-form-body"
      v-show="!hasTitle || schema.title.showBody"
      :style="bodyStyle"
    >
      <!-- 非数组 -->
      <template v-if="!schema.array">
        <!-- 叶子节点: 说明：有生成表单时,预判断schema过程中，schema.component和schema.properties只能存在一个，不会同时存在，也就是说要能是叶子节点，要么不是 -->
        <div
          :class="[
            'es-form-component',
            'es-form-component-' + schema.component.align
          ]"
          v-if="schema.component"
        >
          <div
            :class="[
              'es-form-component-wrap',
              schema.component.size
                ? 'es-form-wrap-' + schema.component.size
                : ''
            ]"
          >
            <es-base
              :ref="schema.component.ref"
              :class="[
                schema.component.size
                  ? 'es-form-component-' + schema.component.size
                  : ''
              ]"
              :config="schema.component"
              :form-data="formData"
              :global="global"
              :idx-chain="schema.__idxChain"
              :index="schema.__index"
              v-model="schema.value"
              :emitEvents="schema.component.__emitEvents"
              :nativeEvents="schema.component.__nativeEvents"
              @trigger="triggerHandler"
            >
            </es-base>
          </div>
          <div v-if="schema.unit && !schema.__inGroups" class="es-form-unit">
            {{ schema.unit }}
          </div>
          <div
            v-if="schema.help && !schema.__inGroups && showHelpInBody"
            class="es-form-help"
          >
            <es-base
              :config="schema.help"
              :form-data="formData"
              :global="global"
              :idx-chain="schema.__idxChain"
              :index="schema.__index"
            ></es-base>
          </div>
        </div>

        <!-- 是节点(非叶子schema.properties)下一级(子节点，只会影响子节点，孙子不会影响；有点类似于display:flex)为tabs布局：占位空间项在处理schema过程中去掉了 -->
        <component
          v-else-if="
            schema.properties && schema.layout && schema.layout.name === 'tabs'
          "
          :is="'tabs'"
          :schema="schema"
          :form-data="formData"
          @formClick="formClick"
        >
          <template
            v-for="(fieldSchema, fieldName) in schema.properties"
            :slot="fieldName"
          >
            <form-item
              ref="__refTabs__"
              :schema="fieldSchema"
              :key="fieldName"
              @formChange="formChange"
              @formClick="formClick"
              :form-data="formData"
              :global="global"
              :isInited="isInited"
            ></form-item>
          </template>
        </component>

        <!-- 有properties，有下一级节点: slot="fieldName"是占位空间理论上不做slot, 但为了性能，不判断了 -->
        <component
          v-else-if="schema.properties"
          :is="'es-object'"
          :schema="schema"
          :form-data="formData"
        >
          <template
            v-for="(fieldSchema, fieldName) in schema.properties"
            :slot="fieldName"
          >
            <form-item
              ref="__refObject__"
              :schema="fieldSchema"
              :key="fieldName"
              @formChange="formChange"
              @formClick="formClick"
              :form-data="formData"
              :global="global"
              :isInited="isInited"
            ></form-item>
          </template>
        </component>
      </template>

      <!-- 数组 -->
      <template v-else>
        <!-- array 类型：可接受非叶子或叶子，此节点(非叶子)的子节点是tabs也无问题 -->
        <component
          v-if="schema.array.name == 'array'"
          :is="'array-row'"
          :schema="schema"
          :form-data="formData"
          @input="formArrayInput"
          @formClick="formClick"
        >
          <!-- 数组-非叶子(若有) -->
          <template
            v-for="(fieldSchema, fieldName) in schema.properties"
            :slot="fieldName"
            slot-scope="props"
          >
            <form-item
              ref="__refArrarRow__"
              :schema="props.schema"
              :key="fieldName"
              @formChange="formChange"
              @formClick="formClick"
              :form-data="formData"
              :global="global"
              :isInited="isInited"
            ></form-item>
          </template>

          <!-- 数组-叶子(若有) -->
          <div
            v-if="schema.component"
            class="es-form-component"
            slot-scope="props"
          >
            <!-- 必须是v-for,要不然ref取不出数组 -->
            <form-item
              v-for="key in 1"
              :key="key"
              ref="__refArrarRow__"
              :schema="props.schema"
              @formChange="formChange"
              :form-data="formData"
              :global="global"
              :isInited="isInited"
            ></form-item>
          </div>
        </component>

        <!-- array-card 类型：只接受叶子，也不接受tabs -->
        <component
          v-if="schema.array.name == 'array-card'"
          :is="'array-card'"
          :schema="schema"
          :form-data="formData"
          @input="formArrayInput"
        >
          <!-- 数组-非叶子(不会有，已经过滤掉了) -->

          <!-- 数组-叶子(若有) -->
          <div
            v-if="schema.component"
            class="es-form-component"
            slot-scope="props"
          >
            <!-- 必须是v-for,要不然ref取不出数组 -->
            <form-item
              v-for="key in 1"
              :key="key"
              ref="__refArrarCard__"
              :schema="props.schema"
              @formChange="formChange"
              :form-data="formData"
              :global="global"
              :isInited="isInited"
            ></form-item>
          </div>
        </component>

        <!-- array table 类型: 只接受非叶子(有chema.properties),因为无法叶子无法有这种形式; 子节点是tabs也将失效 -->
        <component
          v-else-if="schema.array.name == 'array-table'"
          :is="'array-table'"
          :schema="schema"
          :form-data="formData"
          @input="formArrayInput"
        >
          <!-- 数组-非叶子(若有) -->
          <template
            v-for="(fieldSchema, fieldName) in schema.properties"
            :slot="fieldName"
            slot-scope="props"
          >
            <form-item
              ref="__refArrarTable__"
              :schema="props.schema"
              :key="fieldName"
              @formChange="formChange"
              @formClick="formClick"
              :form-data="formData"
              :showHelpInBody="false"
              :global="global"
              :isInited="isInited"
            ></form-item>
          </template>

          <!-- 数组-叶子(不会有，已经过滤掉了) -->
        </component>

        <!-- array tabs 类型：可接受非叶子或叶子，此节点(非叶子)的子节点是tabs也无问题 -->
        <component
          v-else-if="schema.array && schema.array.name == 'array-tabs'"
          :is="'array-tabs'"
          :schema="schema"
          :form-data="formData"
          @input="formArrayInput"
          @formClick="formClick"
        >
          <!-- 数组-非叶子(若有) -->
          <template
            v-for="(fieldSchema, fieldName) in schema.properties"
            :slot="fieldName"
            slot-scope="props"
          >
            <form-item
              ref="__refArrarTabs__"
              :schema="props.schema"
              :key="fieldName"
              @formChange="formChange"
              @formClick="formClick"
              :form-data="formData"
              :global="global"
              :isInited="isInited"
            ></form-item>
          </template>

          <!-- 数组-叶子(若有) -->
          <div
            v-if="schema.component"
            class="es-form-component"
            slot-scope="props"
          >
            <!-- 必须是v-for,要不然ref取不出数组 -->
            <form-item
              v-for="key in 1"
              :key="key"
              ref="__refArrarTabs__"
              :schema="props.schema"
              @formChange="formChange"
              :form-data="formData"
              :global="global"
              :isInited="isInited"
            ></form-item>
          </div>
        </component>
      </template>

      <!-- 验证错误信息 -->
      <div v-show="schema.__invalidMsg" class="es-form-error">
        {{ schema.__invalidMsg }}
      </div>

      <!-- 描述信息，可以html -->
      <div v-if="schema.desc" class="es-form-desc" v-html="schema.desc">
        <!-- {{schema.desc}} -->
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "./static/css/mixins.scss";

.es-form-item {
  @include flex-full;
  overflow: hidden;

  .es-title-box {
    margin: 0 0 0 0;
    padding: 3px 0 0 0;
    text-align: left;
    font-weight: 400;
    font-size: 16px;
    line-height: 18px;

    @include display-flex;
    @include direction-h;
    justify-content: flex-start;
    align-items: center;
  }

  .es-title {
    margin: 0 0 0 0;
    padding: 3px 0 0 0;
    text-align: left;
    font-weight: 400;
    font-size: 16px;
    line-height: 18px;

    @include display-flex;
    @include direction-h;
    justify-content: flex-start;
    align-items: center;
  }

  @for $i from 1 through 3 {
    .es-title-l#{$i} {
      margin: 0 0 0 0;
      // margin-left: 10px * ($i - 1);
      font-weight: 400;
      font-size: 24px - 2 * ($i - 1);
      line-height: 26px - 2 * ($i - 1);
    }
  }

  // .es-title.es-title-line {
  //   padding-left: 10px;
  //   // border-left: 5px solid #50bfff;
  //   border-left: 5px solid #909399;
  // }

  .es-title.es-title-bg {
    background: $g_bgColor2;
    border-top-left-radius: $g_borderRadius;
    border-top-right-radius: $g_borderRadius;
    padding: 5px 0 3px 10px;
  }

  .es-title.es-title-block {
    padding: 1px 0 1px 10px;
    border-left: 4px solid #909399;
  }

  .es-title.es-title-bg-block {
    background: $g_bgColor2;
    border-top-left-radius: $g_borderRadius;
    border-top-right-radius: $g_borderRadius;
    padding: 5px 0 3px 10px;
    border-left: 4px solid #909399;
  }

  .es-title.es-body-border + .es-form-body {
    padding: 20px 10px 10px 10px;
    border-left: 1px solid $g_borderColor;
    border-right: 1px solid $g_borderColor;
    border-bottom: 1px solid $g_borderColor;
    border-bottom-left-radius: $g_borderRadius;
    border-bottom-right-radius: $g_borderRadius;
  }

  .es-title-txt {
    @include flex-full;
    text-align: left;
  }

  .es-title-empty {
    min-height: 32px;
  }

  .es-more-btn {
    @include flex-fixed;
    font-size: 15px;
    line-height: 18px;
    margin: 0 10px 0 6px;
    cursor: pointer;
    text-decoration: underline;
    user-select: none;

    &:hover {
      color: #409eff;
    }
  }

  .es-form-component {
    @include display-flex;
    @include direction-h;
    justify-content: flex-start;
    align-items: center;
  }

  .es-form-component-left {
    justify-content: flex-start;
  }

  .es-form-component-center {
    justify-content: center;
  }

  .es-form-component-right {
    justify-content: flex-end;
  }

  .es-form-component-auto {
    @include flex-full;
    width: auto;
    // text-align: center;
    white-space: nowrap;
  }

  .es-form-component-fixed {
    @include flex-fixed;
    width: auto;
    text-align: center;
    white-space: nowrap;
  }

  .es-form-component-wrap {
    @include flex-full;
    overflow: hidden;
  }

  .es-form-component-wrap.es-form-wrap-auto {
    @include display-flex;
    @include flex-full;
    width: auto;
    // text-align: center;
    white-space: nowrap;
  }

  .es-form-component-wrap.es-form-wrap-fixed {
    @include flex-fixed;
    width: auto;
    text-align: center;
    white-space: nowrap;
  }

  .es-form-error {
    margin: 3px 0 0 5px;
    text-align: left;
    color: $g_errorColor;
    font-size: 13px;
  }

  .es-form-desc {
    margin: 5px 0 0px 3px;
    text-align: left;
    color: #b3b5b9;
    font-size: 13px;
  }

  .es-form-help {
    margin: 0 8px;
    @include flex-fixed;
    @include display-center;
  }

  .es-form-help-icon {
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    line-height: 16px;
    background: #333;
    text-align: center;
    font-size: 13px;
    color: #fff;
    font-style: italic;
    font-family: "Times New Roman", "Times";
    user-select: none;
  }
}
</style>

<script>
import esObject from "./layout/object";
import arrayRow from "./layout/array-row";
import arrayCard from "./layout/array-card";
import arrayTable from "./layout/array-table";
import arrayTabs from "./layout/array-tabs";
import tabs from "./layout/tabs";
import itemMixin from "./mixins/item-mixin";
import utils from "./libs/utils";
import formUtils from "./libs/form-utils";
import constant from "./libs/constant";
import global from "./libs/global";
import esBase from "./base";

export default {
  name: "form-item", // 声明name可以嵌套自身
  mixins: [itemMixin],

  data() {
    return {
      unwatch: false,
      // showBody: true,
      isChanged: false,
      triggerList: []
    };
  },

  components: {
    esBase,
    esObject,
    arrayRow,
    arrayTable,
    arrayTabs,
    arrayCard,
    tabs
  },

  created() {
    this.__initUi();
  },

  computed: {
    hasTitle() {
      return (
        this.schema.properties &&
        (this.schema.title.text !== false || this.schema.help)
      ); // 是否有头部
    },

    bodyStyle() {
      var style = null;
      if (
        this.schema.properties &&
        (this.schema.title.text !== false || this.schema.help)
      ) {
        // 是否有头部
        //是properties且有头部
        // style = {};
        if (
          this.schema.title.type == "bg-border" ||
          this.schema.title.type == "bg-block-border"
        ) {
          style = {
            padding: Math.floor((this.schema.boxRowSpace * 2) / 3) + "px"
          }; //有边框时的样式
        } else {
          style = {
            paddingTop: Math.floor((this.schema.boxRowSpace * 3) / 3) + "px"
          }; //无边框时的样式
        }
      } else {
        style = null;
      }
      return style;
    },
    titleClass() {
      var tClass;
      if (this.schema.properties && (this.schema.title || this.schema.help)) {
        //是properties且有头部
        tClass = [
          "es-title-box",
          "es-title",
          "es-title-l" + this.schema.title.__level
        ];
        switch (this.schema.title.type) {
          case "bg":
            tClass.push("es-title-bg");
            break;
          case "block":
            tClass.push("es-title-block");
            break;
          case "bg-block":
            tClass.push("es-title-bg-block");
            break;
          case "bg-border":
            tClass.push("es-title-bg");
            tClass.push("es-body-border");
            break;
          case "bg-block-border":
            tClass.push("es-title-bg-block");
            tClass.push("es-body-border");
            break;
        }
      } else {
        tClass = [];
      }
      return tClass;
    }
  },

  methods: {
    getRefs(name) {
      var target = this.$refs[name];
      if (!target) {
        target = this.__getAllRefs(name);
      } else {
        target = target.$refs.__comTarget__; // 取出base组件内的目标组件
      }
      return target;
    },

    getRef(name) {
      var target;
      if (this.schema.component && !this.schema.array) {
        // 是叶子节点，直接取出
        var refTarget = this.$refs[name];
        if (refTarget) {
          target = refTarget.$refs.__comTarget__;
        } else {
          target = null;
        }
      } else {
        target = this.__getLastRefs(name);
      }
      return target;
    },

    __initUi() {
      // if (
      //   this.schema.properties &&
      //   this.schema.title &&
      //   this.schema.title.hasToggle
      // ) {
      //   this.$data.showBody =
      //     this.schema.title.showBody === false ? false : true;
      // }
      //不是所有的form-item都需要监听，只有有value值的才需求参加
      if (this.needWatch()) {
        this.setWatch();
      } else {
        // console.log('123456unwatch');
        if (this.$data.unwatch) {
          this.$data.unwatch();
          this.$data.unwatch = false;
        }
      }
    },

    /* 取出最后的，跟vue ref保持一致；也就是后面的会代表前面的 */
    __getLastRefs(name) {
      var __objectRef__ = "__refObject__";
      var __tabsRef__ = "__refTabs__";
      var sysRefIds = [
        __objectRef__,
        __tabsRef__,
        "__refArrarCard__",
        "__refArrarRow__",
        "__refArrarTable__",
        "__refArrarTabs__"
      ];

      var refTargets = null;
      for (var key in this.$refs) {
        // 这样扫描是为了按顺序正确取出
        if (sysRefIds.includes(key)) {
          var tmpTargets = this.__getTargetsIncludeRef(key, name);
          if (tmpTargets) {
            refTargets = tmpTargets; // 后面的代替前面的，跟原生vue ref保持一致
          }
        } else {
          // 不是系统所需要的，不需要理会；不过一般不会运行到这
        }
      }
      return refTargets;
    },

    __getTargetsIncludeRef(refName, name) {
      var __objectRef__ = "__refObject__";
      var __tabsRef__ = "__refTabs__";
      var curRefObj,
        nextTarget,
        newTarget = null;
      curRefObj = this.$refs[refName];
      if (curRefObj) {
        curRefObj.forEach(item => {
          nextTarget = item.getRef(name);
          if (nextTarget) {
            if (refName === __objectRef__ || refName === __tabsRef__) {
              // 不是数组，取最后一个
              newTarget = nextTarget;
            } else {
              // 是数组，合并成数组
              newTarget = newTarget ? newTarget : [];
              if (utils.isArr(nextTarget)) {
                newTarget = newTarget.concat(nextTarget);
              } else {
                newTarget.push(nextTarget);
              }
            }
          }
        });
      }
      return newTarget;
    },

    __getAllRefs(name) {
      return (
        this.__getTargetRefs("__refObject__", name) ||
        this.__getTargetRefs("__refTabs__", name) ||
        this.__getTargetRefs("__refArrarCard__", name) ||
        this.__getTargetRefs("__refArrarRow__", name) ||
        this.__getTargetRefs("__refArrarTable__", name) ||
        this.__getTargetRefs("__refArrarTabs__", name)
      );
    },

    __getTargetRefs(targetName, name) {
      // console.log("targetName: ", targetName);
      var curRef,
        nextTarget,
        newTarget = null;
      curRef = this.$refs[targetName];
      // console.log("curRef: ", curRef);
      if (curRef) {
        curRef.forEach(item => {
          nextTarget = item.getRefs(name);
          if (nextTarget) {
            // console.log("nextTarget", nextTarget);
            newTarget = newTarget ? newTarget : [];
            if (utils.isArr(nextTarget)) {
              newTarget = newTarget.concat(nextTarget);
            } else {
              newTarget.push(nextTarget);
            }
          }
        });
      }
      return newTarget;
    },

    needWatch() {
      //这个逻辑就是html的逻辑
      if (this.schema.array) {
        // 这个东西只要是检查rules, 没有rules时就不用监听了
        if (this.schema.array && this.schema.array.rules) {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.schema.component && this.schema.rules) {
          return true;
        } else {
          return false;
        }
      }
    },

    toggleBody() {
      // this.showBody = !this.showBody;
      this.$emit("formClick", "toggle", { key: this.schema.__pathKey });
    },

    triggerHandler(eventName, eventData) {
      var value = this.schema.value;
      var handlers = formUtils.getHandlers(
        eventName,
        this.schema.component.actions
      );
      var tmpValue = value;
      if (
        eventName == global.trimEvent &&
        this.schema.isTrim &&
        utils.isStr(value)
      ) {
        // global.trimEvent暂不会是constant.INPUT_EVENT事件，因为初始化时就不给设置为此值
        tmpValue = tmpValue.trim();
        if (tmpValue !== value) {
          this.schema.value = tmpValue;
          if (this.needWatch()) {
            this.$data.isChanged = true;
            this.$data.triggerList.push(eventName);
          }

          //值改变了，要发出input事件
          var inputHandlers = formUtils.getHandlers(
            constant.INPUT_EVENT,
            this.schema.component.actions
          );
          if (inputHandlers) {
            handlers = handlers
              ? handlers.concat(inputHandlers)
              : inputHandlers;
          }
          // if (handlers) {
          this.$emit(
            "formChange",
            this.schema.__pathKey,
            handlers,
            utils.deepCopy(tmpValue),
            eventData
          ); // 等到系统数据同步了再执行
          // } else {
          //   this.$emit(
          //     "formChange",
          //     this.schema.__pathKey,
          //     null,
          //     null,
          //     null
          //   );
          // }
          return true; //退出，由formdata触发检查
        }
      }

      if (eventName == constant.INPUT_EVENT) {
        if (this.needWatch()) {
          this.$data.isChanged = true;
          this.$data.triggerList.push(eventName);
        }
        if (handlers) {
          // console.log("tmpValue: ", tmpValue);
          // sourcePathKey, handlers, targetValue, eventData, onlyAction
          this.$emit(
            "formChange",
            this.schema.__pathKey,
            handlers,
            utils.deepCopy(tmpValue),
            eventData
          ); // 等到系统数据同步了再执行
        } else {
          this.$emit(
            "formChange",
            this.schema.__pathKey,
            null,
            null,
            eventData
          );
        }
      } else {
        if (this.needWatch()) {
          if (this.$data.isChanged) {
            this.$data.isChanged = true;
            this.$data.triggerList.push(eventName); //放入队列中，等formData改变
          } else {
            this.checkValue(tmpValue, eventName);
          }
        }

        if (handlers) {
          this.$emit(
            "formChange",
            this.schema.__pathKey,
            handlers,
            utils.deepCopy(tmpValue),
            eventData,
            true
          ); // 等到系统数据同步了再执行
        }
      }
    },

    checkValue(value, triggerMode) {
      // console.log("this.isInited", this.isInited);
      if (this.isInited) {
        var parseSources = {
          global: this.global,
          rootData: this.formData,
          index: this.schema.__index,
          idxChain: this.schema.__idxChain,
          rootSchema: formUtils.getRootSchema(this)
        };

        // 为什么要写这个，因为开发过程中，有些组件的默认值需要转化，导致会触发checkRules, 体验不好
        var checkedResult = formUtils.checkRules(
          this.schema.array ? this.schema.array.rules : this.schema.rules,
          value,
          triggerMode,
          parseSources
        );
        if (checkedResult === true) {
          this.schema.__invalidMsg = false;
        } else if (checkedResult !== false) {
          // 字符串，错误
          this.schema.__invalidMsg = checkedResult;
        } else {
          // 为false, 不是目标事件，不用理会
        }
      }
    },

    /**
     * sourcePathKey 是哪个组件触发的
     * eventData 事件本身的参数；如keyup事件携带的参数
     * onlyAction 是否仅单单执行actions
     */
    formChange(sourcePathKey, handlers, targetValue, eventData, onlyAction) {
      if (!onlyAction && this.schema.array) {
        if (this.schema.array.rules) {
          this.$data.isChanged = true;
          this.$data.triggerList = [constant.INPUT_EVENT];
        }
        if (this.schema.array.actions) {
          var arrayHandlers = formUtils.getHandlers(
            constant.INPUT_EVENT,
            this.schema.array.actions
          );
          if (arrayHandlers) {
            handlers = handlers
              ? handlers.concat(arrayHandlers)
              : arrayHandlers; // 合并，放在最后一起执行
          }
        }
      }
      this.$emit(
        "formChange",
        sourcePathKey,
        handlers,
        targetValue,
        eventData,
        onlyAction
      );
    },

    /**
     * 数组改变：添加、删除、移动
     * sourcePathKey 是哪个组件触发的
     * handlers 需要处理的input and change actions
     * eventData 事件本身的参数；具体看array-mixin.js
     */
    formArrayInput(sourcePathKey, handlers, targetValue, eventData) {
      // console.log("sourcePathKey, handlers, eventData", sourcePathKey, handlers, eventData);
      /* 因为数组改变，根据传统要发送input和change事件：为什么直接写成一个，因为数组内的组件input也算是input事件（也会作实时检查和actions） */
      this.$data.isChanged = true;
      this.$data.triggerList = [constant.INPUT_EVENT, constant.CHANGE_EVENT];

      this.$emit(
        "formChange",
        sourcePathKey,
        handlers,
        targetValue,
        eventData,
        false
      );
    },

    /**
     * sourcePathKey 是哪个tab容器触发
     * index 触发哪个
     */
    formClick(type, data) {
      // console.log("formClick: ", type, data);
      this.$emit("formClick", type, data); // 往上派发
    },

    setWatch() {
      if (!this.$data.unwatch) {
        this.$data.unwatch = this.$watch(
          "formData",
          () => {
            // console.log("formData: ", this.schema);
            if (this.$data.isChanged) {
              this.$data.isChanged = false;
              this.$data.triggerList.forEach(triggerMode => {
                var value = this.schema.value;
                if (this.schema.array) {
                  value = formUtils.getValue(this.schema);
                }
                this.checkValue(value, triggerMode);
              });
              this.$data.triggerList = [];
            }
          },
          {
            deep: false
          }
        );
      }
    }
  },

  watch: {
    schema: {
      handler(newVal) {
        if (utils.isObj(newVal) && Object.keys(newVal).length > 0) {
          // console.log("form-item.schema here...", this.schema);
          // 更新了UI，暂不用初始化
          this.$data.isChanged = false;
          this.$data.triggerList = [];
          this.__initUi();
        }
      },
      deep: false
    }
  }
};
</script>
