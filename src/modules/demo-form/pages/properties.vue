<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      字段properties: 当存在这个字段时，说明存在下一级；若同时存在component,
      component将失效
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
// import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "子属性(块)设置",

      formSchema: {
        properties: {
          name: {
            label: "广告名称",
            component: "el-input",
            value: "首页位置"
            // col: 12
          },

          base: {
            ui: {
              showBody: true
            },
            title: {
              text: "基本信息"
            },
            label: false,
            properties: {
              startTime: {
                label: "上线时间",
                group: "date",
                col: 10,
                component: {
                  name: "el-date-picker",
                  props: {
                    type: "datetime",
                    valueFormat: "yyyy-MM-dd hh:mm:ss"
                  },
                  size: "auto"
                },
                value: ""
              },
              endTime: {
                label: {
                  text: "到",
                  size: "fixed"
                },
                group: "date",
                col: 10,
                component: {
                  name: "el-date-picker",
                  props: {
                    type: "datetime",
                    valueFormat: "yyyy-MM-dd hh:mm:ss"
                  },
                  size: "auto"
                },
                value: ""
              }
            }
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
                label: "姓名",
                component: {
                  name: "el-input"
                },
                value: "kyle.lo"
              },
              weight: {
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
              type: "bg-block-border"
            },
            title: {
              text: "投放地区"
            },
            label: false,
            properties: {
              province: {
                label: "省份",
                component: {
                  name: "el-input"
                },
                value: "广东省"
              }
            }
          },

          more: {
            ui: {
              type: "bg-block",
              showBody: false
            },
            title: {
              text: "更多设置"
            },
            label: false,
            properties: {
              whitelist: {
                label: "白名单",
                component: {
                  name: "el-input"
                },
                value: "xiaoming.lo"
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
