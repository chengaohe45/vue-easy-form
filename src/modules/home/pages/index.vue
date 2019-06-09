<template>
  <div class="home-box">
    <!-- Hello world -->
    <!-- <div style="width: 90%;">
      <tabsNav>
        <tabsItem :tabsName="'tabs1'" :is-active="false"></tabsItem>
        <tabsItem :tabsName="'tabs2'" :is-active="true"></tabsItem>
        <tabsItem :tabsName="'tabs3'" :is-active="false"></tabsItem>
        <tabsItem :tabsName="'tabs3'" :is-active="false"></tabsItem>
        <tabsItem :tabsName="'tabs3'" :is-active="false"></tabsItem>
        <tabsItem :tabsName="'tabs3'" :is-active="false"></tabsItem>
        <tabsItem :tabsName="'tabs3'" :is-active="false"></tabsItem>
        <tabsItem :tabsName="'tabs3'" :is-active="false"></tabsItem>
        <tabsItem :tabsName="'tabs3'" :is-active="false"></tabsItem>
      </tabsNav>
    </div> -->
    <el-input v-model="gameName"  @change.native="testChangeNative" @change="testChange" @input="testInput" placeholder="游戏名称" class="w120"></el-input>
    <native @keyup.native="testSubmit"></native>
  </div>
</template>

<script>
// import utils from "../../libs/utils";
import tabsNav from "@/package/components/tabs-nav";
import tabsItem from "@/package/components/tabs-nav-item";
import native from "../components/native";
export default {
  data() {
    return {
      input: undefined,
      gameName: ""
    };
  },

  computed: {},

  mounted() {},

  methods: {
    testSubmit($event) {
      console.log("$event2: ", $event); // 测试证明：只要是组件，.native都成功；
    },
    testChangeNative() {
      console.log("testChangeNative...");
    },
    testChange() {
      console.log("testChange...");
    },
    testInput() {
      console.log("testInput...");
    }
  },
  components: {
    tabsNav,
    tabsItem,
    native
  }
};
</script>

<style lang="scss">
@import "@/static/css/mixins.scss";
.home-box {
  @include display-center;
  // font-size: 50px;
  height: 100%;
}
</style>
