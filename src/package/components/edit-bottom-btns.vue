<template>
  <div class="es-form-bottom-btns">
    <div class="es-btn-group">
      <es-btn
        ref="delBtn"
        :disabled="!canDelete"
        @click="clickDeletBtn"
        v-if="hasDelete"
      >
        删除所有
      </es-btn>
      <es-btn :disabled="!canAdd" @click="addItem" v-if="hasAdd">
        添加
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
          <div class="content-box">
            <span class="content" v-if="!delMsg.name">{{ delMsg.text }}</span>
            <es-base v-else :config="delMsg" :info="info"></es-base>
          </div>
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
.es-form-bottom-btns {
  position: relative;
  // display: inline-block;
}
</style>

<script>
import arrayDelPopMixin from "../mixins/array-del-pop-mixin";
import esBtn from "./btn.vue";
import esBase from "../base";

export default {
  mixins: [arrayDelPopMixin],
  data() {
    return {};
  },
  components: {
    esBtn,
    esBase
  },
  props: {
    canDelete: {
      type: Boolean,
      required: false,
      default: true
    },
    canAdd: {
      type: Boolean,
      required: false,
      default: true
    },
    hasDelete: {
      type: Boolean,
      required: false,
      default: true
    },
    hasAdd: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  created() {
    this.$data.placement = "top"; // 设置pop在上面优先
  },

  methods: {
    addItem() {
      if (this.canAdd) {
        this.$emit("addItem");
      }
    }
  }
};
</script>
