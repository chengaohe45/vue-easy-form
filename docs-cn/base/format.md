# 值转换

控制入值和输出值的转换<br/>
> `场景`：当外部值不是表单所需要的数据或类型时（比如：el-switch的值是一个boolean值，但是后台保存的是0/1），此时就需要做转换

`值转换`有两种形式写法：
- `枚举`： (推荐)
- `函数`： ---

字段（见`行高亮`）：
```js {8,23}
propName: {

  label: "label名称",
  properties: {
    status: {
      label: "名称",
      component: "el-switch",
      format: [   // 枚举写法：写成一个数组[{outer和inner一一对应}]
        {
          outer: 0,     // 表单输出的值或设置时用的值
          inner: false  // 转换为表单内部的值
        },
        {
          outer: 1,
          inner: true
        }
      ],
      value: false
    },
    isOpen: {
      label: "状态",
      component: "el-switch",
      format: {   // 函数写法：写成一个对象{outer函数, inner函数}
        outer: value => {   // 从外部值转化为内部值
          if (value == 0) {
            return false;   
          } else {
            return true;
          }
        },
        inner: value => {   // 从内部值转化为外部值
          if (value == true) {
            return 1;
          } else {
            return 0;
          }
        }
      },
      value: 1
    }
    // ... 其它项
  }
}
```



### 实例
<ClientOnly>
  <demo-block>

  ```html
  <es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>

  <script>
    export default {
      data() {
        return {

          formValue: {},

          formSchema: {
            name: {
              label: "广告名称",
              component: "el-input",
              value: "首页位置",
              col: 12
            },
            status: {
              label: "状态",
              rowHeight: 20,
              component: "el-switch",
              format: [   // 枚举写法：写成一个数组
                {
                  outer: 0,     // 表单输出的值或设置时用的值
                  inner: false  // 转换为表单内部的值
                },
                {
                  outer: 1,
                  inner: true
                }
              ],
              value: false,
              desc: "值转换：枚举写法"
            },

            isOpen: {
              label: "是否打开",
              rowHeight: 20,
              component: "el-switch",
              format: {   // 函数写法：写成一个对象{outer函数, inner函数}
                outer: value => {   // 从外部值转化为内部值
                  if (value == 0) {
                    return false;
                  } else {
                    return true;
                  }
                },
                inner: value => {   // 从内部值转化为外部值
                  if (value == true) {
                    return 1;
                  } else {
                    return 0;
                  }
                }
              },
              value: 1,
              desc: "值转换：函数写法"
            }
          }
        };
      }
    };
  </script>
  ```
  </demo-block>
</ClientOnly>

### 枚举写法

写成一个数组，每一项是一个对象，对象属性包含`outer`和`inner`，它们是一一对应的。
- `outer`: 表单输出的值或设置时用的值
- `inner`: 转换为表单内部的值

### 函数写法

写成一个对象，format中包含两个属性`outer`和`inner`，这两个属性是一个函数，至少写一个。
- `outer`: 外部数据转换为表单内部数据的函数，参数value就是外部值
- `inner`: 表单内部数据转换为外部数据的函数，参数value就是内部值

::: warning 注意
- 1. 只有在组件项（叶子节点）中有效；
- 2. 当是函数写法时，`inner` 所值入的参数value就是表单组件的值，这个值要进行健壮性判断。比如: 表单组件有值的情况返回一个数组，没有值的情况返回一个空数组，也有可能返回null值，主要是看组件怎么实现。
:::

