<template>
  <h2 class="title-box" :style="{ borderColor: color, color: color }">
    {{ text }}
  </h2>
</template>

<style lang="scss">
.title-box {
  margin: 0 0 0 10px;
  padding: 0 0 2px 10px;
  font-size: 20px;
  line-height: 22px;
  border-left: 3px solid #333;
}
</style>

<script>
export default {
  props: {
    text: {
      type: String,
      required: false,
      default: ""
    },
    color: {
      type: String,
      required: false,
      default: "#333"
    }
  },

  data() {
    return {};
  },

  components: {},

  created() {},

  methods: {},

  watch: {}
};
</script>
