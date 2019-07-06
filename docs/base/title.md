# 标题/title

title就是块(properties)的标题, 它在properties(同级)才有效

值：
- `false`： 默认值，没有标题
- `string`： 一个字符串，代表直接写标题
- `object`： 一个对象，见标准写法

## 实例
```html
<es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>
```

## 简写

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
          title: "背景信息",
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

## 标准写法

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
          title: {
            text: "背景信息",
            type: "bg-border",
            // 初始化时是否显示body(也就是properties的块)；当设置为true/false时，会打开切换按钮；默认为true, 但切换按钮不打开；
            showBody: true   
          },
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

### type值
- `''`： 什么样式都没有
- `bg`： 头部有背景
- `bg-block`： 有背景、左边有一竖
- `bg-border`： 有背景、body有边框
- `bg-block-border`： 有背景、body有边框、左边有一竖


