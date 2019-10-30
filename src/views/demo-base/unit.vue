<template>
  <demo-frame
    class="demo-frame"
    :title="title"
    :formSchema="formSchema"
    :docsTitle="docsTitle"
    :docsHref="docsHref"
  >
    <div slot="details">
      <div>字段unit: 对组件进行补充，一般用于单位</div>
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "@/components/demo-frame/index.vue";
import unit from "./components/unit";
export default {
  data() {
    return {
      title: "单位",
      docsTitle: "单位配置文档",
      docsHref: "/vue-easy-form-docs/dist/base/unit.html",

      formSchema: {
        properties: {
          startAge: {
            label: "适合人群",
            group: "date",
            col: 12,
            component: {
              name: "el-input-number",
              flex: "full"
            },
            value: 15
            // unit: "es: {{$root}}.startAge > 15 ? '岁' : ''"
          },
          endAge: {
            label: {
              text: "到",
              flex: "self"
            },
            group: "date",
            col: 12,
            component: {
              name: "el-input-number",
              flex: "full"
            },
            value: 20,
            unit: "岁"
          },
          esType: {
            label: "es方法",
            component: {
              name: "el-slider",
              props: {
                min: 10,
                max: 99
              }
            },
            value: 50,
            // col: 12,
            unit: "es: '单位' + {{$root.esType}}"
          },
          comType: {
            label: "组件方法",
            component: {
              name: "el-slider",
              props: {
                min: 10,
                max: 99
              }
            },
            value: 80,
            // col: 12,
            unit: {
              name: unit,
              props: {
                num: "es: {{$root.comType}}"
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
