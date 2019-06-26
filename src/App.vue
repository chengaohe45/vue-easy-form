<template>
  <!-- <div class="sys-window"> -->
  <!-- <sys-header></sys-header> -->
  <div class="sys-win-body">
    <transition name="nav-slide">
      <div class="sys-nav-slide" style="width: 210px;">
        <sys-header></sys-header>
        <sys-nav></sys-nav>
      </div>
    </transition>
    <div class="sys-body">
      <div class="sys-body-cont">
        <router-view></router-view>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
// import utils from "@/libs/utils";

import sysHeader from "@/components/common/header";
import sysNav from "@/components/common/nav";

// import utils from "@/libs/utils";
// import listeners from "@/libs/listeners";
// import constant from "@/libs/constant";

export default {
  props: {},

  data: function() {
    return {};
  },

  computed: {},

  mounted() {},

  destroyed() {},

  created() {},

  methods: {},
  components: {
    sysHeader,
    sysNav
  }
};
</script>

<style lang="scss">
@import "@/static/css/mixins.scss";

// .sys-window {
//   height: 100%;
//   @include display-flex;
//   @include direction-v;
// }

.sys-win-body {
  @include display-flex;
  @include direction-h;
  // @include flex-full;
  height: 100%;

  .sys-nav-slide {
    display: block;
    @include flex-fixed;
    @include border-box;
    margin: 0;
    padding: 0;
    background-color: #324157;
    text-align: left;
    /*width: $g_navAsideWidth;*/
    border-right: 1px solid #e6e6e6;
    overflow: auto;
  }

  .sys-body {
    @include display-flex;
    @include direction-v;
    @include flex-full;
    overflow: hidden;
  }

  .sys-body-cont {
    overflow: auto;
    @include flex-full;
    height: 100%;
  }
}

/* 设置持续时间和动画函数 */
.nav-slide-enter-active {
  /*transition: all 0.3s ease;*/
  animation: slide-bounce-in 0.3s ease-out;
}
.nav-slide-leave-active {
  /*transition: all .3s ease;*/
  animation: slide-bounce-in 0.3s ease-in-out reverse;
}

@keyframes slide-bounce-in {
  0% {
    width: 0px;
    opacity: 0;
  }
  100% {
    width: $g_navAsideWidth;
    opacity: 1;
  }
}
</style>
