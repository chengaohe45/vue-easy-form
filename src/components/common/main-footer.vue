<template>
  <el-footer class="main-footer" :style="'height: ' + height + ';'">
    <slot></slot>
  </el-footer>
</template>

<script>
/* 设置注意：当:router="true"时，点击切换页面，会先判断:route="{path: subItem.link || ''}"有没有值，再判断它的:index */

// import utils from "@/libs/utils";

export default {
  props: {
    height: {
      type: String,
      required: false,
      default: "50px"
    }
  },

  data: function() {
    return {};
  },

  computed: {},

  mounted() {},

  destroyed() {},

  created() {},

  methods: {}
};
</script>

<style lang="scss">
@import "@/static/css/mixins.scss";

.main-footer {
  @include display-center;
  @include flex-fixed;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
  @include border-box;
  text-align: center;
}
</style>
