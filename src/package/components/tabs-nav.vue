<template>
  <div :class="boxClass">
    <div ref="scrollBox" class="es-tabs-scroll-box">
      <div
        :class="['es-tabs-scroll-wrap', showToggle ? 'es-has-toggle' : '']"
        :style="{ padding: showToggle ? '0 ' + toggleZoneWidth + 'px' : '0' }"
      >
        <div :class="['es-tabs-nav-wrap', hasAdd ? 'es-has-add' : '']">
          <div class="es-tabs-nav-scroll">
            <ul
              ref="scrollWrap"
              class="es-tabs-nav"
              :style="{
                transform: 'translateX(' + navX + 'px)',
                '-webkit-transform': 'translateX(' + navX + 'px)'
              }"
            >
              <slot></slot>
            </ul>
          </div>
          <es-tabs-btn
            v-if="hasAdd"
            class="es-tabs-add es-btn"
            @click="addItemHandler"
            :disabled="canAdd"
          ></es-tabs-btn>
        </div>
        <span class="es-tabs-prev-btn" @click="clickPrevHandler">
          <span class="es-arrow"></span>
        </span>
        <span class="es-tabs-next-btn" @click="clickNextHandler">
          <span class="es-arrow"></span>
        </span>
      </div>
    </div>
    <div class="help-box">
      <slot name="help"></slot>
    </div>
  </div>
</template>

<script>
import esTabsNavItem from "./tabs-nav-item";
import esTabsBtn from "./tabs-btn.vue";

