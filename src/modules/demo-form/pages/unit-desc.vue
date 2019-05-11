<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      <div>字段unit: 对组件进行补充，一般用于单位</div>
      <div>字段desc: 对每一项进行补充；支持html</div>
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
// import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "单位与描述设置",

      details: "字段unit, desc; desc支持html",

      formSchema: {
        properties: {
          name: {
            label: "广告名称",
            component: "el-input",
            value: "首页位置",
            // col: 12,
            desc: "1. 广告名称就是要好听<br />2. 广告名称就是要好看"
          },
          // pholder: {
          //   layout: "space",
          //   col: 12
          // },
          startAge: {
            label: "适合人群",
            group: "date",
            col: 8,
            component: {
              name: "el-input-number",
              size: "auto"
            },
            rules: {
              check: {
                trigger: "input",
                name: function(value) {
                  return value < 15;
                }
              }
            },
            value: "15",
            unit: "岁"
          },
          endAge: {
            label: {
              text: "到",
              size: "fixed"
            },
            group: "date",
            col: 8,
            component: {
              name: "el-input-number",
              size: "auto"
            },
            value: 20,
            unit: "岁"
          }
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

<style lang="scss"></style>
