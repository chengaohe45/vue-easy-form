<template>
  <demo-frame
    :title="title"
    :formSchema="formSchema"
    :docsTitle="docsTitle"
    :docsHref="docsHref"
  >
  </demo-frame>
</template>

<script>
import demoFrame from "@/components/demo-frame/index.vue";
// import Select from "@/components/units/select";
export default {
  data() {
    return {
      title: "项组件",
      docsTitle: "项组件配置文档",
      docsHref: "/vue-easy-form-docs/dist/base/component.html",

      formSchema: {
        // 写法一
        name: {
          label: "广告名称",
          component: "el-input", // 全局组件名；不写的话，采用系统默认的
          value: "首页位置"
        },

        // 写法二：组件写法
        target: {
          label: "投放目标",
          component: {
            name: "el-input",
            props: {
              placeholder: "请输入投放目标"
            }
            // ref: "testRef",   // 索引值，可以通过 form.getRef('testRef')取出
            // actions: [],       // 见下面
            // value: "首页位置"   // 组件的默认值
          },
          value: "中年人" // 组件的默认值也可写在这里，优先级高于component.value
        },

        // 以下是其它属性，见注释
        color: {
          label: {
            text: "主题颜色",
            align: "center" // 文本居中
          },
          direction: "v", // 上下排版
          component: {
            name: "el-color-picker",
            flex: "self", // 设置了flex=self是为了项组件区域的宽度就是组件的宽度
            align: "center" // 组件居中
          },
          value: "#67C23A",
          desc: {
            name: "div",
            style: {
              textAlign: "center"
            },
            text: "设置了flex=self是为了项组件区域的宽度就是组件的宽度"
          }
        },

        regions: {
          label: "投放区域",
          component: {
            name: "g-select", // g-select是自定义全局组件；也可以是import导入的局部组件
            props: {
              placeholder: "请选择活动区域",
              clearable: true,
              multiple: true,
              options: [
                { text: "广东", id: "广东id" },
                { text: "北京", id: "北京id" }
              ]
            },
            flex: "full" // 设置了flex=full是为了使组件的宽度占满整个项区域
          },
          value: [],
          col: 18,
          desc: "设置了flex=full是为了使组件的宽度占满整个项组件区域"
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
