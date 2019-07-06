# 验证/rules

字段rules, 格式：
```js
rules: {
  required: true,   // 默认为false
  emptyMsg: "不能为空",  // 为空的错误提示
  // checks可以是以下写成的数组 如 checks: [{...}, {...}]
  checks: {    // handler函数(非箭头函数时): this指向form
    trigger: "change",  // 检查的时机，多个时可写成"input change"或["change", "input"]
    handler: function(options) {} // options => {value, pathKey, idxChain, index}
  },
  errMsg: "格式不对" // checks后的错误信息提示
}
```
handler => options包含的属性：
- `value`： 需要检查的组件的值，表单的值可以通过this取出
- `pathKey`： 需要检查的组件的路径
- `idxChain`： 需要检查的组件所要数组所组成的id 如: 1,2
- `index`：组件处于数组的子节点(非孙子)时的索引，其余的返回-1

## 实例
```html
<es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>
```

## 简写

```js
data() {
    return {
      formValue: {
        // tel: "13826239999"
      },
      formSchema: {
        tel: {
          label: "手机号码",
          component: "el-input",
          value: "13826239999",
          rules: true // 直接写true,相当于{required: true, emptyMsg: "不能为空"}
        }
      }
    };
  }
```
## 标准写法

```js
data() {
    return {
      formValue: {
        // tel: "13826239999"
      },
      formSchema: {
        name1: {
          label: "姓名1",
          component: "el-input",
          value: "首页位置",
          col: 18,
          rules: {
            required: true,
            emptyMsg: "名称不能为空"
          }
        }
      }
    };
  }
```

## es写法

```js
data() {
    return {
      formValue: {
        // tel: "13826239999"
      },
      formSchema: {
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
        }
      }
    };
  }
```


## 自定义写法

```js
data() {
    return {
      formValue: {
        // tel: "13826239999"
      },
      formSchema: {
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
              // options => {value, pathKey, idxChain, index}
              handler: function(options) {
                var reg = /^1\d{10}$/;
                return reg.test(options.value);
              },
              trigger: "change"
            },
            errMsg: "手机号码为11位"
          }
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
            checks: ({value}) => {
              if (value && value.length > 10) {
                return "广告描述字数不能多于10"; // 直接返回错误信息
              } else {
                return true;
              }
            },
            errMsg: "广告描述输入有误"
          },
          desc: "rules.checks内返回字符串，也即是错误信息"
        }
      }
    };
  }
```
