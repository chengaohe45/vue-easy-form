# rules

值：
- `false`： 默认值，label隐藏，空间不存在的
- `''`： 空值 但label空间是存在的
- `文字`： 有值

## 实例
```html
<es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>
```

## 简写

check字段

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
          rules: {
            required: true,   // 默认为false
            emptyMsg: "名称不能为空",  // 为空的错误提示
            check: "isMobile", // isMobile是系统提供的检查函数或引入时的扩展函数
            errMsg: "手机号码为11位" // check后的错误信息提示
          }
        }
      },
    };
  }
```
## 标准写法

check字段

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
          rules: {
            required: true,   // 默认为false
            emptyMsg: "名称不能为空",
            check: {  // 默认没有值
              name: "isMobile",
              params: [], // 需要给函数加的参数，数组，默认为空： 系统会这样解析： functionName(value, ...parmas)
              trigger: "change"
            },
            errMsg: "手机号码为11位"
          }
        }
      },
    };
  }
```


## 自定义写法

check字段

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
          rules: {
            required: true,   // 默认为false
            emptyMsg: "名称不能为空",
            check: (value, formData) => {   // 直接写成一个函数，系统会插入表单的值给用户进行个性化判断; 参数的值为：(value, formData),
              if (value.length > 10) {
                // return "姓名不能大于10个字";   // 当返回字符串，说明这个是错误提示；返回false, 那取errMsg
                return false;
              } else {
                return true;
              }
            },
            errMsg: "手机号码为11位"
          }
        }
      },
    };
  }
```

## es语句写法

check字段

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
          rules: {
            required: true,   // 默认为false
            emptyMsg: "名称不能为空",
            check: "es: {{$root.tel}}.length==11",  // $root为表单数据
            errMsg: "手机号码为11位"
          }
        }
      },
    };
  }
```

## 多个验证写法

check字段

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
          rules: {
            required: true,   // 默认为false
            emptyMsg: "名称不能为空",
            check: ["isMobile", (value, formData) => {}],  // 以上的写法组成一个数组
            errMsg: "手机号码为11位"
          }
        }
      },
    };
  }
```