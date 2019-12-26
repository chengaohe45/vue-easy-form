<template>
  <div class="help-box">
    <el-tooltip placement="top" v-if="content">
      <div slot="content">
        <div class="help-content-box" v-html="content"></div>
      </div>
      <a v-if="href" :href="href" target="_blank" class="help-btn">
        <i :class="[icon ? icon : 'el-icon-info', 'help-icon']"></i>
      </a>
      <i v-else :class="[icon ? icon : 'el-icon-info', 'help-icon']"></i>
    </el-tooltip>
    <template v-else>
      <a v-if="href" :href="href" target="_blank" class="help-btn">
        <i :class="[icon ? icon : 'el-icon-info', 'help-icon']"></i>
      </a>
      <i v-else :class="[icon ? icon : 'el-icon-info', 'help-icon']"></i>
    </template>
  </div>
</template>

<script>
export default {
  /* ====================== 生命周期 ====================== */

  created() {},

  /* ====================== 数据绑定 ====================== */

  data() {
    return {};
  },

  props: {
    icon: {
      // 帮助图标
      type: String,
      required: false,
      default: "el-icon-info"
    },

    content: {
      // 内容区
      type: String,
      required: false,
      default: ""
    },

    href: {
      // 若有些值，说是图标是一条链接
      type: String,
      required: false,
      default: ""
    }
  },

  watch: {},

  /* ====================== 事件处理 ====================== */

  methods: {}
};
</script>

<style lang="scss">
@import "@/static/css/mixins.scss";
.help-box {
  @include display-center;
  line-height: normal;
  .help-btn {
    @include display-center;
    line-height: normal;
    user-select: none;
    outline: none;
    color: inherit;
    text-decoration: none !important;
    &:hover {
      color: #409eff;
      text-decoration: none;
    }
  }

  .help-icon {
    outline: none;
    user-select: none;
    font-size: 16px;
  }
}

.help-content-box {
  min-width: 50px;
  max-width: 200px;
  line-height: 1.5;
  text-align: left;
}
</style>
