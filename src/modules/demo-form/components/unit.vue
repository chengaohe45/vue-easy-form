<template>
  <span class="com-unit">
    <span class="txt">单位{{num}}</span><i class="el-icon-star-on star"></i>
  </span>
</template>

<script>
export default {
  data() {
    return {
    };
  },

  props: {
    num: {
      type: Number,
      required: false,
      default: 10
    }
  },

  created() {
  },

  computed: {},

  mounted() {},

  methods: {
    
  },
  components: {}
};
</script>

<style lang="scss">
@import "@/static/css/mixins.scss";

.com-unit {
  white-space: nowrap;
  .star {
    color: #67C23A;
  }

  .txt {
    color: #E6A23C;
  }
}
</style>
