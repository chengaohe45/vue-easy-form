<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      字段properties且type为tabs
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "@/components/demo-frame/index.vue";

export default {
  data() {
    return {
      title: "子属性(tabs布局)设置",

      formSchema: {
        properties: {
          isOpen: {
            label: "是否打开",
            component: "el-switch",
            value: true
          },
          test1: {
            layout: {
              name: "tabs",
              padding: "20px 10px"
            },
            title: "tabs类型(card)",
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
                array: {
                  value: [
                    {
                      startTime: "2019-06-11 12:00:00",
                      endTime: "2019-06-21 12:00:00"
                    }
                  ]
                },
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
                      flex: "full",
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
                      flex: "self"
                    },
                    group: "date",
                    col: 12,
                    component: {
                      name: "el-date-picker",
                      props: {
                        type: "datetime",
                        valueFormat: "yyyy-MM-dd hh:mm:ss"
                      },
                      flex: "full"
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
                    // col: 12,
                    label: {
                      text: "体重"
                    },
                    component: {
                      name: "el-input-number",
                      flex: "self"
                    },
                    unit: "公斤",
                    value: 100
                  }
                }
              },

              district: {
                hidden: "es: {{$hidden(test1.base)}}",
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
                hidden: "es: {{$hidden(test1.district)}}",
                hdValue: null,
                ui: {
                  type: "bg-block",
                  showBody: true
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
                  required: "es: {{$hidden(test1.base)}}"
                },
                desc: "描述",
                help: "知道了"
              }
            }
          },

          test2: {
            layout: {
              name: "tabs",
              type: "bg"
              // hasBorder: false
            },
            title: "tabs类型(bg)",
            rowSpace: 20,
            label: "",
            properties: {
              base: {
                label: "基本信息",
                hidden: "es: {{$hidden(test1.district)}}",
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
                      flex: "full",
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
                      flex: "self"
                    },
                    group: "date",
                    col: 12,
                    component: {
                      name: "el-date-picker",
                      props: {
                        type: "datetime",
                        valueFormat: "yyyy-MM-dd hh:mm:ss"
                      },
                      flex: "full"
                    },
                    value: ""
                  }
                }
              },

              target: {
                label: "投放目标",
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
                      flex: "full"
                    },
                    unit: "公斤",
                    value: 100
                  }
                }
              }
            }
          },

          test3: {
            layout: {
              name: "tabs",
              type: "line",
              hasBorder: false
            },
            title: "tabs类型(line)",
            rowSpace: 20,
            label: "",
            properties: {
              base: {
                label: "基本信息",
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
                      flex: "full",
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
                      flex: "self"
                    },
                    group: "date",
                    col: 12,
                    component: {
                      name: "el-date-picker",
                      props: {
                        type: "datetime",
                        valueFormat: "yyyy-MM-dd hh:mm:ss"
                      },
                      flex: "full"
                    },
                    value: ""
                  }
                }
              },

              target: {
                label: "投放目标",
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
                      flex: "full"
                    },
                    unit: "公斤",
                    value: 100
                  }
                }
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

<style lang="scss"></style>
