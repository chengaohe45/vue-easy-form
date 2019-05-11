# label

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
  },
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
          label: {
            text: "广告名称",
            size: ""        // auto or fixed 默认为没有设置，则label的长度将会是labelWidth
          },
          component: "el-input",
          value: "首页位置"
        }
      },
    };
  },
```

### size值
- `''`： 默认为没有设置，则label的长度将会是labelWidth
- `auto`： 项中有多少点多少。此值一般用于component
- `fixed`： label的文本占多宽就多宽。此值一般用于label


