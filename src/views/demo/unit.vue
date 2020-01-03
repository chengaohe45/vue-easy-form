<template>
  <demo-frame
    class="demo-frame"
    :title="title"
    :formSchema="formSchema"
    :docsTitle="docsTitle"
    :docsHref="docsHref"
  >
  </demo-frame>
</template>

<script>
import demoFrame from "@/components/demo-frame/index.vue";
import unit from "@/components/units/unit";
export default {
  data() {
    return {
      title: "单位",
      docsTitle: "单位配置文档",
      docsHref: "/vue-easy-form-docs/dist/base/unit.html",

      formSchema: {
        properties: {
          // 写法一
          age: {
            label: "年龄",
            col: 12,
            component: {
              name: "el-input-number",
              flex: "full"
            },
            value: 15,
            unit: "岁"
          },

          // 写法二
          esUnit: {
            label: "切换单位",
            component: {
              name: "el-slider",
              props: {
                min: 10,
                max: 99
              }
            },
            value: 50,
            unit: {
              // hidden: false,   // 是否隐藏unit
              text: "es: '单位' + {{$root.esUnit}}"
            }
          },

          // 写法三：组件写法
          comUnit: {
            label: "组件方法",
            component: {
              name: "el-slider",
              props: {
                min: 10,
                max: 99
              }
            },
            value: 80,
            unit: {
              // hidden: false,   // 是否隐藏unit
              name: unit,
              props: {
                num: "es: {{$root.comUnit}}"
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

<style lang="scss">
.demo-frame {
  .el-slider {
    margin-left: 12px;
    margin-right: 12px;
  }
}
</style>
