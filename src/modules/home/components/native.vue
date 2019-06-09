<template>
  <div>
    <input ref="test" v-model="gameName" @keyup="testSubmit" />
    <el-input
      ref="test1"
      v-model="gameName"
      @change="testSubmit"
      @change.native="testNativeSubmit"
    ></el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gameName: 9
    };
  },

  computed: {},

  mounted() {
    window.testVm = this;
  },

  methods: {
    testSubmit($event) {
      console.log("$testSubmit:", $event);
      console.log("this.$refs.test", this.$refs.test);
      window.testVm = this;
    },
    testNativeSubmit($event) {
      console.log("$testNativeSubmit:", $event);
    }
  },
  components: {}
};
</script>
