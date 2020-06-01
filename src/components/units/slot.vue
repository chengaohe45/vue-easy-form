<template>
  <div>
    <el-input></el-input>
    <slot :color="color">?</slot>
    <slot name="test">!</slot>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  props: {
    color: {
      type: String,
      required: false,
      default: "#67c23a"
    }
    // ts: {
    //   type: String,
    //   required: false,
    //   default: "false"
    // }
  },

  created() {
    window.testSlot = this;
  },

  computed: {},

  mounted() {},

  methods: {},
  components: {}
};
</script>

<style lang="scss"></style>
