# format

值：
- `array`： 枚举写法
- `object`： 函数写法

控制入值和输出的转换功能。比如：el-switch的值是一个boolean值，但是后台保存的是0/1(取和存)，此时就需要做转换

## 实例
```html
<es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>
```

## 枚举写法

写成一个数组，format的每一项的属性`outer`和`inner`是成对出现的。

- `outer`: 外部值
- `inner`: 对应的表单内部值

```js
data() {
    return {
      formValue: {
        // name: "默认小花"
      },
      formSchema: {
        status: {
          label: "状态",
          component: {
            name: "el-switch"
          },
          format: [
            {
              outer: 0,
              inner: false
            },
            {
              outer: 1,
              inner: true
            }
          ],
          value: true
        }
      },
    };
  },
```

## 函数写法

写成一个对象，format中包含两个属性`outer`和`inner`，这两个属性是一个函数，至少写一个。
- `outer`: 外部数据转换为表单内部数据的函数，参数value就是外部值
- `inner`: 表单内部数据转换为外部数据的函数，参数value就是内部值

::: warning
`inner` 所值入的参数value就是表单组件的值，这个值要进行健壮性判断。比如: 表单组件有值的情况返回一个数组，没有值的情况返回一个空数组，也有可能返回null值，主要是看组件怎么实现。
:::

```js
data() {
    return {
      formValue: {
        // name: "默认小花"
      },
      formSchema: {
        status: {
          label: "状态",
          component: {
            name: "el-switch"
          },
          format: {
            outer: (value) => {
              if (value == 0) {
                return false;
              } else {
                return true;
              }
            },
            inner: (value) => {
              if (value == true) {
                return 1;
              } else {
                return 0;
              }
            }
          },
          value: true
      },
    };
  },
```

