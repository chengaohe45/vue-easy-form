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
import desc from "@/components/units/desc";
export default {
  data() {
    return {
      title: "描述",
      docsTitle: "描述配置文档",
      docsHref: "/vue-easy-form-docs/dist/base/desc.html",

      formSchema: {
        // 写法一
        name: {
          label: "广告名称",
          component: "el-input",
          value: "首页位置",
          desc: "一般的描述方法" // 也可以直接写动态解析，如es语句
        },

        isJson: {
          label: "传输格式",
          component: "el-switch",
          value: true
        },

        // 写法二
        data: {
          label: "传输数据",
          component: "el-input",
          value: "",
          desc: {
            // hidden: false,   // 控制desc是否隐藏，支持动态解析
            text: "es: {{$root}}.isJson ? 'JSON格式' : 'XML格式'" // es语句
          }
        },

        // 写法三：组件写法
        note: {
          label: "备注",
          component: "el-input",
          value: "",
          desc: {
            hidden: "es: !{{$root}}.isJson", // es语句, 控制desc是否隐藏
            name: desc, // desc是import导入的局部组件
            props: {}
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
