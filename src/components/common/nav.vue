<template>
  <el-menu
    :default-active="$route.path"
    :router="true"
    class="nav-box"
    background-color="#324157"
    text-color="#fff"
    active-text-color="#409eff"
    :unique-opened="true"
  >
    <template v-for="(item, index) in navList">
      <el-submenu v-if="!item.link" :key="index" :index="index + ''">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item
          v-for="(subItem, subIndex) in item.children"
          :index="subItem.link || index + '-' + subIndex"
          :key="subIndex"
          :route="{ path: subItem.link || '' }"
        >
          <i :class="subItem.icon"></i>
          <span slot="title">{{ subItem.name }}</span>
        </el-menu-item>
      </el-submenu>

      <el-menu-item
        v-else
        :index="item.link || index + ''"
        :key="index"
        :route="{ path: item.link || '' }"
      >
        <i :class="item.icon"></i>
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
/* 设置注意：当:router="true"时，点击切换页面，会先判断:route="{path: subItem.link || ''}"有没有值，再判断它的:index */

// import utils from "@/libs/utils";

import navRoute from "@/config/nav-route";

export default {
  props: {},

  data: function() {
    return {
      navList: navRoute.getNav()
    };
  },

  computed: {},

  created() {
    // this.navList = navRoute.getNav();
  },

  mounted() {},

  destroyed() {},

  methods: {},

  watch: {
    //   "$route": function(){
    //   console.log("this.$route", this.$route, this.$router)
    //   }
  }
};
</script>

<style lang="scss">
.nav-box {
  border-right: 0 !important;
  padding-bottom: 10px;

  .el-submenu.is-active {
    .el-submenu__title {
      color: rgb(64, 158, 255) !important;
    }

    .el-icon-menu {
      color: rgb(64, 158, 255);
    }
  }
}

/*.fullHeight {
        height: 100%;
    }*/
</style>
