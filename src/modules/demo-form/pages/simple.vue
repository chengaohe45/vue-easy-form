<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      只需求配置label、component、value即可;
      <span class="sys-danger"
        >最好配置value,否则默认为undefined,应用于默认值和重置</span
      >
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
// import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "简单写法",

      formSchema: {
        name: {
          label: "广告名称",
          component: "el-input",
          value: "首页位置"
        },
        author: "作者名称"
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

<style lang="scss"></style>