export default {
  // mixins: [itemMixin, arrayMixins],
  components: {
    // esObject,
    esTabsNavItem,
    esTabsBtn
  },

  props: {
    hasAdd: {
      type: Boolean,
      required: false,
      default: false
    },
    canAdd: {
      type: Boolean,
      required: false,
      default: false
    },
    type: {
      type: [String, Boolean],
      required: false,
      default: ""
    }
  },

  computed: {
    boxClass() {
      var tClass = ["es-tabs-nav-box"];
      switch (this.type) {
        case "bg":
          tClass.push("es-type-border-card");
          break;
        case "line":
          tClass.push("es-type-line");
          break;
        case "card":
        default:
          tClass.push("es-type-card");
          break;
      }
      return tClass;
    }
  },

  data() {
    return {
      // activeIndex: 0, // 只能设置为0

      showToggle: false,
      navX: 0,
      toggleZoneWidth: 20, // 当出现左右箭头时，左右区域的宽度

      observer: null,
      lockObserver: false,
      oldRecord: {
        // 记录下旧的宽高数据，避免重复触发回调函数
        mainWidth: 0,
        navWidth: 0
      }
    };
  },
  methods: {
    addItemHandler() {
      this.$data.fromAdd = true;
      this.$emit("addItem");
    },

    startListener() {
      // console.log("startObserver...");

      window.addEventListener("resize", this.$data.resizeWinHandler, true);

      let MutationObserver =
        window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;

      this.observer = new MutationObserver(mutationsList => {
        // console.log("mutationsList: ", mutationsList);
        var canDo = true;
        if (this.$data.lockObserver) {
          canDo = false;
        } else if (mutationsList && mutationsList.length == 1) {
          var mutation = mutationsList[0];
          // console.log("mutationsList: ", mutation.target.className=="es-tabs-nav");
          if (
            mutation.target.className == "es-tabs-nav" &&
            mutation.type == "attributes" &&
            mutation.attributeName == "style"
          ) {
            canDo = false;
          }
        }
        if (canDo) {
          this.observerHandler(0);
        }
      });
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });
    },

    /**
     * offset = -1 来自于clickPrevHandler
     * offset = 0 来自于MutationObserver或window resize
     * offset = 1 来自于clickNextHandler
     */
    observerHandler(offset = 0) {
      console.log("Math.random(): ", offset);

      var mainWidth = this.getAttrValue(this.$data.mainScrollBox, "width");
      var navWidth = this.getAttrValue(this.$data.navBox, "width");

      // console.log(mainWidth, navWidth);
      if (
        offset == 0 &&
        mainWidth === this.oldRecord.mainWidth &&
        navWidth === this.oldRecord.navWidth
      ) {
        // 来自MutationObserver or window.resize变化，但节点尺寸不变，不理会
        this.$data.fromAdd = false;
        return false; // 与之前的一样，不用做什么
      }

      var addBtnZoneWidth = this.getAttrValue(
        this.$data.navWrap,
        "padding-right"
      );
      var borderWidth = 0; // 0 是父容器左右的边框
      var needTotalWidth = navWidth + borderWidth + addBtnZoneWidth;
      var twoToggleWidth = 0;

      var newNavX = false;

      if (mainWidth < needTotalWidth) {
        // 会出现切换按钮
        this.$data.showToggle = true;
        twoToggleWidth = this.$data.toggleZoneWidth * 2;

        var minNavX;
        minNavX = Math.floor(
          mainWidth - borderWidth - addBtnZoneWidth - navWidth - twoToggleWidth
        ); // 为什么写这个Math.floor，因为有些机器是会有小数的，所以取小一点才能显示全部

        if (this.$data.fromAdd) {
          // 来自点击添加
          if (newNavX > 0) {
            minNavX = 0;
          }
          newNavX = minNavX;
        } else {
          // 来自删除或内容改动等
          if (offset == 0) {
            if (this.$data.navX < minNavX) {
              // 原内容偏移了左边，靠右
              newNavX = minNavX;
            } else {
              // 保持内容不变
            }
          } else {
            var offsetWidth =
              mainWidth - borderWidth - addBtnZoneWidth - twoToggleWidth; // 偏移量，也就是一个导航的宽度
            if (offset < 0) {
              newNavX = this.$data.navX + offsetWidth;
            } else {
              newNavX = this.$data.navX - offsetWidth;
            }

            if (newNavX > 0) {
              newNavX = 0;
            } else if (newNavX < minNavX) {
              // 原内容偏移了左边，靠右
              newNavX = minNavX;
            }
            // this.$data.navX = newNavX;
          }
        }
      } else {
        if (this.$data.showToggle != false) {
          this.$data.showToggle = false;
        }
        // 菜单置0放在最左
        if (this.$data.navX != 0) {
          newNavX = 0;
        }
      }

      this.oldRecord = { mainWidth, navWidth };
      this.$data.fromAdd = false;
      if (newNavX !== false) {
        this.$data.lockObserver = true;
        this.$nextTick(() => {
          console.log("lockObserver", false);
          this.$data.lockObserver = false;
          this.$data.navX = newNavX;
          // requestAnimationFrame(() => {
          //   this.$data.lockObserver = false;
          //   this.$data.navX = newNavX;
          // });
        });
      }
    },

    stopListener() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer.takeRecords();
        this.observer = null;
      }

      if (this.$data.resizeWinHandler) {
        window.removeEventListener("resize", this.$data.resizeWinHandler, true);
        this.$data.resizeWinHandler = null;
      }

      if (this.$data.throttleTimer) {
        clearTimeout(this.$data.throttleTimer);
        this.$data.throttleTimer = null;
      }
    },

    clickPrevHandler() {
      if (this.$data.showToggle) {
        this.observerHandler(-1); // 向左偏移
      }
    },

    clickNextHandler() {
      if (this.$data.showToggle) {
        this.observerHandler(1); // 向右偏移
      }
    },

    getAttrValue(element, attrName) {
      // console.log("element", element);
      var valueStr = window
        .getComputedStyle(element)
        .getPropertyValue(attrName ? attrName : "width");
      // valueStr = "px";
      // console.log("element", valueStr);
      var reg = /^(\d*(\.\d+)?)\s*px$/i;
      var txtArr = valueStr.match(reg);
      var value = 0;
      if (txtArr && txtArr[1]) {
        value = Number(txtArr[1]);
      }
      // console.log(valueStr, value);
      return value;
    }
  },

  mounted() {
    // 初始化页面数据
    let navBox = this.$refs.scrollWrap;
    let mainScrollBox = this.$refs.scrollBox;
    // 这个没有涉及到界面，所以不在data里
    this.$data.navBox = navBox;
    this.$data.navWrap = navBox.parentNode.parentNode;
    this.$data.mainScrollBox = mainScrollBox;
    this.$data.fromAdd = false;
    this.$data.throttleTimer = null;
    // window resize
    this.$data.resizeWinHandler = () => {
      // console.log("resizeWinHandler out...");
      var throttleInterval = 50;
      if (!this.$data.throttleTimer)
        this.$data.throttleTimer = setTimeout(() => {
          // console.log("resizeWinHandler in...");
          this.$data.throttleTimer = null;
          this.observerHandler(0);
        }, throttleInterval);
    };

    // 启用监听
    this.startListener();

    this.observerHandler();
  },

  beforeDestroy() {
    this.stopListener();
    this.$data.navBox = null;
    this.$data.navWrap = null;
    this.$data.mainScrollBox = null;
    this.$data.fromAdd = false;
  }
};
</script>

