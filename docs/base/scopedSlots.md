# 组件插槽

字段：`scopedSlots`

## 配置格式
``` js
// attrName为某个属性的索引，如: label, title, component
`attrName`: {         // 若是一个对象，可写成一个Object
  name: "el-select", // 组件名，组件名不支持动态解析
  
  //... 组件的其它配置：如 style class props

  // 写法一：若是字符串，数值，布尔，函数，则可简写
  scopedSlots: "123",   // 则默认的slotName为default

  // 写法二：数组
  scopedSlots: [];  // 内容可为字符串，数值，布尔，组件对象，但不能是函数（可以用函数返回数组）

  // 写法三：对象（键值对）：指出匹配哪个slotName
  scopedSlots: {  // 插槽：键值对写法：具体见“组件插槽”

    default: {  // 自定义组件，支持动态解析：scopedSlots必须指定slotName
      // hidden: false,   // 控制是否隐藏
      name: "el-tag",
      text: "测试slot"
    },

    slotName1: "slotName1测试",

    slotName2: ["slotName1测试"],   // 内容可为字符串，数值，布尔，组件对象，但不能是函数（可以用函数返回数组）

    // data => {global, rootData, root, pathKey, idxChain, index, $hidden} 见动态解析函数写法
    // scoped => 作用域插槽所携带的值
    slotName3: function(data, scoped) {

      // 返回值可返回：字符串，数值，布尔，组件，虚拟节点
      // 组件: 这里不支持动态了，用户可用data和scoped改造组件
      return {
        name: "el-tag",
        text: "测试slot"
      };

      // jsx写法：返回虚拟节点
      // 为了兼容低版本的vue，无论是否使用scoped，虚拟节点都必须在函数里面返回
      return <span>{scoped.color}</span>;

      // 返回数组
      return [];

      // 返回null，undefined
      return undefined; // 说明此插槽为空
    }
  }

}
```
[动态解析 > 函数写法](./parse.md#函数写法)

### 实例
<ClientOnly>
  <demo-custom hash="#scopedSlots">
  <slots-scoped slot="demo"></slots-scoped>

  <<< @/docs/.vuepress/components/slots/scoped.vue
  <hr class="divider-line"/>

  <<< @/docs/../src/components/units/slot.vue
  </demo-custom>
</ClientOnly>

