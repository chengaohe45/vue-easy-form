<template>
  <div class="es-help-box">
    <a v-if="href" :href="href" target="_blank" class="help-btn">
      <i ref="icon" class="es-help-icon" @mouseenter="enter" @mouseleave="leave"
        >i</i
      >
    </a>
    <i
      v-else
      ref="icon"
      class="es-help-icon"
      @mouseenter="enter"
      @mouseleave="leave"
      >i</i
    >
    <transition
      name="es-help-fade"
      mode="out-in"
      appear
      @after-leave="popAnimateLeave"
    >
      <div
        ref="pop"
        v-show="showPop && content"
        @mouseenter="popEnter"
        @mouseleave="popLeave"
        class="es-help-tip-box"
        :style="{
          left: popPosition.left + 'px',
          top: popPosition.top + 'px',
          maxWidth: maxWidth + 'px',
          zIndex: popPosition.zindex + ''
        }"
      >
        <div class="es-content-box" v-html="content"></div>
        <div
          v-if="popArrow.direction"
          :class="'help-arrow-' + popArrow.direction"
          :style="{ left: popArrow.left + 'px', top: popArrow.top + 'px' }"
        ></div>
      </div>
    </transition>
  </div>
</template>

<script>
import popUtils from "../libs/pop-utils";

export default {
  /* ====================== 生命周期 ====================== */

  created() {
    this.$data.scrollWinHandler = () => {
      this.adjustPop();
    };
  },

  /* ====================== 数据绑定 ====================== */

  data() {
    return {
      showPop: false,
      scrollWinHandler: null,
      popDom: null,

      popLeaveDelay: 200, // pop延迟消失的时间（ms）
      popTimerId: null,

      popPosition: {
        left: 0,
        top: 0,
        zindex: 1
      },

      popArrow: {
        direction: "",
        left: 0,
        top: 0
      },

      popInfo: {
        popBorderRadius: 4,
        viewSpace: 2, // 距离判断边预留的空间
        popArrowWH: 6, // 箭头的宽度和高度
        betweenSpace: 3 // pop与icon的空间
      }
    };
  },

  props: {
    maxWidth: {
      type: Number,
      required: false,
      default: 300
    },

    content: {
      // 内容区
      type: String,
      required: false,
      default: ""
    },

    href: {
      // 若有些值，说是图标是一条链接
      type: String,
      required: false,
      default: ""
    },

    placement: {
      // pop的位置，当设置这个时，会优先考虑这个方向
      type: String,
      required: false,
      default: "" //value: top right bottom left
    }
  },

  watch: {},

  /* ====================== 事件处理 ====================== */

  methods: {
    enter() {
      if (this.content) {
        if (!this.$data.showPop) {
          // 正常进来
          this.$data.showPop = true;
          this.addPopDom();
          this.setScrollListen();
          this.$data.popPosition.zindex = popUtils.getMaxZIndex() + 1;
          this.$nextTick(() => {
            this.adjustPop();
          });
        } else {
          // 从pop进入来
          this.cancelPopTimer();
        }
      }
    },

    leave() {
      if (this.content) {
        this.setCloseTimer();
      }
    },

    popEnter() {
      this.cancelPopTimer();
    },

    popLeave() {
      this.setCloseTimer();
    },

    popAnimateLeave() {
      // console.log("popAnimateLeave...");
      this.cancelScrollListen();
      this.$data.popPosition = {
        //这样放在最左，可以保持其长度最大化
        left: 0,
        top: 0
      };
    },

    addPopDom() {
      if (!this.$data.popDom) {
        this.$data.popDom = this.$refs.pop;
        document.body.appendChild(this.$data.popDom);
      }
    },

    removePopDom() {
      if (this.$data.popDom) {
        document.body.removeChild(this.$data.popDom);
        this.$data.popDom = null;
      }
    },

    setScrollListen() {
      window.addEventListener("scroll", this.$data.scrollWinHandler, true);
    },
    cancelScrollListen() {
      window.removeEventListener("scroll", this.$data.scrollWinHandler, true);
    },

    closePop() {
      this.cancelPopTimer();
      this.$data.showPop = false;
    },

    setCloseTimer() {
      this.$data.popTimerId = setTimeout(() => {
        this.$data.popTimerId = null;
        this.closePop();
      }, this.$data.popLeaveDelay);
    },

    cancelPopTimer() {
      if (this.$data.popTimerId !== null) {
        clearTimeout(this.$data.popTimerId);
        this.$data.popTimerId = null;
      }
    },

    adjustPop() {
      var pop = this.$refs["pop"];
      var icon = this.$refs["icon"];
      var popRect = pop.getBoundingClientRect();
      var iconRect = icon.getBoundingClientRect();

      var uiInfo = popUtils.getPopUiInfo(
        popRect,
        iconRect,
        this.$data.popInfo,
        this.placement
      );
      if (uiInfo) {
        this.$data.popPosition = { left: uiInfo.popLeft, top: uiInfo.popTop };
        this.$data.popArrow = {
          direction: uiInfo.arrowDirection,
          left: uiInfo.arrowLeft,
          top: uiInfo.arrowTop
        };
      } else {
        this.closePop();
      }
    }
  },

  destroyed() {
    if (this.$data.scrollWinHandler) {
      this.cancelScrollListen();
    }
    this.$data.scrollWinHandler = null;

    this.removePopDom();
  }
};
</script>

