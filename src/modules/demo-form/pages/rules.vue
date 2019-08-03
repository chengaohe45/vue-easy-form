<template>
  <demo-frame
    :title="title"
    :formSchema="formSchema"
    :docsTitle="docsTitle"
    :docsHref="docsHref"
  >
    <div slot="details">
      <div>
        字段rules
      </div>
      <div>提交时判断表单是否合法则用：form.checkAll()</div>
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
// import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "表单验证",
      docsTitle: "表单验证文档",
      docsHref: "/vue-easy-form-docs/dist/base/rules.html",

      formSchema: {
        properties: {
          name1: {
            label: "姓名1",
            component: "el-input",
            value: "首页位置",
            col: 18,
            rules: {
              required: true,
              emptyMsg: "名称不能为空"
            }
          },
          name2: {
            label: "姓名2",
            component: "el-input",
            value: "首页位置",
            col: 18,
            rules: true,
            desc: "简写：rules=true"
          },

          isOpen: {
            label: "开关",
            component: "el-switch",
            value: true
          },

          name3: {
            label: "姓名3",
            component: {
              name: "el-input",
              props: {
                placeholder: "切换开关试试"
              }
            },
            value: "",
            col: 18,
            rules: {
              required: "es: {{$root}}.isOpen",
              emptyMsg: "名称不能为空"
            },
            desc: "required支持es语法"
          },

          mobile: {
            label: "手机号码",
            component: {
              name: "el-input",
              props: {
                placeholder: "请输入11位手机号码"
              }
            },
            value: "",
            col: 18,
            rules: {
              checks: {
                handler: function(options /*, formData, key*/) {
                  console.log("options: ", options);
                  // console.log("formData: ", formData);
                  // console.log("key: ", key);
                  var reg = /^1\d{10}$/;
                  return reg.test(options.value);
                },
                trigger: "change"
              },
              errMsg: "手机号码为11位"
            }
          },
          age: {
            label: "年龄",
            col: 18,
            component: "el-input-number",
            value: 10,
            rules: {
              checks: {
                handler: "es: {{$root.age}}>=10",
                trigger: "change"
              },
              errMsg: "年龄不能小于10"
            },
            desc: "checks.handler支持es(这里不能小于10)"
          },
          desc: {
            label: "广告描述",
            component: {
              name: "el-input",
              props: {
                type: "textarea",
                autosize: { minRows: 3, maxRows: 5 },
                placeholder: "大于10个字试试"
              }
            },
            value: "",
            rules: {
              checks: ({ value }) => {
                if (value && value.length > 10) {
                  return "广告描述字数不能多于10";
                } else {
                  return true;
                }
              },
              errMsg: "广告描述输入有误"
            },
            desc: "rules.checks内返回字符串，也即是错误信息"
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
.rules-details {
  @include display-flex;
  @include direction-h;
  line-height: 14px;
  font-size: 12px;
}
</style>
