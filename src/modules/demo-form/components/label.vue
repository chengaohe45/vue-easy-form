<template>
  <span class="com-label"> 组件写法<i class="el-icon-star-on star"></i> </span>
</template>

<script>
export default {
  data() {
    return {};
  },

  props: {},

  created() {},

  computed: {},

  mounted() {},

  methods: {},
  components: {}
};
</script>

<style lang="scss">
@import "@/static/css/mixins.scss";

.com-label {
  white-space: nowrap;
  .star {
    color: #67c23a;
  }

  .txt {
    color: #e6a23c;
  }
}
</style>
