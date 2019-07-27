# 标题/title

title就是块(properties)的标题, 它在properties(同级)才有效

值：
- `false`： 默认值，没有标题
- `string`： 一个字符串，代表直接写标题
- `object`： 一个对象，见组件化写法

## 实例
```html
<es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>
```

## 简写写法

```js
data() {
    return {
      formValue: {
        // name: "默认小花"
      },
      formSchema: {
        name: {
          label: "页面名称",
          component: "el-input",
          value: "首页位置"
        },
        base: {
          title: "背景信息",  // 直接文字
          label: false,
          properties: {
            image: {
              label: "背景图片",
              component: "el-input",
              value: ""
            },
            color: {
              label: "背景颜色",
              component: "el-color-picker",
              value: null
            }
          }
        },
      },
    };
  }
```

## 组件化写法

```js
data() {
    return {
      formValue: {
        // name: "默认小花"
      },
      formSchema: {
        name: {
          label: "页面名称",
          component: "el-input",
          value: "首页位置"
        },
        more: {
          ui: {
            showBody: true,
            hasBorder: true,
            padding: 20,
            rowSpace: 10
          },
          title: {
            name: title,  // title为自定义的组件
            props: {
              text: "自定义-组件化写法",
              color: "#000"
            }
          },
          label: false,
          properties: {
            whitelist: {
              label: "白名单",
              component: {
                name: "el-input"
              },
              value: "xiaoming.lo"
            },
            note: {
              label: "备注",
              component: {
                name: "el-input"
              },
              value: "备注就是这么简单"
            }
          }
        }
      },
    };
  }
```

