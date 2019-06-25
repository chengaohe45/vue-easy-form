<template>
  <header class="header-box">
    <h1 class="g-title">esayForm例子</h1>
  </header>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      required: false,
      default: "50px"
    }
  },

  data: function() {
    return {
      // username: ''
    };
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

.header-box {
  @include display-center;
  @include flex-fixed;
  position: relative;
  height: 60px;
  margin: 0;
  padding: 0;
  display: block;
  background-color: rgba(64, 158, 255, 0.2);
  color: #fff;
  overflow: hidden;

  .user-box {
    position: absolute;
    top: 10px;
    right: 20px;
    text-align: center;
    line-height: 20px;
    .logout {
      margin-top: 2px;
      font-size: 15px;
      line-height: 20px;
    }

    .logout-btn {
      padding: 0 2px;
      color: #fff;
      font-size: 13px;
      cursor: pointer;
      &:hover {
        color: #eee;
      }
    }
  }
}
</style>
