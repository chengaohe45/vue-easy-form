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

          // legend数组
          classmates: {
            title: "我的同学",
            label: false,
            ui: {
              rowHeight: 32,
              labelWidth: 80,
              rowSpace: 12,
              offsetRight: 130
            },
            array: {
              // 数组配置
              name: "array-legend",
              hasOrder: false,
              hasDelete: true,
              hasSort: true,
              hasAdd: true,
              hasCopy: true,
              hasDelWarn: true,
              rowSpace: 12,
              value: [{ name: "大宝", code: "1" }, { name: "小宝", code: "2" }],
              insertValue: function(options) {
                // 插入(添加/拷贝)时对插入值的处理
                if (options.type === "copy") {
                  // 只做拷贝
                  var targetValue = options.oldValues[options.position - 1];
                  targetValue.name = "拷贝后的修改值";
                  return targetValue;
                }
              }
            },

            properties: {
              name: {
                value: "默认名",
                col: 24,
                label: "同学名",
                component: {
                  name: "el-input",
                  props: {
                    size: "small"
                  }
                }
              },
              code: {
                col: 24,
                label: "学号",
                component: {
                  name: "el-input",
                  props: {
                    disabled: "es:!{{$root.classmates[i].name}}", // 动态解析: 注意[i]在大括号里面
                    size: "small"
                  }
                },
                value: "默认代号"
              }
            }
          },

          // 卡片数组
          works: {
            label: "我的作品集",
            array: {
              // 数组配置
              name: "array-card",
              hasOrder: true,
              hasDelete: true,
              hasSort: true,
              hasAdd: false,
              hasCopy: false,
              hasDelWarn: false,
              min: 1,
              // max: 5,
              value: [
                "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
                "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg"
              ],
              rowSpace: 20
            },
            component: {
              name: "el-image",
              style: { width: "100px", height: "100px" },
              props: {
                lazy: true,
                fit: "cover",
                // 使用本身的值
                src: "es: {{$root.works[i]}}" // 动态解析: 注意[i]在大括号里面
              }
            },
            value:
              "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
            desc: "我是一个组件项数组"
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
