# 验证/rules

字段rules, 格式：
```js
rules: {
  required: true,   // 默认为false，支持动态解析
  emptyMsg: "不能为空",  // 为空的错误提示；默认值：不能为空
  showRequired: true,   // v1.6.4；是否显示星号，当required为true有用；常用于数组内容，可能太多"星号"不好看
  emptyMethod: function(options) { // v1.6.3；代替系统的空值检查函数：检查此值是否为空
    // 默认是不存在的，不设置则会取系统默认的空值检查函数，见下面“空值”
    // 返回true或字符串则表示为空；若返回值为字符串，则是提示的信息，否则取‘emptyMsg’
    // 其它代表不为空
    return true;
  },  
  // checks可以是以下写成的数组 如 checks: [{...}, {...}]
  checks: {    // handler函数(非箭头函数时): this指向form
    trigger: "change",  // 检查的时机，多个时可写成"input change"或["change", "input"]
    handler: function(options) { // options => {value, pathKey, idxChain, index}
      // 返回true表示验证通过；其它值都认为验证不通过
      // 若返回值为字符串，则是提示的信息，否则取‘errMsg’
      return true;
    }
  },
  errMsg: "格式不对", // checks后的错误信息提示；默认值：格式不对
  // class和style是错误信息的样式补充，支持动态解析：一般用于表单数组的错误信息
  class: undefined, // v1.6.2；vue中class接受的类型：字符串，对象，数组
  style: undefined  // v1.6.2；类型：对象
}
```
handler => options包含的属性：
- `value`： 需要检查的组件的值，表单的值可以通过this取出
- `pathKey`： 需要检查的组件的路径
- `idxChain`： 需要检查的组件所要数组所组成的id 如: 1,2
- `index`：组件处于数组的子节点(非孙子)时的索引，其余的返回-1

### 实例

<ClientOnly>
  <demo-block :canOperate="true">

  ```html
  <es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>

  <script>
    export default {
      data() {
        return {

          formValue: {},

          formSchema: {
            properties: {
              name1: {
                label: "姓名1",
                component: "el-input",
                value: "天天1",
                col: 18,
                rules: {  // 常规写法
                  required: true,
                  emptyMsg: "名称不能为空"
                }
              },
              name2: {
                label: "姓名2",
                component: "el-input",
                value: "天天2",
                col: 18,
                rules: true,  // 简写：相当于 {required: true, emptyMsg: "不能为空"}
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
                  required: "es: $root.isOpen",   // es写法
                  // emptyMethod: function(data) {   // 函数写法
                  //   return !data.value.trim();
                  // },
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
                    // options: {value, pathKey, idxChain, index}
                    handler: function(options) {
                      console.log("options: ", options);
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
                    handler: function(data) {
                      var value = data.value;
                      return value > 10;
                    },
                    trigger: ""   // 为空，则是提交时再验证
                  },
                  errMsg: "年龄不能小于10"
                },
                desc: "调减试试"
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
                      return "广告描述字数不能多于10";    // 返回字符串
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
      }
    };
  </script>
  ```
  </demo-block>
</ClientOnly>

### trigger
trigger是指验证时机，当其为`空字符串`时则是提交（[form.checkAll()](./form.md#表单方法)）时再验证。

### 空值
- `空值有哪些`: 当不设置`emptyMethod`，则系统认为这些都为空值：`undefined`, `null`, 空对象`{}`, 空数组`[]`, 空字符串`''`
>`rules.required`和`rules.checks`是一个互补的关系，`rules.required`是检查`空值`；`rules.checks`是检查`有值`(也就是说空值是不会进入检查)，系统的检查顺序是：先判断是否有值，有值的话再执行`rules.checks`。应用场景如：当输入一个手机号码，要么不输入，要么输入正确；若想手机号码不可为空，此需要设置rules.required为true。
