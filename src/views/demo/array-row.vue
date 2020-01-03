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
      title: "行数组",
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

          // 行数组
          courses: {
            title: "我的课程",
            label: false,
            ui: {
              rowHeight: 32,
              labelWidth: 80
            },
            array: {
              // 数组配置
              name: "array",
              hasOrder: false,
              hasDelete: true,
              hasSort: true,
              hasAdd: true,
              hasCopy: true,
              hasDelWarn: true,
              rowSpace: 12,
              value: [{ subject: "语文", code: "1" }],
              rules: {
                // 默认
                required: true,
                emptyMsg: "课程不能为空",
                checks: {
                  trigger: "", // 不写就是提交时再验证
                  handler: function(data) {
                    var list = data.value; // 列表的值
                    for (var i = 0; i < list.length; i++) {
                      var item = list[i];
                      if (!item.subject) {
                        return "课程名不能为空";
                      } else if (!item.code) {
                        return "代号不能为空";
                      } else if (
                        item.subject.indexOf("默认") >= 0 ||
                        item.code.indexOf("默认") >= 0
                      ) {
                        return '课程名和代号都不能存在"默认"两字';
                      }
                    }
                    return true;
                  }
                }
              },
              insertValue: function(options) {
                // 插入(添加/拷贝)时对插入值的处理
                if (options.type === "copy") {
                  // 只做拷贝
                  var targetValue = options.oldValues[options.position - 1];
                  targetValue.subject = "拷贝后的修改值";
                  return targetValue;
                }
              }
            },

            properties: {
              subject: {
                value: "默认名",
                col: 12,
                label: "学科名",
                component: {
                  name: "el-input",
                  props: {
                    size: "small"
                  }
                }
              },
              code: {
                col: 12,
                label: "代号",
                component: {
                  name: "el-input",
                  props: {
                    disabled: "es:!{{$root.courses[i].subject}}", // 动态解析: 注意[i]在大括号里面
                    size: "small"
                  }
                },
                value: "默认代号"
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
