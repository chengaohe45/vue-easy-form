<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      <div class="rules-details">
        <div>
          <pre>
字段rules: {
            required: true,   //是否允许为空
            emptyMsg: "代号不能为空", //当requred为true时有用
            check: "isMobile",
            errMsg: "代号不能大于10"  //当check中的函数返回的值不是字符串（为false）时有效
          }
          </pre>
        </div>
        <div>
          <pre>
            check写法：
            check: "isMobile", //写法一: 直接写成一个字符串，会调用系统这个函数来检查：那么参数的值为：(value)
            check: {  //写法二: 标准写法，其中name可以是一个字符串或一个函数(形式如下)，那么参数的值为：(value, 1, 2)
              name: "isMobile", 
              params: [1, 2], // 需要给函数加的参数
              trigger: "change" // 需要给函数加的参数，默认为input; 场景：验证电话时就是光标离开时再检查;
            }, 
            check: value => { // 写法三：直接写成一个函数，系统会插入表单的值给用户进行个性化判断; 参数的值为：(value, formData, ..params),
                if (value.length > 10) {
                  // return "姓名不能大于10个字";
                  return false;
                } else {
                  return true;
                }
              }
            check: "<span v-pre>es: {{$root.age}}>10</span>", //写法四，es语句; 也可以直接写在name上
            check: ["isMobile", function(value, formData, ...)], //写法五，多个判断：也可以是标准写法组成的数组
          </pre>
        </div>
      </div>
      <div>提交时判断表单是否合法：form.checkAll()</div>
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

      formSchema: {
        properties: {
          name: {
            label: "姓名",
            component: "el-input",
            value: "首页位置",
            col: 18,
            rules: {
              required: true,
              emptyMsg: "名称不能为空"
            }
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
              check: {
                name: "isMobile",
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
              check: {
                name: "es: {{$root.age}}>=10",
                trigger: "change"
              },
              errMsg: "年龄不能小于10"
            }
          },
          desc: {
            label: "广告描述",
            component: {
              name: "el-input",
              props: {
                type: "textarea",
                autosize: { minRows: 3, maxRows: 5 },
                placeholder: "广告描述"
              }
            },
            value: "",
            rules: {
              check: (value, formData) => {
                // console.log(value, "----", typeof formData);
                if (value && value.length > formData.age) {
                  return "广告描述字数不能多于年龄值(" + formData.age + ")";
                } else {
                  return true;
                }
              },
              errMsg: "广告描述字数不能多于年龄"
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

<style lang="scss">
@import "@/static/css/mixins.scss";
.rules-details {
  @include display-flex;
  @include direction-h;
  line-height: 14px;
  font-size: 12px;
}
</style>
