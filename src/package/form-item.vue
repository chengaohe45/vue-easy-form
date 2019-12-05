<template>
  <div class="es-form-item">
    <div
      v-if="needHeader"
      :class="['es-form-header', schema.ui ? 'es-form-' + schema.ui.type : '']"
    >
      <div
        v-if="schema.title"
        :class="['es-form-title', 'es-title-l' + schema.title.__level]"
      >
        <template v-if="!schema.title.name">
          {{ schema.title.text }}
        </template>
        <es-base v-else :config="schema.title"></es-base>
      </div>
      <div v-else class="es-form-title es-title-empty">&nbsp;</div>
      <div
        v-if="schema.ui && schema.ui.__hasToggle"
        class="es-more-btn"
        @click="toggleBody"
      >
        {{ schema.ui.showBody ? "隐藏" : "打开" }}
      </div>
      <div v-if="schema.help" class="es-form-help">
        <es-base :config="schema.help"></es-base>
      </div>
    </div>
    <div
      :class="[
        'es-form-body',
        schema.ui && schema.ui.hasBorder ? 'es-body-border' : ''
      ]"
      v-show="!schema.properties || schema.ui.showBody"
      :style="bodyStyle"
    >
      <!-- 非数组 -->
      <template v-if="!schema.array">
        <!-- 叶子节点: 说明：有生成表单时,预判断schema过程中，schema.component和schema.properties只能存在一个，不会同时存在，也就是说要能是叶子节点，要么不是 -->
        <div
          :class="[
            'es-form-component',
            schema.component.align
              ? 'es-form-component-' + schema.component.align
              : ''
          ]"
          v-if="schema.component"
        >
          <div
            :class="[
              'es-form-component-wrap',
              schema.component.flex
                ? 'es-form-wrap-' + schema.component.flex
                : ''
            ]"
          >
            <es-base
              :ref="schema.component.ref"
              :class="[
                schema.component.flex
                  ? 'es-form-component-' + schema.component.flex
                  : ''
              ]"
              :config="schema.component"
              v-model="schema.value"
              @trigger="triggerHandler"
            >
            </es-base>
          </div>
          <template v-if="schema.unit && !schema.__inGroups">
            <div v-if="schema.unit.name" class="es-form-unit">
              <es-base :config="schema.unit"></es-base>
            </div>
            <div v-else class="es-form-unit" v-show="schema.unit.text">
              {{ schema.unit.text }}
            </div>
          </template>
          <div
            v-if="schema.help && !schema.__inGroups && showHelpInBody"
            class="es-form-help"
          >
            <es-base :config="schema.help"></es-base>
          </div>
        </div>

        <!-- 是节点(非叶子schema.properties)下一级(子节点，只会影响子节点，孙子不会影响；有点类似于display:flex)为tabs布局：占位空间项在处理schema过程中去掉了 -->
        <component
          v-else-if="
            schema.properties && schema.layout && schema.layout.name === 'tabs'
          "
          :is="'tabs'"
          :schema="schema"
        >
          <template
            v-for="(fieldSchema, fieldName) in schema.properties"
            :slot="fieldName"
          >
            <form-item
              :ref="!fieldSchema.hidden ? '__refTabs__' : undefined"
              :schema="fieldSchema"
              :key="fieldName"
            ></form-item>
          </template>
        </component>

        <!-- 有properties，有下一级节点: slot="fieldName"是占位空间理论上不做slot, 但为了性能，不判断了 -->
        <component
          v-else-if="schema.properties"
          :is="'es-object'"
          :schema="schema"
        >
          <template
            v-for="(fieldSchema, fieldName) in schema.properties"
            :slot="fieldName"
          >
            <form-item
              :ref="!fieldSchema.hidden ? '__refObject__' : undefined"
              :schema="fieldSchema"
              :key="fieldName"
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
          @input="formArrayInput"
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
            ></form-item>
          </template>

          <!-- 数组-叶子(若有) -->
          <div
            v-if="schema.component"
            class="es-form-component-list"
            slot-scope="props"
          >
            <!-- 必须是v-for,要不然ref取不出数组 -->
            <form-item
              v-for="key in 1"
              :key="key"
              ref="__refArrarRow__"
              :schema="props.schema"
            ></form-item>
          </div>
        </component>

        <!-- array-legend 类型：可接受非叶子或叶子，此节点(非叶子)的子节点是tabs也无问题 -->
        <component
          v-if="schema.array.name == 'array-legend'"
          :is="'array-legend'"
          :schema="schema"
          @input="formArrayInput"
        >
          <!-- 数组-非叶子(若有) -->
          <template
            v-for="(fieldSchema, fieldName) in schema.properties"
            :slot="fieldName"
            slot-scope="props"
          >
            <form-item
              ref="__refArrarLegend__"
              :schema="props.schema"
              :key="fieldName"
            ></form-item>
          </template>

          <!-- 数组-叶子(若有) -->
          <div
            v-if="schema.component"
            class="es-form-component-list"
            slot-scope="props"
          >
            <!-- 必须是v-for,要不然ref取不出数组 -->
            <form-item
              v-for="key in 1"
              :key="key"
              ref="__refArrarLegend__"
              :schema="props.schema"
            ></form-item>
          </div>
        </component>

        <!-- array-card 类型：只接受叶子，也不接受tabs -->
        <component
          v-if="schema.array.name == 'array-card'"
          :is="'array-card'"
          :schema="schema"
          @input="formArrayInput"
        >
          <!-- 数组-非叶子(不会有，已经过滤掉了) -->

          <!-- 数组-叶子(若有) -->
          <div
            v-if="schema.component"
            class="es-form-component-list"
            slot-scope="props"
          >
            <!-- 必须是v-for,要不然ref取不出数组 -->
            <form-item
              v-for="key in 1"
              :key="key"
              ref="__refArrarCard__"
              :schema="props.schema"
            ></form-item>
          </div>
        </component>

        <!-- array table 类型: 只接受非叶子(有chema.properties),因为无法叶子无法有这种形式; 子节点是tabs也将失效 -->
        <component
          v-else-if="schema.array.name == 'array-table'"
          :is="'array-table'"
          :schema="schema"
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
              :showHelpInBody="false"
            ></form-item>
          </template>

          <!-- 数组-叶子(不会有，已经过滤掉了) -->
        </component>

        <!-- array tabs 类型：可接受非叶子或叶子，此节点(非叶子)的子节点是tabs也无问题 -->
        <component
          v-else-if="schema.array && schema.array.name == 'array-tabs'"
          :is="'array-tabs'"
          :schema="schema"
          @input="formArrayInput"
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
            ></form-item>
          </template>

          <!-- 数组-叶子(若有) -->
          <div
            v-if="schema.component"
            class="es-form-component-list"
            slot-scope="props"
          >
            <!-- 必须是v-for,要不然ref取不出数组 -->
            <form-item
              v-for="key in 1"
              :key="key"
              ref="__refArrarTabs__"
              :schema="props.schema"
            ></form-item>
          </div>
        </component>
      </template>

      <!-- 验证错误信息 -->
      <div v-show="schema.__invalidMsg" class="es-form-error">
        {{ schema.__invalidMsg }}
      </div>

      <!-- 描述信息，可以html -->
      <div v-if="schema.desc" class="es-form-desc">
        <es-base v-if="schema.desc.name" :config="schema.desc"></es-base>
        <template v-else>
          {{ schema.desc.text }}
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "./static/css/mixins.scss";

