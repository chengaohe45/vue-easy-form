<template>
  <div class="home-box">
    <el-button @click="clickHandler">getRef</el-button>
    <!-- <div style="width: 90%;">
      <tabsNav>
        <tabsItem :tabsName="'tabs1'" :is-active="false"></tabsItem>
        <tabsItem :tabsName="'tabs2'" :is-active="true"></tabsItem>
        <tabsItem :tabsName="'tabs3'" :is-active="false"></tabsItem>
        <tabsItem :tabsName="'tabs3'" :is-active="false"></tabsItem>
        <tabsItem :tabsName="'tabs3'" :is-active="false"></tabsItem>
        <tabsItem :tabsName="'tabs3'" :is-active="false"></tabsItem>
        <tabsItem :tabsName="'tabs3'" :is-active="false"></tabsItem>
        <tabsItem :tabsName="'tabs3'" :is-active="false"></tabsItem>
        <tabsItem :tabsName="'tabs3'" :is-active="false"></tabsItem>
      </tabsNav>
    </div> -->
    <!-- <el-input
      v-model="gameName"
      @change.native="testChangeNative"
      @change="testChange"
      @input="testInput"
      placeholder="游戏名称"
      class="w120"
    ></el-input>
    <native @keyup.native="testSubmit"></native> -->
    <es-form ref="form" :schema="schema"></es-form>
  </div>
</template>

<script>
// import utils from "../../libs/utils";
import tabsNav from "@/package/components/tabs-nav";
import tabsItem from "@/package/components/tabs-nav-item";
// import native from "../components/native";
export default {
  data() {
    return {
      input: undefined,
      gameName: "",
      schema: {
        test: {
          label: "your test",
          component: {
            name: "el-input",
            ref: "test",
            props: {
              placeholder: "Basic usage"
            },
            text: "1"
          },
          rules: {
            required: true,
            class: {
              a: true,
              b1: false
            },
            checks: {
              trigger: "true",
              handler: function() {
                return "errofr";
              }
            }
          },
          array: {
            value: ["123"],
            hasSort: true,
            hasCopy: true,
            rules: {
              required: true,
              checks: {
                trigger: ["input1"],
                handler: function() {
                  return "erro22222fr";
                }
              }
            }
          },

          value: "首页位置"
        },

        test2: {
          // hidden: true,
          array: {
            value: [{ test21: "21", test22: "22" }],
            hasSort: true,
            hasCopy: true,
            rules: {
              required: true,
              checks: {
                trigger: ["input1"],
                handler: function() {
                  return "erro22222fr";
                }
              }
            }
          },

          properties: {
            test21: {
              label: "test21",
              component: {
                name: "el-input",
                ref: "test21",
                props: {
                  placeholder: "Basic usage"
                },
                text: "1"
              },
              rules: {
                required: true,
                class: {
                  a: true,
                  b1: false
                },
                checks: {
                  trigger: "true",
                  handler: function() {
                    return "errofr";
                  }
                }
              },

              col: 12,

              value: "首页位置"
            },

            test22: {
              hidden: "es: $index%2 ? true : false",
              label: "test22",
              component: {
                ref: "test",
                name: "el-input",
                props: {
                  placeholder: "Basic usage"
                },
                text: "1"
              },

              col: 12,

              value: "首页位置"
            },

            test3: {
              // hidden: true,
              array: {
                value: [{ test21: "21", test22: "22" }],
                hasSort: true,
                hasCopy: true,
                rules: {
                  required: true,
                  checks: {
                    trigger: ["input1"],
                    handler: function() {
                      return "erro22222fr";
                    }
                  }
                }
              },

              properties: {
                test31: {
                  label: "test31",
                  component: {
                    name: "el-input",
                    ref: "test31",
                    props: {
                      placeholder: "Basic usage"
                    },
                    text: "1"
                  },
                  rules: {
                    required: true,
                    class: {
                      a: true,
                      b1: false
                    },
                    checks: {
                      trigger: "true",
                      handler: function() {
                        return "errofr";
                      }
                    }
                  },

                  col: 12,

                  value: "首页位置"
                },

                test32: {
                  hidden: "es: $index%2 || $root.checkbox ? true : false",
                  label: "test32",
                  component: {
                    ref: "test",
                    name: "el-input",
                    props: {
                      placeholder: "Basic usage"
                    },
                    text: "1"
                  },

                  col: 12,

                  value: "首页位置"
                }
              }
            }
          }
        },

        name: {
          hidden: "es: !!$root.checkbox",
          label: "div",
          component: {
            name: "input",
            // ref: "name",
            props: {
              value: "344"
            },
            value: "??????",
            text: "首页位置"
          }
        },
        // input: {
        //   label: "input",
        //   component: {
        //     name: "input",
        //     value: "首页位置",
        //     actions: [
        //       {
        //         trigger: "input",
        //         handler: function() {
        //           console.log("update:modelValue");
        //         }
        //       }
        //     ]
        //   }
        // },
        checkbox: {
          label: "checkbox",
          component: {
            name: "input",
            props: {
              type: "checkbox"
            },
            value: true
            // actions: [
            //   {
            //     trigger: "input",
            //     handler: function() {
            //       console.log("update:modelValue");
            //     }
            //   }
            // ]
          }
        },
        radio: {
          // hidden: "es: !!$root.checkbox",
          label: "radio",
          component: {
            name: "input",
            props: {
              type: "radio",
              value: false
            },
            value: false,
            actions: [
              {
                trigger: "update:modelValue",
                handler: function() {
                  console.log("update:modelValue");
                }
              }
            ]
          }
        }
        // textarea: {
        //   label: "textarea",
        //   component: {
        //     name: "textarea",
        //     props: {
        //       // type: "radio",
        //       // value: false
        //     },
        //     value: "true",
        //     actions: [
        //       {
        //         trigger: "input",
        //         handler: function() {
        //           console.log("update:modelValue");
        //         }
        //       }
        //     ]
        //   }
        // },
        // "el-input": {
        //   label: "el-input",
        //   component: {
        //     name: "el-input",
        //     props: {
        //       placeholder: "Basic usage"
        //     },
        //     model: "value",
        //     actions: [
        //       {
        //         trigger: "update:value",
        //         handler: function() {
        //           console.log("123...");
        //         }
        //       },
        //       {
        //         trigger: "change.native",
        //         handler: function() {
        //           console.log(1243);
        //         }
        //       },
        //       // "@enterSubmit",
        //       // "change=@submit"
        //     ]
        //   },
        //   rules: {
        //     required: true,
        //     checks: 222
        //   },
        //   value: "首页位置"
        // }
      }
    };
  },

  computed: {},

  mounted() {},

  methods: {
    testSubmit($event) {
      console.log("$event2: ", $event); // 测试证明：只要是组件，.native都成功；
    },
    testChangeNative() {
      console.log("testChangeNative...");
    },
    testChange() {
      console.log("testChange...");
    },
    testInput() {
      console.log("testInput...");
    },
    clickHandler() {
      // console.log("value:", value, arguments);
      // this.$emit("add-item", 123);
      console.log("result:", this.$refs.form.getRef("test", true, "0,0"));
    }
  },
  components: {
    tabsNav,
    tabsItem,
    // native
  }
};
</script>

<style lang="scss">
@import "@/static/css/mixins.scss";
.home-box {
  // @include display-center;
  // font-size: 50px;
  height: 100%;
}
</style>
