<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      字段component.actions
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
import select from "@/components/units/select";
export default {
  data() {
    return {
      title: "组件行为/事件",

      formSchema: {
        properties: {
          isGood: {
            label: "",
            component: {
              name: "el-checkbox",
              text: "是否好人",
              actions: {
                trigger: "change",
                handler: function(options) {
                  console.log("this对象: ", this);
                  console.log("options对象: ", options);
                  // console.log('this.getRef("desc")值: ', this.getRef("desc"));
                  // console.log("value值", value);
                  // console.log("key值", key);
                  // console.log("event值", event);
                  // console.log("\n");
                  // this.submit();
                  this.$message({
                    message: "切换为: " + options.value,
                    type: "success"
                  });
                }
              }
            },
            value: true,
            col: 12
          },

          search: {
            label: "搜索条件1",
            component: {
              name: "el-input",
              props: {
                placeholder: "输入用户名"
              },
              actions: "@enterSubmit"
            },
            desc: "@enterSubmit说明按下enter键就提交表单事件",
            value: ""
          },

          isAudited1: {
            label: "审核条件1",
            component: {
              name: select,
              props: {
                options: [
                  {
                    id: 0,
                    text: "所有"
                  },
                  {
                    id: 1,
                    text: "已审核"
                  },
                  {
                    id: 2,
                    text: "未审核"
                  }
                ]
              },
              actions: "change=@submit"
            },
            desc: "change=@submit说明组件触发了change事件就提交表单",
            value: 0
          },

          isAudited2: {
            label: "审核条件2",
            component: {
              name: select,
              props: {
                options: [
                  {
                    id: 0,
                    text: "所有"
                  },
                  {
                    id: 1,
                    text: "已审核"
                  },
                  {
                    id: 2,
                    text: "未审核"
                  }
                ]
              },
              actions: {
                trigger: "change",
                handler: function() {
                  this.submit();
                }
              }
            },
            desc: "上面就是我的简写",
            value: 0
          },

          desc: {
            label: "多个事件",
            component: {
              name: "el-input",
              props: {
                placeholder: "打开浏览器的开发者模式看事件的打印结果"
              },
              // ref: "desc",
              // actions: {
              //   trigger: "input.native",
              //   handler: function(value, key, event) {
              //     console.log("value: ", value, event);
              //   }
              // }
              actions: [
                "@enterSubmit",
                {
                  trigger: "input",
                  handler: function(value, key, event) {
                    console.log("input事件: ", value, key, event);
                  }
                },
                {
                  trigger: "change",
                  handler: function(value, key, event) {
                    console.log("change事件: ", value, key, event);
                  }
                }
              ]
            },
            desc: "多个事件事actions写成一个数组",
            value: ""
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

<style lang="scss">
@import "@/static/css/mixins.scss";
.actions-details {
  @include display-flex;
  @include direction-h;
  line-height: 14px;
  font-size: 12px;
}
</style>