.es-form-item {
  @include flex-full;
  overflow: hidden;

  .es-form-header {
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
      font-weight: 400;
      font-size: 24px - 2 * ($i - 1);
      line-height: 26px - 2 * ($i - 1);
    }
  }

  .es-form-header.es-form-bg {
    background: $g_bgColor2;
    border-top-left-radius: $g_borderRadius;
    border-top-right-radius: $g_borderRadius;
    padding: 5px 0 3px 10px;
  }

  .es-form-header.es-form-block {
    padding: 1px 0 1px 10px;
    border-left: 4px solid #909399;
  }

  .es-form-header.es-form-bg-block {
    background: $g_bgColor2;
    border-top-left-radius: $g_borderRadius;
    border-top-right-radius: $g_borderRadius;
    padding: 5px 0 3px 10px;
    border-left: 4px solid #909399;
  }

  .es-form-body.es-body-border {
    border: 1px solid $g_borderColor;
    border-radius: $g_borderRadius;
  }

  .es-form-header + .es-body-border {
    margin-top: 10px;
  }

  .es-form-header.es-form-bg + .es-body-border,
  .es-form-header.es-form-bg-block + .es-body-border {
    margin-top: 0px;
    border-top: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .es-form-title {
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

  .es-form-component-list {
    @include display-flex;
    @include direction-h;
    justify-content: flex-start;
    align-items: center;
  }

  .es-form-component {
    @include display-flex;
    @include direction-h;
    justify-content: flex-start;
    align-items: center;
  }

  .es-form-component-left {
    justify-content: flex-start !important;
  }

  .es-form-component-center {
    justify-content: center !important;
  }

  .es-form-component-right {
    justify-content: flex-end !important;
  }

  .es-form-label-box {
    @include flex-fixed;
    @include inline-center;
  }

  .es-form-component-full {
    @include flex-full;
    width: auto;
    // text-align: center;
    white-space: nowrap;
  }

  .es-form-component-self {
    @include flex-fixed;
    width: auto;
    text-align: center;
    white-space: nowrap;
  }

  .es-form-component-wrap {
    @include flex-full;
    overflow: hidden;
  }

  .es-form-component-wrap.es-form-wrap-full {
    @include display-flex;
    @include flex-full;
    width: auto;
    // text-align: center;
    white-space: nowrap;
  }

  .es-form-component-wrap.es-form-wrap-self {
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
    margin: 4px 0 0px 3px;
    text-align: left;
    color: #b3b5b9;
    font-size: 13px;
    line-height: 16px;
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
import arrayLegend from "./layout/array-legend";
import arrayCard from "./layout/array-card";
import arrayTable from "./layout/array-table";
import arrayTabs from "./layout/array-tabs";
import tabs from "./layout/tabs";
import itemMixin from "./mixins/item-mixin";
import utils from "./libs/utils";
import constant from "./libs/constant";
import global from "./libs/global";
import esBase from "./base";

export default {
  name: "form-item", // 声明name可以嵌套自身
  mixins: [itemMixin],

  data() {
    return {
      // unwatch: false,
      // showBody: true,
      // isChanged: false,
      // triggerList: []
    };
  },

  components: {
    esBase,
    esObject,
    arrayRow,
    arrayTable,
    arrayTabs,
    arrayCard,
    arrayLegend,
    tabs
  },

  created() {},

  computed: {
    needHeader() {
      return this.schema.properties &&
        (this.schema.title || this.schema.ui.__hasToggle || this.schema.help)
        ? true
        : false; // 是否有头部
    },

    bodyStyle() {
      var style = null;
      if (this.needHeader) {
        // 是否有头部
        //是properties且有头部
        var hasBorder = this.schema.ui.hasBorder
          ? this.schema.ui.hasBorder
          : false;
        if (hasBorder) {
          style = {
            padding: this.schema.ui.padding
              ? this.schema.ui.padding
              : Math.min(this.schema.ui.rowSpace, 10) + "px"
          }; //有边框时的样式
        } else {
          style = {
            padding: this.schema.ui.padding
              ? this.schema.ui.padding
              : Math.min(this.schema.ui.rowSpace, 10) + "px 0 0 0"
          }; //无边框时的样式
        }
      } else {
        style = null;
      }
      return style;
    }
  },

  methods: {
    /* 下划线一杠代表对内使用 */
    _getType() {
      return this.schema.array ? constant.UI_ARRAY : constant.UI_ITEM;
    },

    /* 下划线一杠代表对内使用 */
    _getSchema() {
      return this.schema;
    },

    getRef(name) {
      var ignoreKeys = [];
      var info = this.__getRef(name, ignoreKeys);
      var ref = info && info.target ? info.target : null;
      // console.log("ignoreKeys: ", ignoreKeys);
      ignoreKeys = null;
      return ref;
    },

    __getRef(name, ignoreKeys) {
      var targetInfo;
      if (this.schema.component && !this.schema.array) {
        // 是叶子节点，直接取出
        var refTarget = this.$refs[name];
        if (refTarget) {
          targetInfo = {
            target: refTarget.$refs.__comTarget__,
            sourceKey: this.schema.__pathKey.replace(/\[\d+\]/g, "[i]")
          };
        } else {
          targetInfo = null;
        }
      } else {
        targetInfo = this.__getLastRefs(name, ignoreKeys);
      }
      return targetInfo;
    },

    /* 取出最后的，跟vue ref保持一致；也就是后面的会代表前面的 */
    __getLastRefs(name, ignoreKeys) {
      var __objectRef__ = "__refObject__";
      var __tabsRef__ = "__refTabs__";
      var sysRefIds = [
        __objectRef__,
        __tabsRef__,
        "__refArrarCard__",
        "__refArrarRow__",
        "__refArrarLegend__",
        "__refArrarTable__",
        "__refArrarTabs__"
      ];

      var refTargets = null;
      for (var key in this.$refs) {
        // 这样扫描是为了按顺序正确取出
        if (sysRefIds.includes(key)) {
          var tmpTargets = this.__getTargetRefs(key, name, ignoreKeys);
          if (tmpTargets) {
            refTargets = tmpTargets; // 后面的代替前面的，跟原生vue ref保持一致
          }
        } else {
          // 不是系统所需要的，不需要理会；不过一般不会运行到这
        }
      }
      // console.log(">>>>>>>>>>>>>>>>>end\n\n\n");
      return refTargets;
    },

    __getTargetRefs(refName, name, ignoreKeys) {
      var __objectRef__ = "__refObject__";
      var __tabsRef__ = "__refTabs__";
      var curRefObj,
        nextTargetInfo,
        newTargetInfo = null;
      curRefObj = this.$refs[refName];
      // console.log("curRefObj: ", curRefObj);
      if (curRefObj) {
        curRefObj.forEach(item => {
          nextTargetInfo = item.__getRef(name, ignoreKeys);
          if (nextTargetInfo) {
            newTargetInfo = newTargetInfo ? newTargetInfo : {};

            if (!ignoreKeys.includes(nextTargetInfo.sourceKey)) {
              // 不是忽略的pathkey

              if (refName === __objectRef__ || refName === __tabsRef__) {
                // 不是数组，取最后一个
                if (
                  newTargetInfo.sourceKey &&
                  !ignoreKeys.includes(newTargetInfo.sourceKey)
                ) {
                  ignoreKeys.push(newTargetInfo.sourceKey);
                }
                newTargetInfo = nextTargetInfo;
              } else {
                // 是数组，合并成数组
                if (newTargetInfo.sourceKey == nextTargetInfo.sourceKey) {
                  // 一样的路径，说明是目标对象
                  var curTarget = newTargetInfo.target
                    ? newTargetInfo.target
                    : [];
                  curTarget.push(nextTargetInfo.target);
                  newTargetInfo.target = curTarget;
                } else {
                  if (
                    newTargetInfo.sourceKey &&
                    !ignoreKeys.includes(newTargetInfo.sourceKey)
                  ) {
                    ignoreKeys.push(newTargetInfo.sourceKey);
                  }
                  newTargetInfo = {
                    target: [nextTargetInfo.target],
                    sourceKey: nextTargetInfo.sourceKey
                  };
                }
              }
            } else {
              // 不用理会，之前已经出现过
            }
          }
        });
      }
      return newTargetInfo && newTargetInfo.target ? newTargetInfo : null;
    },

    toggleBody() {
      var form = this.__getForm();
      form._toggleUi("toggle", { key: this.schema.__pathKey });
    },

    // 只有组件会触发
    triggerHandler(eventName, eventData, target) {
      var checkSchema = [this.schema];
      var eventNames = [eventName];
      var targetValue = this.schema.value;

      if (
        this.schema.isTrim &&
        utils.isStr(targetValue) &&
        (eventName == global.trimEvent ||
          (constant.FORM_INPUTS.includes(this.schema.component.name) &&
            eventName == constant.INPUT_CHANGE))
      ) {
        // global.trimEvent暂不会是constant.INPUT_EVENT事件，因为初始化时就不给设置为此值
        var tmpValue = targetValue.trim();
        if (tmpValue !== targetValue) {
          this.schema.value = tmpValue;
          targetValue = tmpValue;
          eventNames.push(constant.INPUT_EVENT); // 值有所改变，同时input一下
        }
      }

      var options = {
        value: targetValue,
        event: eventData,
        pathKey: this.schema.__pathKey,
        index: this.schema.__index,
        idxChain: this.schema.__idxChain,
        target: target
      };

      var form = this.__getForm();
      form._syncUi(checkSchema, eventNames, options);
    },

    /**
     * 数组改变：添加、删除、移动
     * handlers 需要处理的input and change actions
     * eventData 事件本身的参数；具体看array-mixin.js
     */
    formArrayInput(targetValue, eventData) {
      var checkSchema = [this.schema];
      var eventNames = [constant.INPUT_EVENT, constant.CHANGE_EVENT];

      var options = {
        value: targetValue,
        event: eventData,
        pathKey: this.schema.__pathKey,
        index: this.schema.__index,
        idxChain: this.schema.__idxChain,
        target: null
      };

      var form = this.__getForm();
      form._syncUi(checkSchema, eventNames, options); // 最外层的表单层同步所有的ui及数位
    },

    __getForm() {
      var formItem = this.$parent;
      while (formItem) {
        var type = formItem._getType ? formItem._getType() : "";
        if (type == constant.UI_FORM) {
          return formItem; // 到达表单层
        } else if (type == constant.UI_ARRAY) {
          // checkSchema.push(formItem._getSchema());
        } else {
          // ... 往上派
        }
        formItem = formItem.$parent;
      }
    }
  },

  watch: {}
};
</script>
