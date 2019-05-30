<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      <!-- ?? -->
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
// import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "行数组",

      formSchema: {
        properties: {
          name: {
            label: "名称",
            array: {
              name: "array-tabs",
              // type: "bg",
              hasOrder: true,
              hasDelete: true,
              hasSort: true,
              hasAdd: true,
              // fixed: 1,
              // max: 5,
              value: ["名称1", "名称2"],
              rules: true,
              actions: {
                trigger: "change",
                handler: function(value, key, event) {
                  console.log("input change: ", value, key, event);
                }
              }
            },
            component: "el-input",
            // col: 15,
            value: "小明",
            rules: true,
            unit: "px",
            desc: "名称就是这样子",
            help: "帮助就是这样子"
          },
          courses: {
            layout: {
              name: "tabs",
              type: "line",
              hasBorder: false
            },
            title: {
              text: "我的课程",
              type: "bg-border",
              showBody: true
            },
            label: "",
            // col: 15,

            array: {
              name: "array-tabs",
              type: "bg",
              hasBorder: false,
              subLabel:
                "es: ({{$root}}.courses[{{$index}}].name) ? ( ({{$root}}.courses[{{$index}}].name.length <=5 ? {{$root}}.courses[{{$index}}].name : {{$root}}.courses[{{$index}}].name.substr(0, 5) + '...') ) : '[未命名]'",
              // hasOrder: false,
              // hasDelete: true,
              hasSort: true,
              // hasAdd: true
              // hasDelWarn: false,
              // fixed: 1,
              // min: 3
              // max: 5,
              value: [
                { name: "语文", code: 78 },
                { name: "高数", code: 98 },
                { name: "哲学政治", code: 44 },
                { name: "英语", code: 77 },
                { name: "体育", code: 99 },
                { name: "经济学", code: 44 },
                { name: "管理学", code: 55 }
              ]
            },
            boxRowHeight: 32,
            properties: {
              name: {
                value: "默认名",
                direction: "h",
                col: 12,
                label: "es: '学科名' + ({{$index}} + 1)",
                component: {
                  name: "el-input",
                  props: {
                    disabled:
                      "es:!{{$root.courses[i].code}} || {{$index}} == 0",
                    size: "small"
                  }
                }
              },
              code: {
                value: "100",
                // direction: "v",
                col: 12,
                label: {
                  text: "代号"
                },
                component: {
                  name: "el-input",
                  props: {
                    size: "small"
                  },
                  actions: {
                    trigger: "input",
                    handler: function(value, pathkey) {
                      console.log("value: ", value);
                      console.log("pathkey: ", pathkey);
                    }
                  }
                },
                rules: {
                  required: true
                }
              }
            },
            desc: "提示： 最多只能添加5条数据"
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
