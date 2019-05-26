<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details"></div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "引入/配置",

      formSchema: {
        name: {
          label: "广告名称",
          component: "el-input",
          value: "首页位置"
        },
        tags: {
          label: "广告标签",
          component: {
            name: dynamicTags
          },
          value: ["标签1", "标签2"]
        }
      }
    };
  },

  created() {
    // console.log("dynamicTags", dynamicTags);
  },

  computed: {},

  mounted() {},

  methods: {},
  components: {
    demoFrame
  }
};
</script>

<style lang="scss">
.demo-base-details {
  line-height: 20px;

  .base-title {
    margin: 6px 0 0 0;
    padding: 0;
    line-height: 26px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
