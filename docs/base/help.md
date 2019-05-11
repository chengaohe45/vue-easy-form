
# help

可全局设置

值：
- `string`： 提示的内容，会直接调用系统默认的"es-help"组件
- `object`： 就是组件的写法，不过没有actions事件

## 实例
```html
<es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>
```

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
          value: "首页位置"
        },
        help: "提示的内容"
      },
    };
  },
```
## 系统帮助组件

简写

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
          value: "首页位置"
        },
        help: "提示的内容"      // 提示的内容，会直接调用系统默认的"es-help"组件
      },
    };
  },
```

上面的写法其实就是

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
          value: "首页位置"
        },
        help: {
          name: "es-help",
          props: {
            content: "提示的内容",
            maxWidth: 200,
            // href: "http://www.qq.com",
            placement: "top"
          }
        }
      },
    };
  },
```


## 自定义帮助组件

其实就是一个组件的写法，不过没有actions事件

```js
data() {
    return {
      formValue: {
        // name: "默认小花"
      },
      formSchema: {
        name: {
          label: {
            text: "广告名称",
            size: ""        // auto or fixed 默认为没有设置，则label的长度将会是labelWidth
          },
          component: "el-input",
          value: "首页位置"，
          help: {
            name: "g-help",   // 这个就是自定义的帮助组件
            props: {          // 组件的属性
              content: "这个是自定义的help", 
              href: "http://www.qq.com"
            }
          }
        }
      },
    };
  },
```