<style lang="scss">
@import "../static/css/mixins.scss";

// $g_borderColor: #dcdfe6;
$styleHeight: 40px;

$addBtnZoneWidth: 28px;
$addBtnWidth: 18px;
$addBtnLineWidth: $addBtnWidth - 8;
$addBtnLineHeight: 2px;
$addBtnColor: #7b808c;

$closeBoxWidth: 16px;
$closeBtnWidth: 13px;
$closeBtnLineWidth: $closeBtnWidth - 4;
$closeBtnLineHeight: 1px;

$mormalBtnColor: #409eff;

$navItemPadding: 19px;

$activeBtnColor: #409eff;
$btnDisableColor: #d5d7dc;

$popBorderWidth: 4px;
$popBorderColor: #d6d9de;
$popBgColor: #fbfbfb;

$btnHoverColor: #fff;
$btnHoverBgColor: #c0c4cc;

$activeBgColor: #fff;

@mixin mixin-tabs-btn {
  margin: 0;
  padding: 0px;
  width: $closeBtnWidth;
  height: $closeBtnWidth;
  line-height: $addBtnWidth - 2;
  border: none;
  box-sizing: border-box;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  background-color: $popBgColor;

  &:not(.disabled):hover {
    background: $btnHoverBgColor !important;
  }
}

