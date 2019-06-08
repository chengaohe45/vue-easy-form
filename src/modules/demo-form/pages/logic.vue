<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details"></div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
// import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "逻辑控制",

      formSchema: {
        properties: {
          name: {
            label: "广告名称",
            component: "el-input",
            value: "首页位置",
            col: 12,
            rules: {
              required: "es: {{$root}}.delivery ? true : false"
            }
          },
          pholder: {
            layout: "space",
            col: 12
          },
          delivery: {
            // rowHeight: 20,
            label: "简单投放",
            component: "el-switch",
            value: false,
            col: 12
          },

          target: {
            ui: {
              type: "bg-border"
            },
            title: {
              text: "投放目标"
            },
            label: false,
            properties: {
              name: {
                label: "es: {{$root}}.delivery ? '姓名' : '姓名2'",
                component: {
                  name: "el-input",
                  props: {
                    disabled:
                      "es: {{$root}}.delivery && {{$global.isOpen}} ? false : true"
                  }
                },
                value: "kyle.lo"
              },
              weight: {
                hidden: "es: {{$root}}.delivery",
                hdValue: 0,
                col: 12,
                label: {
                  text: "体重"
                },
                component: {
                  name: "el-input-number",
                  size: "fixed"
                },
                unit: "公斤",
                value: 100
              }
            }
          },

          district: {
            ui: {
              type: "bg-block-border",
              showBody: true
            },
            title: {
              text: "投放地区"
            },
            hidden: "es: {{$root}}.delivery",
            hdValue: null,
            label: false,
            properties: {
              province: {
                label: "省份",
                component: {
                  name: "el-input"
                },
                hdValue: null,
                value: "广东省"
              }
            }
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
