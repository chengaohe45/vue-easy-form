# 单位/unit

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
        age: {
          label: "年龄", // 直接写label, component将会取系统默认的
          unit: "岁"
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
         esType: {
          label: "es方法",
          component: {
            name: "el-slider",
            props: {
              min: 10,
              max: 99
            }
          },
          value: 50,
          // col: 12,
          unit: "es: '单位' + {{$root.esType}}"
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
        name: {
          comType: {
            label: "组件方法",
            component: {
              name: "el-slider",
              props: {
                min: 10,
                max: 99
              }
            },
            value: 80,
            // col: 12,
            unit: {
              name: unit,   // unit就是自己定义的vue组件
              props: {
                num: "es: {{$root.comType}}"
              }
            }
          }
        }
      },
    };
  },
```



