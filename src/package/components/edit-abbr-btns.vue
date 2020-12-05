<template>
  <div class="es-form-edit-btns">
    <div class="btn-list-box">
      <span
        :class="'es-addr-btns-box' + (size ? ' ' + size : '')"
        ref="delBtn"
        @click="clickEditHandler"
      ></span>
    </div>

    <transition name="es-fade" mode="out-in" appear>
      <div
        ref="pop"
        v-show="showPop"
        class="es-form-pop-box"
        :style="{
          left: popPosition.left + 'px',
          top: popPosition.top + 'px',
          zIndex: popPosition.zindex + ''
        }"
        @click.prevent.stop
      >
        <div class="es-form-pop-content es-thin" v-if="showBtn">
          <div class="es-btn-group">
            <es-btn
              :disabled="index + 1 <= fixed || !canDelete"
              @click="clickDeletBtn"
              v-if="hasDelete"
            >
              <div class="es-circle-delete"></div>
            </es-btn>
            <es-btn :disabled="!canAdd" @click="copyItem" v-if="hasAdd">
              <div class="es-normal-plus"></div>
            </es-btn>
            <es-btn
              :disabled="isFirst || index <= fixed"
              @click="upItem"
              v-if="hasSort"
            >
              <div v-if="isHArrow" class="es-triangle-border-up es-left"></div>
              <div v-else class="es-triangle-border-up"></div>
            </es-btn>
            <es-btn
              :disabled="isLast || index < fixed"
              @click="downItem"
              v-if="hasSort"
            >
              <div
                v-if="isHArrow"
                class="es-triangle-border-down es-right"
              ></div>
              <div v-else class="es-triangle-border-down"></div>
            </es-btn>
          </div>
        </div>
        <div class="es-form-pop-content" v-else>
          <div class="content-box">
            <span class="content" v-if="!delMsg.name">{{ delMsg.text }}</span>
            <es-base v-else :config="delMsg" :info="info"></es-base>
          </div>
          <div class="es-btn-row">
            <div class="es-btn-group">
              <es-btn class="es-btn" @click="clickPopConfirm">
                {{ delWarnBtns[0] }}
              </es-btn>
              <es-btn class="es-btn" @click="showEditBtn">
                {{ delWarnBtns[1] }}
              </es-btn>
            </div>
          </div>
        </div>
        <div
          v-if="popArrow.direction"
          :class="'es-pop-arrow-' + popArrow.direction"
          :style="{ left: popArrow.left + 'px', top: popArrow.top + 'px' }"
        ></div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
@import "../static/css/mixins.scss";
.es-form-edit-btns {
  .btn-list-box {
    @include display-center;
  }
}
</style>

<script>
import arrayDelPopMixin from "../mixins/array-del-pop-mixin";
import esBtn from "./btn.vue";
import esBase from "../base";

export default {
  mixins: [arrayDelPopMixin],
  components: {
    esBtn,
    esBase
  },
  data() {
    return {
      showBtn: false,
      placement: "top"
    };
  },
  props: {
    canDelete: {
      type: Boolean,
      required: false,
      default: true
    },
    hasSort: {
      type: Boolean,
      required: false,
      default: true
    },
    isFirst: {
      type: Boolean,
      required: false,
      default: false
    },
    isLast: {
      type: Boolean,
      required: false,
      default: false
    },
    fixed: {
      // 固定行（前几）
      type: Number,
      required: true,
      default: 0
    },
    index: {
      type: Number,
      required: true,
      default: 0
    },
    canAdd: {
      type: Boolean,
      required: false,
      default: true
    },
    hasAdd: {
      type: Boolean,
      required: false,
      default: false
    },
    size: {
      type: String,
      required: false,
      default: ""
    },
    isHArrow: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    canPop() {
      return true;
    }
  },

  methods: {
    upItem() {
      if (!this.isFirst) {
        this.$data.showPop = false;
        this.$emit("upItem", this.index);
        this.cancelDocListen();
      }
    },

    copyItem() {
      this.$data.showPop = false;
      this.$emit("copyItem", this.index);
      this.cancelDocListen();
    },

    downItem() {
      if (!this.isLast) {
        this.$data.showPop = false;
        this.$emit("downItem", this.index);
        this.cancelDocListen();
      }
    },

    /* 重载 */
    clickDeletBtn() {
      if (
        this.hasDelWarn &&
        (!this.delMsg.hidden && (this.delMsg.name || this.delMsg.text))
      ) {
        // this.showPopHandler();
        this.$data.showBtn = false;
        this.$nextTick(() => {
          this.adjustPop();
        });
      } else {
        // 没有警告
        // this.$emit("delItem", this.index);
        this.$data.showPop = false;
        this.$emit("delItem", this.index);
        this.cancelDocListen();
      }
    },

    showEditBtn() {
      this.$data.showBtn = true;
      this.$nextTick(() => {
        this.adjustPop();
      });
    },

    clickEditHandler() {
      this.showPopHandler();
      this.$data.showBtn = true;
    }
  }
};
</script>
