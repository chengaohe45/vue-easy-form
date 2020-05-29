<template>
  <div>
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
