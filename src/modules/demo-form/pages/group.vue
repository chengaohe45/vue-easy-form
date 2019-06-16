<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      字段group：设置此值说明相邻且同值(注意是相邻且同值)的项为一组，不换行,
      组件（注意是组件，不是label）会按比例分配空间;
      (这一组的长度就是里面的每一项col相加起来，相加起来后大于24就取24，因为一行只分24列)
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
// import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "分组设置",

      formSchema: {
        name: {
          label: "广告名称",
          component: "el-input",
          value: "首页位置",
          col: 12
        },
        pholder1: {
          layout: "space",
          col: 1
        },

        startTime: {
          label: {
            name: "div",
            text: "有效年份"
          },
          group: "date",
          col: 10,
          // offsetLeft: 30,
          // offsetRight: 30,
          component: {
            name: "el-date-picker",
            props: {
              type: "year",
              valueFormat: "yyyy"
            },
            size: "auto"
          },
          rules: true,
          unit: "年",
          value: ""
        },
        endTime: {
          label: {
            // name: "span",
            text: "到",
            size: "fixed"
          },
          group: "date",
          col: 10,
          offsetLeft: 10,
          offsetRight: 10,
          component: {
            name: "el-date-picker",
            props: {
              type: "year",
              valueFormat: "yyyy"
            },
            size: "auto"
          },
          rules: {
            required: true
          },
          unit: "年",
          value: "",
          help: "最好选择00后"
        },

        author: {
          label: "作者名称",
          component: {
            name: "el-input",
            props: {
              placeholder: "请输入作者的名字"
            }
          },
          value: "",
          rules: true
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
