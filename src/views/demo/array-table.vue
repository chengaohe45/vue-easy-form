<template>
  <demo-frame
    :title="title"
    :formSchema="formSchema"
    :docsTitle="docsTitle"
    :docsHref="docsHref"
  >
    <div slot="details">
      字段array
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "@/components/demo-frame/index.vue";

export default {
  data() {
    return {
      title: "表格数组",
      docsTitle: "数组配置文档",
      docsHref: "/vue-easy-form-docs/dist/base/array.html",

      formSchema: {
        ui: {
          colon: true,
          rowSpace: 20
        },
        properties: {
          name: {
            label: "我的姓名",
            component: "el-input",
            value: "小明"
          },
          // table数组
          experiences: {
            title: "求学经历",
            label: false,
            ui: {
              rowHeight: 32
            },
            array: {
              // 数组配置
              name: "array-table",
              // hasOrder: true,
              // hasDelete: true,
              hasSort: true,
              hasAdd: true,
              // hasCopy: true,
              hasDelWarn: false,
              // hasAdd: false,
              fixed: 1,
              min: 2,
              max: 5,
              headRequired: true,
              value: [
                { school: "四中", address: "广州" },
                { school: "交大", address: "上海" },
                { school: "清华", address: "北京" }
              ]
            },

            properties: {
              school: {
                col: 8,
                label: {
                  name: "div",
                  text: "学校名",
                  align: "left"
                },
                component: {
                  name: "el-input",
                  props: {
                    size: "small"
                  }
                },
                rules: {
                  required: true,
                  emptyMsg: "请输入学校名"
                },
                help: {
                  hidden: "es: $index !== 0",
                  props: {
                    content: "我在外面-演示帮助: 第1条固定（fixed为1）"
                  }
                },
                value: "默认名"
              },
              address: {
                col: 12,
                label: {
                  text: "地址",
                  help: "我在label里面：代号"
                },
                component: {
                  name: "el-input",
                  props: {
                    size: "small"
                  }
                },
                value: "默认地址"
              }
            },
            desc: "提示： 最多只能添加5条数据"
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
