<template>
  <demo-frame
    :title="title"
    :formSchema="formSchema"
    :docsTitle="docsTitle"
    :docsHref="docsHref"
    :hasOperate="hasOperate"
    :hasConsole="hasConsole"
  >
    <div slot="details">
      autoMatch为true，则第二级的项（font.fontSize、font.backgroundImage）会在<span
        class="sys-danger"
        >输出表单值</span
      >时会提升到一级，而根值rootData是不变的（见控制台）。
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "@/components/demo-frame/index.vue";

export default {
  data() {
    return {
      title: "自动匹配",
      docsTitle: "自动匹配配置文档",
      docsHref: "/vue-easy-form-docs/dist/base/auto-match.html",
      hasConsole: true,
      hasOperate: true,

      formSchema: {
        autoMatch: true,
        properties: {
          pageName: "页面名称",
          font: {
            title: {
              text: "字体信息"
            },
            label: false,
            properties: {
              fontSize: {
                label: "字体大小",
                component: "el-input-number",
                value: 14
              },
              fontColor: {
                label: "字体颜色",
                component: "el-color-picker",
                value: "#67C23A"
              }
            }
          },
          background: {
            title: {
              text: "背景信息"
            },
            label: false,
            properties: {
              backgroundImage: {
                label: "背景图片",
                component: "el-input",
                value: ""
              },
              backgroundColor: {
                label: "背景颜色",
                component: "el-color-picker",
                value: "#3AABC2"
              }
            }
          }
        }
      }
    };
  },

  created() {},

  computed: {},

  mounted() {},

  methods: {},
  components: {
    demoFrame
  }
};
</script>

<style lang="scss"></style>