.es-tabs-nav-box {
  position: relative;
  margin: 0 0 0 0;
  padding: 0;
  border-bottom: 1px solid $g_borderColor;
  box-sizing: border-box;
  height: $styleHeight;
  @include display-flex;

  .es-tabs-scroll-box {
    margin: 0;
    padding: 0;
    margin-bottom: -1px;
    @include clear;
    overflow: hidden;
    @include flex-full;
  }

  .help-box {
    @include flex-fixed;
    @include display-center;
    overflow: hidden;
  }

  .es-tabs-scroll-wrap {
    position: relative;
    margin: 0;
    padding: 0;
    height: $styleHeight;
    max-width: 100%;
  }

  .es-tabs-prev-btn {
    display: none;
    position: absolute;
    height: $styleHeight - 4;
    border-radius: 3px;
    padding: 0 3px;
    left: 3px;
    top: 1px;
    cursor: pointer;

    .es-arrow {
      @include arrow($addBtnColor, $popBorderWidth, "left", $popBgColor);
    }

    &:not(.disabled):hover {
      background: #eee;
    }

    &:not(.disabled):hover .es-arrow {
      border-right-color: $mormalBtnColor;
    }

    &:not(.disabled):hover .es-arrow::before {
      border-right-color: #eee;
    }
  }

  .es-tabs-prev-btn.disabled .es-arrow {
    border-right-color: $btnDisableColor;
    cursor: not-allowed;
  }

  .es-tabs-next-btn {
    display: none;
    position: absolute;
    height: $styleHeight - 4;
    border-radius: 3px;
    padding: 0 3px;
    right: 3px;
    top: 2px;
    cursor: pointer;

    .es-arrow {
      @include arrow($addBtnColor, $popBorderWidth, "right", $popBgColor);
    }

    &:not(.disabled):hover {
      background: #eee;
    }

    &:not(.disabled):hover .es-arrow {
      border-left-color: $mormalBtnColor;
    }

    &:not(.disabled):hover .es-arrow::before {
      border-left-color: #eee;
    }
  }

  .es-tabs-next-btn.disabled .es-arrow {
    border-left-color: $btnDisableColor;
    cursor: not-allowed;
  }

  // .es-tabs-scroll-wrap.es-has-toggle {
  //   padding: 0 20px;
  // }

  .es-tabs-scroll-wrap.es-has-toggle .es-tabs-prev-btn {
    @include display-center;
  }

  .es-tabs-scroll-wrap.es-has-toggle .es-tabs-next-btn {
    @include display-center;
  }

  .es-tabs-nav-wrap {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    float: left;
    height: $styleHeight;

    max-width: 100%;
    position: relative;
  }

  .es-tabs-nav-wrap.es-has-add {
    padding-right: $addBtnZoneWidth;
  }

  .es-tabs-nav-scroll {
    position: relative;
    width: 100%;
    overflow: hidden;
    // @include clear;
    box-sizing: border-box;
    border-bottom: none;
    height: $styleHeight;
  }

  .es-tabs-nav {
    float: left;
    margin: 0 0 0 0;
    padding: 0;
    list-style: none;
    white-space: nowrap;
    // @include display-flex;

    transition: transform 0.3s;
    // transition-delay: 0ms;
    position: relative;
    z-index: 2;

    box-sizing: border-box;

    li {
      // @include flex-fixed;
      display: inline-block;
      position: relative;
      height: $styleHeight;
      box-sizing: border-box;
      border-bottom: 1px solid transparent;
      cursor: default;
      user-select: none;
      // @include display-center;

      .es-tabs-nav-item-cnt {
        margin: 0;
        white-space: nowrap;
        padding: 0 $navItemPadding;
        height: $styleHeight;
        box-sizing: border-box;
        display: inline-block;
        list-style: none;
        font-size: 15px;
        // font-weight: 500;
        color: #303133;
        position: relative;
        cursor: pointer;
        user-select: none;
        position: relative;
        @include display-center;
        border: 1px solid transparent;
        // background: red;

        // transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
        //   padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: border-color 0.1s cubic-bezier(0.645, 0.045, 0.355, 1),
          padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        -webkit-transition: border-color 0.1s
            cubic-bezier(0.645, 0.045, 0.355, 1),
          padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }

      .es-tabs-nav-item-cnt > * {
        @include flex-fixed;
      }

      .es-tabs-nav-item-cnt.es-error {
        border-color: $g_errorColor;
        border-radius: 2px;
      }

      &:hover .es-tabs-nav-item-cnt,
      &.is-active .es-tabs-nav-item-cnt {
        color: $activeBtnColor;
      }

      &.has-close:hover .es-tabs-nav-item-cnt,
      &.has-close.is-active .es-tabs-nav-item-cnt,
      &.has-close.has-pop .es-tabs-nav-item-cnt {
        padding-left: $navItemPadding - $closeBoxWidth/2 + 2;
        padding-right: $navItemPadding - $closeBoxWidth/2 - 2;
      }

      &:hover .es-tabs-close-box {
        width: $closeBoxWidth;
      }

      &.is-active .es-tabs-close-box {
        width: $closeBoxWidth;
      }

      &.has-pop .es-tabs-close-box {
        width: $closeBoxWidth;
      }

      &:hover .es-tabs-left-btn,
      &:hover .es-tabs-right-btn {
        @include display-center;
      }

      &.is-active {
        border-bottom-color: $activeBgColor;
      }
    }
  }

  &.es-type-card .es-tabs-nav li {
    border-top: 1px solid $g_borderColor;
    border-right: 1px solid $g_borderColor;
  }

  &.es-type-card .es-tabs-nav li:first-child {
    border-left: 1px solid $g_borderColor;
    border-top-left-radius: $g_borderRadius;
  }

  &.es-type-card .es-tabs-nav li:last-child {
    border-top-right-radius: $g_borderRadius;
  }

  &.es-type-border-card {
    border-top: 1px solid $g_borderColor;
    border-right: 1px solid $g_borderColor;
    border-left: 1px solid $g_borderColor;
    background: $g_bgColor;
  }

  &.es-type-border-card .es-tabs-nav li {
    border-right: 1px solid $g_borderColor;
    height: $styleHeight - 1;
  }

  &.es-type-border-card .es-tabs-nav li.is-active {
    background: $activeBgColor;
  }

  &.es-type-border-card .es-tabs-nav li .es-tabs-nav-item-cnt {
    height: $styleHeight - 1;
    line-height: $styleHeight - 1;
  }

  &.es-type-line .es-tabs-nav li.is-active {
    border-bottom-width: 2px;
    border-bottom-color: $activeBtnColor;
  }

  .es-tabs-add {
    margin: 0;
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
    position: absolute;
    right: 2px;
    top: ($styleHeight - $addBtnWidth)/2;

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

  .es-tabs-close-box {
    margin: 2px 0 0 0;
    padding: 0;
    width: 0;
    height: $closeBtnWidth;
    line-height: $closeBtnWidth;
    text-align: right;
    overflow: hidden;
    position: relative;
    // @include display-flex;
    // justify-content: flex-end;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .es-tabs-close {
    @include mixin-tabs-btn;
    display: block; // safari
    position: relative;
    background: transparent;

    // transform-origin: 50% 50%;
    // -webkit-transform-origin: 50% 50%;

    transform: rotate(45deg);
    -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
    overflow: hidden;
    @include flex-fixed;

    &::before {
      content: "";
      display: block;
      position: absolute;
      // border-radius: 3px;
      top: ($closeBtnWidth - $closeBtnLineHeight)/2;
      left: ($closeBtnWidth - $closeBtnLineWidth)/2;
      width: $closeBtnLineWidth;
      height: $closeBtnLineHeight;
      background: $mormalBtnColor;
    }

    &::after {
      content: "";
      display: block;
      position: absolute;
      border-radius: 3px;
      top: ($closeBtnWidth - $closeBtnLineWidth)/2;
      left: ($closeBtnWidth - $closeBtnLineHeight)/2;
      width: $closeBtnLineHeight;
      height: $closeBtnLineWidth;
      background: $mormalBtnColor;
    }

    &:not(.disabled):hover::before {
      background: $btnHoverColor;
    }

    &:not(.disabled):hover::after {
      background: $btnHoverColor;
    }

    &.disabled::before {
      background: $btnDisableColor;
    }

    &.disabled::after {
      background: $btnDisableColor;
    }

    &.disabled {
      cursor: not-allowed;
    }
  }

  .es-tabs-left-btn {
    display: none;
    @include mixin-tabs-btn;

    position: absolute;
    left: 1px;
    top: 1px;

    .es-arrow {
      @include arrow($mormalBtnColor, $popBorderWidth, "left", $popBgColor);
      // margin-top: -1px;
      margin-right: 1px;
    }

    &:not(.disabled):hover .es-arrow {
      border-right-color: $btnHoverColor;
    }

    &:not(.disabled):hover .es-arrow::before {
      border-right-color: $btnHoverBgColor;
    }
  }

  .es-tabs-left-btn.disabled .es-arrow {
    border-right-color: $btnDisableColor;
    cursor: not-allowed;
  }

  .es-tabs-right-btn {
    display: none;
    @include mixin-tabs-btn;

    position: absolute;
    right: 1px;
    top: 1px;

    .es-arrow {
      @include arrow($mormalBtnColor, $popBorderWidth, "right", $popBgColor);
      margin-left: 1px;
    }

    &:not(.disabled):hover .es-arrow {
      border-left-color: $btnHoverColor;
    }

    &:not(.disabled):hover .es-arrow::before {
      border-left-color: $btnHoverBgColor;
    }
  }

  .es-tabs-right-btn.disabled .es-arrow {
    border-left-color: $btnDisableColor;
    cursor: not-allowed;
  }
}
</style>
