<template>
  <div
    class="lazy-image-box"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <div
      class="thumb-box"
      @click="previewImage"
      :style="{
        width: width + 'px',
        height: height + 'px',
        cursor: canPreview ? 'pointer' : 'default'
      }"
    >
      <img class="thumb" v-if="showIcon" v-lazy="smallSrc" />
      <i class="zoom-icon el-icon-zoom-in" v-if="canPreview"></i>
    </div>
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="80%">
      <img
        :src="bigSrc ? bigSrc : smallSrc"
        style="display: block; margin: 0 auto; max-width: 100%;"
      />
    </el-dialog>
  </div>
</template>

<script>
/* 本组件主要用于列表的ICON，会懒加载图片 */
export default {
  /* ====================== 生命周期 ====================== */

  created() {
    // console.log(1);
  },

  /* ====================== 数据绑定 ====================== */

  data() {
    return {
      dialogVisible: false,
      showIcon: true
    };
  },

  props: {
    canPreview: {
      type: Boolean,
      required: false,
      default: true
    },

    smallSrc: {
      // smallSrc是必须，当放大时，没有bigSrc, 那就取smallSrc
      type: String,
      required: true
      // default: 'http://a4.vimage1.com/upload/category/2018/05/04/68/7c237b5b-dc43-4945-83d2-875c52fe0119.jpg'
    },

    bigSrc: {
      type: String,
      required: false,
      default: ""
    },

    width: {
      type: Number,
      required: false,
      default: 90
    },

    height: {
      type: Number,
      required: false,
      default: 90
    }
  },

  watch: {
    smallSrc(newVal, oldVal) {
      if (newVal != oldVal) {
        // console.log(newVal);
        // console.log(oldVal);
        this.$data.showIcon = false;
        this.$nextTick(() => {
          this.$data.showIcon = true;
        });
      }
    }
  },

  /* ====================== 事件处理 ====================== */

  methods: {
    previewImage() {
      if (this.canPreview) {
        this.dialogVisible = true;
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/static/css/mixins.scss";
.lazy-image-box {
  margin: 0 auto;
  // display: inline-block;
  position: relative;
  cursor: pointer;
  .thumb-box {
    @include display-center;
    overflow: hidden;
    .thumb {
      max-width: 100%;
      max-height: 100%;
      cursor: inherit;
    }
  }

  .zoom-icon {
    position: absolute;
    cursor: inherit;
    right: 0px;
    bottom: 0px;
    font-size: 20px;
  }

  .thumb-box:hover .zoom-icon {
    color: #409eff;
  }
}
</style>
