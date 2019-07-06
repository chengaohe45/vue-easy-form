# 描述/desc

字段unit. 写法：
- `字符串`
- `es语法`
- `自定义组件`

## 实例
```html
<es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>
```

## 简写(字符串)

```js
data() {
    return {
      formValue: {
        // name: "默认小花"
      },
      formSchema: {
        name: {
          label: "广告名称",
          component: "el-input",
          value: "首页位置",
          // col: 12,
          desc: "一般的描述方法"
        }
      },
    };
  },
```

## es写法


```js
data() {
    return {
      formValue: {
        // name: "默认小花"
      },
      formSchema: {
        isJson: {
          label: "传输格式",
          component: {
            name: "el-switch",
            props: {
              activeText: "JSON格式",
              inactiveText: "XML格式"
            }
          },
          value: true
        },
        data: {
          label: "传输数据",
          component: {
            name: "el-input",
            props: {
              placeholder: "改变‘传输格式’试试"
            }
          },
          value: "",
          desc: "es: {{$root}}.isJson ? 'JSON格式' : 'XML格式'"
        }
      },
    };
  },
```


## 标准(组件化)写法


```js
data() {
    return {
      formValue: {
        // name: "默认小花"
      },
      formSchema: {
        note: {
          label: "备注",
          component: {
            name: "el-input",
            props: {
              placeholder: ""
            }
          },
          value: "",
          desc: {
            name: desc, // desc自定义的vue组件，可换行的desc
            props: {
              // ...
            }
          }
        }
      },
    };
  },
```



