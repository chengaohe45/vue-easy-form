<template>
  <demo-frame :title="title" :formSchema="formSchema" :hasConsole="hasConsole">
    <!-- <div slot="details"></div> -->
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
// import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "Es/函数化写法",
      hasConsole: true,

      formSchema: {
        ui: {
          rowSpace: 20
        },
        properties: {
          isOpen: {
            label: "开关切换",
            component: "el-switch",
            value: false
          },

          esMethod: {
            ui: {
              type: "bg",
              hasBorder: true,
              rowSpace: 10
            },
            title: {
              text: "es写法"
            },
            label: false,
            properties: {
              name: {
                label: "姓名",
                component: {
                  name: "el-input",
                  props: {
                    disabled: "es: {{$root}}.isOpen",
                    placeholder: "开关打开我就不可写"
                  }
                },
                value: ""
              },
              level1: {
                label: "es级别1",
                hidden: "es: {{$root}}.isOpen",
                component: {
                  name: "el-input",
                  props: {
                    placeholder: "开关打开我就隐藏"
                  }
                },
                value: ""
              },
              level2: {
                label: "es级别2",
                hidden: "es: {{$hidden('esMethod[\"level1\"]')}}",
                component: {
                  name: "el-input",
                  props: {
                    placeholder: "es级别1隐藏我就跟着隐藏"
                  }
                },
                value: ""
              },
              level3: {
                label: "es级别3",
                hidden: "es: {{$hidden('esMethod.level2')}}",
                component: {
                  name: "el-input",
                  props: {
                    placeholder: "es级别2隐藏我就跟着隐藏"
                  }
                },
                value: ""
              }
            }
          },

          funcMethod: {
            ui: {
              type: "bg",
              rowSpace: 10,
              hasBorder: true
            },
            title: {
              text: "函数写法"
            },
            label: false,
            properties: {
              name: {
                label: "姓名",
                component: {
                  name: "el-input",
                  props: {
                    disabled: function(options) {
                      return options.rootData.isOpen;
                    },
                    placeholder: "开关打开我就不可写"
                  }
                },
                value: ""
              },
              level1: {
                label: "函数级别1",
                hidden: function(options) {
                  return options.rootData.isOpen;
                },
                component: {
                  name: "el-input",
                  props: {
                    placeholder: "开关打开我就隐藏"
                  }
                },
                value: ""
              },
              level2: {
                label: "函数级别2",
                hidden: function(options) {
                  var $hidden = options.$hidden;
                  return $hidden("funcMethod.level1");
                },
                component: {
                  name: "el-input",
                  props: {
                    placeholder: "函数级别1隐藏我就跟着隐藏"
                  }
                },
                value: ""
              },
              level3: {
                label: "函数级别3",
                hidden: function(options) {
                  var $hidden = options.$hidden;
                  return $hidden("funcMethod.level2");
                },
                component: {
                  name: "el-input",
                  props: {
                    placeholder: "函数级别2隐藏我就跟着隐藏"
                  }
                },
                value: ""
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
