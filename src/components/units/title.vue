<template>
  <span class="title-box" :style="{ borderColor: color, color: color }">
    <i class="el-icon-notebook-1 icon"></i>{{ text }}
  </span>
</template>

<style lang="scss">
.title-box {
  margin: 0 0 0 0;
  padding: 0 0 0 0;
  font-size: 18px;
  line-height: 24px;
  white-space: nowrap;

  .icon {
    color: #67c23a;
    margin-right: 3px;
  }
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
