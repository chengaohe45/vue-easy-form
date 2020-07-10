// import utils from "../libs/utils";
import popUtils from "../libs/pop-utils";
export default {
  data() {
    return {
      showPop: false,
      popDom: null,
      clickDocHandler: null,
      scrollWinHandler: null,
      placement: "bottom",

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
    hasDelete: {
      type: Boolean,
      required: false,
      default: false
    },
    hasDelWarn: {
      type: Boolean,
      required: false,
      default: true
    },
    index: {
      type: [Number, String],
      required: false,
      default: -1 // 设置为-1；低于索引值
    },
    delMsg: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    },
    delWarnBtns: {
      type: Array,
      required: false,
      default: () => {
        return [];
      }
    },
    info: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    }
  },

  computed: {
    canPop() {
      return this.hasDelWarn;
    }
  },

  created() {
    if (this.canPop) {
      this.$data.clickDocHandler = event => {
        if (!this.isFromDelBtn(event.target)) {
          this.$data.showPop = false;
          this.cancelDocListen();
        } else {
          //...
        }
      };

      this.$data.scrollWinHandler = () => {
        this.adjustPop();
      };
    }
  },

  methods: {
    showPopHandler() {
      // 有警告
      this.$data.showPop = !this.$data.showPop;
      if (this.$data.showPop) {
        this.addPopDom();
        this.setDocListen();
        this.$data.popPosition.zindex = popUtils.getMaxZIndex() + 1;
        // console.log("this.$data.popPosition.zindex = ", this.$data.popPosition.zindex);
        this.$nextTick(() => {
          this.adjustPop();
        });
      } else {
        this.cancelDocListen();
      }
    },

    clickDeletBtn() {
      if (
        this.canPop &&
        this.hasDelWarn &&
        (!this.delMsg.hidden && (this.delMsg.name || this.delMsg.text))
      ) {
        this.showPopHandler();
      } else {
        // 没有警告
        this.$emit("delItem", this.index);
      }
    },

    clickPopConfirm() {
      this.$data.showPop = false;
      this.$emit("delItem", this.index);
      this.cancelDocListen();
    },

    closePop() {
      this.$data.showPop = false;
      this.cancelDocListen();
    },

    setDocListen() {
      window.addEventListener("scroll", this.$data.scrollWinHandler, true);
      document.addEventListener("click", this.$data.clickDocHandler);
    },

    cancelDocListen() {
      document.removeEventListener("click", this.$data.clickDocHandler);
      window.removeEventListener("scroll", this.$data.scrollWinHandler, true);
    },

    isFromDelBtn(target) {
      var myDelBtn = this.$refs["delBtn"];
      if (!this.$refs["delBtn"]) {
        return false;
      }
      myDelBtn = myDelBtn.$el ? myDelBtn.$el : myDelBtn;
      while (target) {
        if (target == myDelBtn) {
          return true;
        }
        target = target.parentNode;
      }
      return false;
    },

    adjustPop() {
      var pop = this.$refs["pop"];
      var icon = this.$refs["delBtn"].$el
        ? this.$refs["delBtn"].$el
        : this.$refs["delBtn"];
      var popRect = pop.getBoundingClientRect();
      var iconRect = icon.getBoundingClientRect();

      var uiInfo = popUtils.getPopUiInfo(
        popRect,
        iconRect,
        this.$data.popInfo,
        this.$data.placement
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
    }
  },

  destroyed() {
    if (this.$data.scrollWinHandler || this.$data.clickDocHandler) {
      this.$data.showPop = false;
      this.cancelDocListen();

      this.$data.clickDocHandler = null;
      this.$data.scrollWinHandler = null;
    }
    this.removePopDom();
  }
};
