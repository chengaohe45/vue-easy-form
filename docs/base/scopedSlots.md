# 组件插糟

字段：`scopedSlots`<br/>
值类型有：
- `string`： 全局组件名
- `object`： 一个对象，见[组件格式](./com-format.md)

### 实例
<ClientOnly>
  <demo-block hash="#/component">

  ```html
  <es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>

  <script>
    export default {
      data() {
        return {

          formValue: {},

          formSchema: {

            // 写法一
            name: {
              label: "广告名称",
              component: "el-input",  // 全局组件名；不写的话，采用系统默认的
              value: "首页位置"
            },
            
            // 写法二：组件写法
            target: {
              label: "投放目标",
              component: {
                name: "el-input",
                props: {
                  placeholder: "请输入投放目标"
                },
                // ref: "testRef",   // 索引值，可以通过 form.getRef("testRef")取出
                // actions: [],       // 见下面
                // value: "首页位置"   // 组件的默认值
              },
              value: "中年人"   // 组件的默认值也可写在这里，优先级高于component.value
            },

            // 以下是其它属性，见注释
            color: {
              label: {
                text: "主题颜色",
                align: "center"   // 文本居中
              },
              direction: "v", // 上下排版
              component: {
                name: "el-color-picker",
                flex: "self",   // 设置了flex=self是为了项组件区域的宽度就是组件的宽度
                align: "center" // 组件居中
              },
              value: "#67C23A",
              desc: {
                name: "div",
                style: {
                  textAlign: "center"
                },
                text: "设置了flex=self是为了项组件区域的宽度就是组件的宽度"
              }
            },

            regions: {
              label: "投放区域",
              component: {
                name: "g-select", // g-select是自定义全局组件；也可以是import导入的局部组件
                props: {
                  placeholder: "请选择活动区域",
                  clearable: true,
                  multiple: true,
                  options: [{ text: "广东", id: "广东id" }, { text: "北京", id: "北京id" }]
                },
                flex: "full"  // 设置了flex=full是为了使组件的宽度占满整个项区域
              },
              value: [],
              col: 18,
              desc: "设置了flex=full是为了使组件的宽度占满整个项组件区域"
            }
          }
        };
      }
    };
  </script>
  ```
  </demo-block>
</ClientOnly>

### 组件详解

| 属性名 | 说明 | 类型 | 可选值| 默认值
| -- | -- | -- | -- | -- 
| align | 文本的方向 | string | `left`、`center`、`right` | --
| flex | component的长度控制 | string | `""`：component的长度根据自身情况自动取值<br><br>`full`： 项中有多少点多少。此值一般用于component<br><br>`self`： label的文本占多宽就多宽。此值一般用于label | --
| ref | vue组件的ref | string | -- | --
| 其它 | 跟[组件格式](./com-format.md)一样 | -- | -- | --

### value值
- 通常在编写项（如：advName）时，component直接写成组件名，所以value写在外面（跟component同级）也是可以的
- 写在外面的value只有在`项组件`中有效，且优先级高于component.value

::: warning 注意
由于`项组件隐藏`是没有任何的意义，所以`component.hidden`这个属性设置是不存在的；这个跟其它可组件化的属性（如：[项标签label](./label.md)、[描述desc](./desc.md)、[帮助help](./help.md)、[单元unit](./unit.md)、[标题title](./title.md)）不同。
:::


### actions组件事件
字段：component.actions；配置格式见[组件写法->组件事件](./com-format.md#组件事件)

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
            isGood: {
              label: "",    // 占位置，但不显示文字
              component: {
                name: "el-checkbox",
                text: "是否好人",
                actions: {
                  trigger: "change",
                  // options => {value, event, pathKey, index, idxChain,target}
                  handler: function(options) {
                    // console.log("this对象: ", this);
                    console.log("options: ", options);
                    if (options.value) {
                      this.$message({
                        message: "恭喜你，这是一条好人消息",
                        type: "success"
                      });
                    } else {
                      this.$message({
                        message: "警告哦，这是一条坏人消息",
                        type: "warning"
                      });
                    }
                  }
                }
              },
              value: true,
              col: 12
            },
            desc: {
              label: "es: $root.isGood ? '好人描述' : '描述'",
              component: {
                name: "el-input",
                props: {
                  placeholder: "es: $root.isGood ? '好人描述要讲多点' : '一般描述啦'"
                },
                ref: "desc"
              },
              value: ""
            }
          }
        };
      }
    };
  </script>
  ```
  </demo-block>
</ClientOnly>

函数handler返回的参数options包含的信息有：
- `value`： 当前项组件的值，表单的值可以通过this取出
- `args`<Badge text="1.6.2"/>： 事件本身所携带的信息(就是函数的局部变量`arguments`)；如`keyup.native`,可以从这里提取键值；
- `event`： 事件本身所携带的第一个信息, 也就是`args[0]`
- `target`： 当前项组件(若是`数组事件`，这个为`null`)
- `pathKey`： 需要检查的组件的路径
- `idxChain`： 需要检查的组件所要数组所组成的id 如: 1,2
- `index`：组件处于数组的子节点(非孙子)时的索引，其余的返回-1
> 注：[数组事件](./array.html#数组事件)是没有target信息的
