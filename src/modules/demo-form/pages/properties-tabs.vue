<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      字段properties且type为tabs:
      properties的字节点也必须为properties，否则过滤掉。
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
// import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "子属性(tabs布局)设置",

      formSchema: {
        properties: {
          isOpen: {
            label: "是否打开",
            component: "el-switch",
            value: false
          },
          test: {
            layout: {
              name: "tabs"
              // type: "bg",
              // hasBorder: false
            },
            title: "数据",
            label: "",
            properties: {
              base: {
                // isTmp: true,
                ui: {
                  showBody: true
                },
                title: {
                  text: "基本信息"
                },
                hidden: "es: !{{$root}}.isOpen",
                label: "基本信息",
                array: {},
                rules: {
                  required: true
                },
                properties: {
                  startTime: {
                    label: "上线时间",
                    group: "date",
                    // col: 12,
                    component: {
                      name: "el-date-picker",
                      props: {
                        type: "datetime",
                        valueFormat: "yyyy-MM-dd hh:mm:ss"
                      },
                      size: "auto",
                      ref: "test"
                    },
                    rules: {
                      required: true
                    },
                    value: ""
                  },
                  endTime: {
                    label: {
                      text: "到",
                      size: "fixed"
                    },
                    group: "date",
                    col: 12,
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
                // hidden: "es: !{{$root}}.isOpen",
                hdValue: null,
                ui: {
                  type: "bg-border"
                },
                title: {
                  text: "投放目标"
                },
                label: "es: {{$root}}.isOpen ? '投放目标' : false",
                properties: {
                  name: {
                    label: "姓名",
                    component: {
                      name: "el-input"
                    },
                    rules: {
                      required: true
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
                hidden: "es: {{$hidden(test.base)}}",
                ui: {
                  type: "bg-block-border"
                },
                title: {
                  text: "投放地区"
                },
                label: "投放地区",
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
                hidden: "es: {{$hidden(test.district)}}",
                hdValue: null,
                ui: {
                  type: "bg-block",
                  showBody: false
                },
                title: {
                  text: "更多设置"
                },
                label: "更多设置",
                properties: {
                  whitelist: {
                    label: "白名单",
                    component: {
                      name: "el-input"
                    },
                    value: "xiaoming.lo"
                  }
                }
              },

              bak: {
                label: {
                  name: "div",
                  text: "备用"
                },
                rules: {
                  required: "es: {{$hidden(test.base)}}"
                },
                desc: "最多36个文字",
                help: "I know"
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
