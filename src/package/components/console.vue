<template>
  <div class="console-box" :style="{ zIndex: boxZIndex }">
    <button class="console-btn" @click="clickHandler">Console</button>
    <div
      class="console-panel"
      v-if="showPanel"
      :style="{
        right: positions.right + 'px',
        top: positions.top + 'px',
        zIndex: positions.zIndex
      }"
    >
      <div class="console-header" @mousedown="startDragHandler">
        <h2 class="panel-title">esForm调试面板</h2>
      </div>
      <div class="console-close" @click="showPanel = false">Close</div>
      <div class="panel-body">
        <div class="question-box">
          <a
            href="https://chengaohe45.github.io/vue-easy-form-docs/dist/base/console.html"
            target="_blank"
            class="question"
            >如何打开面板?</a
          >
          <a
            href="https://chengaohe45.github.io/vue-easy-form-docs/dist/base/explain.html#根值"
            target="_blank"
            class="question"
            >什么是根数据?</a
          >
          <a
            href="https://chengaohe45.github.io/vue-easy-form-docs/dist/base/explain.html#表单值"
            target="_blank"
            class="question"
            >什么是表单数据?</a
          >
        </div>
        <h3 class="subtitle">根数据(rootData) => getValue取出</h3>
        <textarea class="value-box" readonly="readonly"
          >{{ toJson(rootData) }}
        </textarea>
        <h3 class="subtitle">表单数据(formValue) => getFormValue取出</h3>
        <textarea class="value-box" readonly="readonly"
          >{{ toJson(formValue) }}
        </textarea>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "../static/css/mixins.scss";
.console-box {
  position: absolute;
  left: 0px;
  top: 0px;

  overflow: hidden;

  .console-btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid #dcdfe6;
    color: #fff;
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
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 12px;
    // opacity: 0.5;

    &:hover {
      background: rgba(102, 177, 255, 0.4);
      color: #666;
      // opacity: 1;
      border-color: #79bbff;
    }
  }

  .console-panel {
    position: fixed;
    right: 20px;
    top: 20px;
    border: 1px solid #b3d8ff;
    border-radius: 5px;
    background: #fff;
    text-align: left;
    overflow: hidden;
    width: 400px;

    .console-header {
      background: #ecf5ff;
      // background: -webkit-linear-gradient(top, #409EFF, #ecf5ff);

      cursor: move;

      // @include display-center;

      .panel-title {
        cursor: move;

        margin: 0;
        padding: 0 0 0 10px;
        line-height: 40px;
        font-size: 16px;
        font-weight: bold;

        // @include flex-full;
      }

      * {
        cursor: "move";
      }
    }

    .console-close {
      position: absolute;
      top: 12px;
      right: 10px;
      color: #409eff;
      cursor: pointer;
      line-height: 18px;
      font-size: 14px;
      user-select: none;

      &:hover {
        color: #66b1ff;
        text-decoration: underline;
      }
    }

    .panel-body {
      margin: 0;
      padding: 0px 10px 10px 10px;

      .subtitle {
        margin: 6px 0 0 5px;
        padding: 0;
        line-height: 20px;
        font-size: 14px;
        font-weight: 600;
      }

      .question-box {
        margin-top: 10px;
      }

      .question {
        margin: 0 5px;
        text-decoration: none;
        color: #409eff;
        outline: none;
        padding: 0;
        line-height: 15px;
        font-size: 13px;
        font-weight: 500;

        &:hover {
          border-bottom: 1px solid #409eff;
        }
      }

      .value-box {
        border: 1px solid #dcdfe6;
        height: 150px;
        border-radius: 3px;
        padding: 5px;
        overflow: auto;
        width: 100%;
        min-width: 100%;
        max-width: 100%;
        outline: none;
        box-sizing: border-box;
        font-size: 13px;
        line-height: 20px;
      }
    }
  }
}
</style>

<script>
import esDrag from "../libs/drag.js";
import utils from "../libs/utils";

