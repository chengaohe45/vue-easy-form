# 项标签/label

值：
- `false`： 默认值，label隐藏，空间不存在的
- `''`： 空值 但label空间是存在的
- `文字`： 有值

## 实例
```html
<es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>
```

## 简写1

```js
data() {
    return {
      formValue: {
        // name: "默认小花"
      },
      formSchema: {
        name: {
          label: "广告名称"  // 直接写label, component将会取系统默认的
        }
      },
    };
  },
```

## 简写2

```js
data() {
  return {
    formValue: {
      // name: "默认小花"
    },
    formSchema: {
      name: "广告名称"   // 直接写在属性上，判断若是字符串，则是label的值
    },
  };
}
```

## es写法

```js
data() {
  return {
    formValue: {
      // name: "默认小花"
    },
    formSchema: {
      isOpen: {
        label: "开关",
        component: "el-switch",
        value: true
      },

      esLabel: {
        label: "es: '广告标签' + ({{$root}}.isOpen ? '(开)' : '(关)')",
        component: {
          name: "el-input",
          props: {
            placeholder: "切换开关试试"
          }
        },
        rules: true,
        value: ""
      }
    },
  };
}
```


## 标准(组件化)写法


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
            // flex: "self",       // self or full; 默认为没有设置，则会是labelWidth
            // align: "left",      // left, center, right
            // name: "span",       // 引入自定义组件
            // props: {
            //   // name的属性
            // }
          },
          component: "el-input",
          value: "首页位置"
        }
      },
    };
  },
```

### flex值
- `''`： 默认为没有设置，则label的长度将会是labelWidth
- `full`： 项中有多少点多少。此值一般用于component
- `self`： label的文本占多宽就多宽。此值一般用于label


