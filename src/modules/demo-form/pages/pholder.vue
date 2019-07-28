<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      写法跟写一个平常组件一样：<br />
      layout有两个值："space", "tabs"; 区分大小写；其余的认为是false<br />
      当layout为'space'时,说明这个是占位空间，此值不会取出，label也不会显示（有效值只有col,hidden,
      group;其余的失效）
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
// import title from "@/components/units/title";
export default {
  data() {
    return {
      title: "占位空间",

      formSchema: {
        ui: {
          colon: true,
          rowSpace: 20
        },
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
            rowHeight: 22,
            component: {
              name: "div",
              text: "es: {{$root}}.author"
              // style: {
              //   color: "red"
              // },
              // class: "haha hah"
            },
            value: "我不需要提交(前面有一个占位空间，所以掉下来)",
            col: 12
          },
          status: {
            label: "状态",
            rowHeight: 22,
            component: {
              name: "el-switch"
            },
            value: true
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
