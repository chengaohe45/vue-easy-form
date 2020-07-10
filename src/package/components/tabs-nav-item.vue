<template>
  <li
    :class="{
      'is-active': isActive,
      'has-close': hasDelete,
      'has-pop': showPop
    }"
  >
    <div
      :class="{ 'es-tabs-nav-item-cnt': true, 'es-error': hasError }"
      @click="clickCntHandler"
    >
      <!-- <span v-if="required" class="es-required">*</span> -->
      <div>
        <slot></slot>
      </div>
      <div class="es-tabs-close-box" v-if="hasDelete">
        <es-tabs-btn
          ref="delBtn"
          :disabled="index + 1 <= fixed || !canDelete"
          class="es-tabs-close"
          @click="clickDeletBtn"
        ></es-tabs-btn>
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
                <span class="content" v-if="!delMsg.name">{{
                  delMsg.text
                }}</span>
                <es-base v-else :config="delMsg" :info="info"></es-base>
              </div>
              <div class="es-btn-row">
                <div class="es-btn-group">
                  <es-btn class="es-btn" @click="clickPopConfirm">
                    {{ delWarnBtns[0] }}
                  </es-btn>
                  <es-btn class="es-btn" @click="closePop">
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
    </div>
    <es-tabs-btn
      v-if="hasSort"
      :disabled="isFirst || index <= fixed"
      @click="upItem"
      class="es-tabs-left-btn"
      ><span class="es-arrow"></span
    ></es-tabs-btn>
    <es-tabs-btn
      v-if="hasSort"
      :disabled="isLast || index < fixed"
      @click="downItem"
      class="es-tabs-right-btn"
      ><span class="es-arrow"></span
    ></es-tabs-btn>
  </li>
</template>

<style lang="scss"></style>

<script>
import arrayEditItemMixin from "../mixins/array-edit-item-mixin";
import arrayDelPopMixin from "../mixins/array-del-pop-mixin";
import esBtn from "./btn.vue";
import esTabsBtn from "./tabs-btn.vue";
// import utils from "../libs/utils";

export default {
  mixins: [arrayEditItemMixin, arrayDelPopMixin],
  components: {
    esBtn,
    esTabsBtn
  },
  data() {
    return {
      placement: "top",

      popInfo: {
        popBorderRadius: 4,
        viewSpace: 2, // 距离判断边预留的空间
        popArrowWH: 6, // 箭头的宽度和高度
        betweenSpace: 6 // pop与icon的空间
      }
    };
  },
  props: {
    // tabsName: {
    //   type: String,
    //   required: true,
    //   default: "???"
    // },
    isActive: {
      type: Boolean,
      required: true,
      default: false
    },
    hasError: {
      type: Boolean,
      required: false,
      default: false
    },
    info: {
      type: Object,
      required: true
      // default: false
    }
  },

  methods: {
    clickCntHandler(event) {
      if (!this.isActive && !this.isFromDelBtn(event.target)) {
        this.$emit("clickActive", this.index);
      } else {
        //不用理会，这个点击有其它作用
      }
    }
  },

  mounted() {
    // if (utils.isStr(this.index)) {
    //   // 来自布局tabs
    //   this.$emit("reactive", this.index);
    // }
  },

  beforeDestroy() {
    // console.log("emit reactive... 1");
    // if (this.isActive) {
    //   // console.log("emit reactive... 2");
    //   this.$emit("reactive");
    // }
  }
};
</script>