export default {
  data() {
    return {
      showPanel: false,

      boxZIndex: false,

      positions: {
        right: 2,
        top: 2,
        zIndex: 1
      }

      // _esStartPoint: {
      //   x,
      //   y
      // }
    };
  },

  created() {},

  mounted() {
    this.$data.boxZIndex = this.getMaxZIndex() + 1;
  },

  props: {
    rootData: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    },
    formValue: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    }
  },

  methods: {
    /**
     * 变为JSON输出，增强可读性
     * @param source 解析源
     * @param curTimes 解析了多少次了
     */
    toJson(source, curTimes = 1) {
      const MAX = 3; // 大于3次就不做变换了
      const CAN_REPLACE = curTimes <= MAX ? true : false;
      const UNDEFINED = curTimes < MAX ? utils.randStr(15, 20) : "undefined值";

      var undefinedObj = {},
        hasSameUndefined = false;

      var newSource = JSON.stringify(
        source,
        (key, value) => {
          if (key === UNDEFINED || value === UNDEFINED) {
            // 出现相同的字符串，说明UNDEFINED值不可用(只是存在理论上的可能，比当上联合国秘书长的概率还低)
            hasSameUndefined = true;
          } else if (value === undefined) {
            value = UNDEFINED;
            undefinedObj[key] = value;
          }
          return value;
        },
        2
      );

      // 不需要做那么漂亮，这种东西会影响性能的
      // newSource = newSource.replace(/"([^\\"]+?)":/g, "$1:");

      if (CAN_REPLACE) {
        if (!hasSameUndefined) {
          // 没有有相同的字符串，替换

          if (Object.keys(undefinedObj).length > 0) {
            // 需要替挽
            // undefined 代替
            // 因为数据是来自于开发者，这个基本可以控制字符串有UNDEFINED
            var undefinedReg = new RegExp('"' + UNDEFINED + '"', "g");
            newSource = newSource.replace(undefinedReg, "undefined");
          }

          return newSource;
        } else {
          //  有相同的字符串，重来一次
          newSource = null;
          var nextTime = curTimes + 1;
          return this.toJson(source, nextTime);
        }
      } else {
        // 直接输出；不做替换了；因为之前做过了MAX次了；理论就不会进入这里，进入这里只是备用做展示，对功能没有什么影响
        return newSource;
      }
    },

    clickHandler() {
      if (!this.$data.showPanel) {
        this.$data.positions.right = 2;
        this.$data.positions.top = 2;
        this.$data.positions.zIndex = this.getMaxZIndex() + 1;
      } else {
        // ...
      }

      this.$data.showPanel = !this.$data.showPanel;
    },

    startDragHandler(event) {
      this._esStartPoint = {
        right: this.$data.positions.right,
        top: this.$data.positions.top
      };
      esDrag(event, info => {
        if (info) {
          var right = this._esStartPoint.right - info.offsetX;
          var top = this._esStartPoint.top + info.offsetY;

          this.$data.positions.right = right;
          this.$data.positions.top = top;
        } else {
          this._esStartPoint = null;
        }
      });
    },

    getMaxZIndex() {
      // var childNodes = document.body.childNodes;
      var childNodes = document.all || document.querySelectorAll("*");
      var maxZIndex = 0;
      childNodes.forEach(node => {
        var tmpZIndex = this.getAttrValue(node, "z-index");
        maxZIndex = Math.max(maxZIndex, tmpZIndex);
      });
      return maxZIndex;
    },

    getAttrValue(element, attrName) {
      // console.log("element", element);
      var value = 0;
      if (element.nodeType == 1) {
        var valueStr = window
          .getComputedStyle(element)
          .getPropertyValue(attrName);
        // valueStr = "px";
        // console.log("element", valueStr);
        valueStr = valueStr + "";
        var reg = /^\d+$/i;
        var txtArr = valueStr.match(reg);
        if (txtArr && txtArr[0]) {
          value = Number(txtArr[0]);
        }
      }
      // console.log(valueStr, value);
      return value;
    }
  },

  beforeDestroy() {
    this._esStartPoint = null;
  }
};
</script>
