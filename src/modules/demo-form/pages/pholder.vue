<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      写法跟写一个平常组件一样：<br />
      layout有两个值："space", "tabs"; 区分大小写；其余的认为是false<br />
      当layout为'space'时,说明这个是占位符，此值不会取出，label也不会显示（有效值只有col,hidden,
      group;其余的失效）
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
import title from "@/components/units/title";
export default {
  data() {
    return {
      title: "占位符",

      formSchema: {
        colon: true,
        properties: {
          name: {
            label: "广告名称",
            component: "el-input",
            value: "首页位置",
            col: 12
          },
          pholder: {
            layout: "space",
            col: 1
          },
          author: {
            isTmp: true,
            label: "作者名称",
            component: {
              name: "div",
              text: "es: {{$root}}.author"
            },
            value: "我不需要提交(我前面有一个占位空间，所以我掉下来)",
            col: 12
          },
          status: {
            label: "状态",
            component: {
              name: "el-switch"
            },
            value: true
          },
          bgTitle: {
            isTmp: true,
            label: false,
            rowSpace: 30,
            component: {
              name: title,
              props: {
                text: "背景设置"
              }
            },
            value: ""
          },
          bgColor: {
            label: "颜色",
            component: "el-color-picker",
            value: "#409EFF"
          },

          fontTitle: {
            isTmp: true,
            label: false,
            rowSpace: 30,
            component: {
              name: title,
              props: {
                text: "字体设置",
                color: "es: {{$root}}.fontColor"
              }
            },
            value: ""
          },
          fontColor: {
            label: "颜色",
            component: "el-color-picker",
            value: "#409EFF"
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
