<template>
  <ul class="com-unit">
    <li class="txt"><i class="el-icon-star-on star"></i> 第1行的描述</li>
    <li class="txt"><i class="el-icon-bell"></i> 第2行的描述</li>
  </ul>
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

.com-unit {
  // white-space: nowrap;
  margin: 0;
  padding: 0;
  font-size: 12px;
  line-height: 16px;
  .star {
    color: #67c23a;
  }

  .txt {
    color: #e6a23c;
  }
}
</style>
