<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      <div>字段unit: 对组件进行补充，一般用于单位</div>
      <div>字段desc: 对每一项进行补充</div>
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
            desc:
              "es: {{$root}}.name.length > 4 ? '大于4个字，试试减少' : '小于4个字，试试添加'"
          },
          summary: {
            label: "广告摘要",
            component: "el-input",
            value: "广告摘要文字",
            // col: 12,
            desc: {
              name: "span",
              props: {},
              text:
                "es: {{$root}}.summary.length > 4 ? '我是一个组件引入: 大于4个字，试试减少' : '我是一个组件引入: 小于4个字，试试添加'"
            }
          },
          unitType: {
            label: "单位测试",
            component: "el-slider",
            value: 10,
            // col: 12,
            unit: "es: '单位' + {{$root.unitType}}"
          },
          startAge: {
            label: "适合人群",
            group: "date",
            col: 12,
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
            col: 12,
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
