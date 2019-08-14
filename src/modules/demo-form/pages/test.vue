<template>
  <div class="test-box">
    <el-input
      v-model="gameName"
      @blur.native.capture="testBlurNative"
      @change.native.capture="testChangeNative"
      @change="testChange"
      @input="testInput"
      placeholder="游戏名称"
      class="w120"
    ></el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: undefined,
      gameName: "gameName"
    };
  },

  computed: {},

  mounted() {},

  methods: {
    testSubmit($event) {
      console.log("$event2: ", $event); // 测试证明：只要是组件，.native都成功；
    },
    testChangeNative() {
      console.log("testChangeNative...");
    },
    testBlurNative() {
      console.log("testBlurNative...");
    },
    testChange() {
      console.log("testChange...");
    },
    testInput() {
      console.log("testInput...");
    }
  },
  components: {}
};
</script>

<style lang="scss">
@import "@/static/css/mixins.scss";
.test-box {
  @include display-center;
}
</style>
