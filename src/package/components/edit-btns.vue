<template>
  <div class="es-form-edit-btns">
    <div class="es-btn-group">
      <es-btn
        ref="delBtn"
        :disabled="index + 1 <= fixed || !canDelete"
        @click="clickDeletBtn"
        v-if="hasDelete"
      >
        <div class="es-circle-delete"></div>
      </es-btn>
      <es-btn
        :disabled="isFirst || index <= fixed"
        @click="upItem"
        v-if="hasSort"
      >
        <div class="es-triangle-border-up"></div>
      </es-btn>
      <es-btn
        :disabled="isLast || index < fixed"
        @click="downItem"
        v-if="hasSort"
      >
        <div class="es-triangle-border-down"></div>
      </es-btn>
    </div>
    <transition name="es-fade" mode="out-in" appear v-if="canPop">
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
        <div class="es-form-pop-content">
          <div>确定删除吗？</div>
          <div class="es-btn-row">
            <div class="es-btn-group">
              <es-btn class="es-btn" @click="clickPopConfirm">
                确定
              </es-btn>
              <es-btn class="es-btn" @click="closePop">
                取消
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
.es-form-edit-btns {
  display: inline-block;
}
</style>

<script>
import arrayDelPopMixin from "../mixins/array-del-pop-mixin";
import esBtn from "./btn.vue";

export default {
  mixins: [arrayDelPopMixin],
  components: {
    esBtn
  },
  data() {
    return {};
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
    }
  },

  methods: {
    upItem() {
      if (!this.isFirst) {
        this.$emit("upItem", this.index);
      }
    },

    downItem() {
      if (!this.isLast) {
        this.$emit("downItem", this.index);
      }
    }
  }
};
</script>
