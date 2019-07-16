# 表单相关概念

## 根值

rootData: 表单中所有的值，包含隐藏的；也就是说有什么值就取什么值出来；用于操作`表单项组件`的逻辑控制

## 表单值

formValue: 表单中用户所需要的值（一般不包含隐藏的值、临时值；场景如下）；用于数据提交；可认为formValue是rootData的一个子集。

影响formValue的场景：
- 在表单逻辑控制中，一般隐藏的`表单项组件`不需要提交的(若需要提交, 可设置`hdValue`)；
- 在表单逻辑控制中，隐藏的`表单项组件`需要提交的指定的值(可设置`hdValue`)；
- 在`表单项组件`件显示中，有的值只是显示，但并不需要提交(可设置`isTmp`)

支持es语法的属性：
- `label`： 动态控制标签值
- `hidden`： 动态控制每一项是否显示
- `组件props对象的所有属性`： 动态控制组件的属性
- `required`： 动态控制组件是否必填
- `验证函数`： 用于rules.check的写法中，简洁快速

## es语法

es语法就一条`es:`为前缀的字符串，这个字符串可以用一定的规则解析出来

支持es语法的属性：
- `label`： 动态控制标签值
- `hidden`： 动态控制每一项是否显示
- `组件props对象的所有属性`： 动态控制组件的属性
- `required`： 动态控制组件是否必填
- `验证函数`： 用于rules.check的写法中，简洁快速



支持es有3个值，这两个值共同影响整个表单的属性：
1. `root`： 整个表单的`根值/rootData`. root在es语法中的写法是<span v-pre>`{{$root}}`</span>
2. `global`： 从表单中传入，用于外部对表单影响, 不设置则默认为`空对象`; global在es语法中的写法是<span v-pre>`{{$global}}`</span>
3. `index`：数组中孩子节点(非孙子节点))项所在的索引，其它节点(非孩子)节点此值是-1. index在es语法中的写法是<span v-pre>`{{$index}}`</span>
4. `hidden`： 用于判断某一项是否隐藏. hidden在es语法中的写法是<span v-pre>`{{$hidden(base.target)}}`</span>; 括号中是路径

### 示例
```html
<es-form 
  ref="form" 
  :schema="formSchema" 
  :global="globalValue" 
  v-model="formValue">
</es-form>
```

### 详细写法

```js
data() {
    return {

      formValue: {},

      globalValue: {
        isOpen: true
      },

      formSchema: {
        isOpen: {
          label: "是否打开",
          component: "el-switch",
          value: false
        },
        name: {
          label: "广告名称",
          component: "el-input",
          value: "首页位置",
          col: 12,
          rules: {
            required: "es: {{$root}}.isOpen ? true : false" // required
            check: "es: {{$root.name}}.length<=10",  // $root为表单数据
          }
        },
        delivery: {
          hidden: "es: {{$root}}.isOpen",
          label: "简单投放",
          component: "el-switch",
          value: false,
          col: 12
        },

        target: {
          hidden: "es: {{$hidden($root.delivery)}}", // $root.可不写
          title: {
            text: "投放目标",
            type: "bg-border"
          },
          label: false,
          properties: {
            name: {
              label: "es: {{$root}}.isOpen ? '姓名' : '姓名2'", // label
              component: {
                name: "el-input",
                props: {
                  disabled:
                    "es: {{$root}}.isOpen && {{$global.isOpen}} ? false : true" // 组件props属性
                }
              },
              value: "kyle.lo"
            },
            weight: {
              hidden: "es: {{$root}}.isOpen",
              hdValue: 0,
              col: 12,
              label: {
                text: "体重"
              },
              component: "el-input-number",
              unit: "公斤",
              value: 100
            }
          }
        },

        district: {
          title: {
            text: "投放地区",
            type: "bg-block-border"
          },
          hidden: "es: {{$root}}.isOpen", // hidden
          hdValue: null,
          label: false,
          properties: {
            province: {
              label: "省份",
              component: {
                name: "el-input"
              },
              value: "广东省"
            }
          }
        }
      }
    };
  }
```