<style lang="scss">
@import "../static/css/mixins.scss";
$popBorderRadius: 4px;
$popBorderWidth: 6px;
$popBorderColor: #d6d7da;
$popBgColor: #303133;

.es-help-box {
  display: block;
  margin: 0 auto;
  padding: 0;
  width: 16px;
  height: 16px;

  .es-help-icon {
    margin: 0 auto;
    display: block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    border-radius: 50%;
    background: #303133;
    color: #fff;
    text-align: center;
    font-size: 12px;
    font-family: "Times New Roman", Times, Georgia, Serif;
    user-select: none;
    outline: none;

    &:hover {
      // color: #409eff;
      background: #409eff;
    }
  }

  .help-btn {
    user-select: none;
    outline: none;
    text-decoration: none;
  }

  // .help-btn:hover .es-help-icon {
  //   // color: #409eff;
  //   background: #409eff;
  // }
}

.es-help-tip-box {
  display: block;
  // max-width: 300px;
  min-height: 16px;
  // width: 100%;
  // min-width: 100px;
  position: absolute;
  top: 0;
  left: 0;
  // top: 30px;
  // left: -500px;
  // right: 0;

  margin: auto auto;

  color: #fff;
  font-size: 12px;
  line-height: 16px;
  z-index: 10001;

  // white-space: nowrap;
  // word-wrap:break-word;

  .es-content-box {
    background: $popBgColor;
    border-radius: $popBorderRadius;
    border: 1px solid $popBorderColor;
    box-sizing: border-box;
    padding: 9px;
    text-align: left;
  }

  .help-arrow-top {
    @include arrow($popBorderColor, $popBorderWidth, "top", $popBgColor);
    // display: none;
    position: absolute;
    // left: 50%;
    // top: -$popBorderWidth - 1;
  }

  .help-arrow-right {
    @include arrow($popBorderColor, $popBorderWidth, "right", $popBgColor);
    // display: none;
    position: absolute;
    left: auto;
    // right: -$popBorderWidth - 1;
    // top: 50%;
  }

  .help-arrow-bottom {
    @include arrow($popBorderColor, $popBorderWidth, "bottom", $popBgColor);
    // display: none;
    position: absolute;
    // left: 50%;
    // bottom: -$popBorderWidth;
  }

  .help-arrow-left {
    @include arrow($popBorderColor, $popBorderWidth, "left", $popBgColor);
    // display: none;
    position: absolute;
    // left: -$popBorderWidth - 1;
    // top: 50%;
  }
}

.es-help-fade-enter-active,
.es-help-fade-leave-active {
  transition: opacity 0.4s ease;
}
.es-help-fade-enter,
.es-help-fade-leave-to {
  opacity: 0;
}
</style>
